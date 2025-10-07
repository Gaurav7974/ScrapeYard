import os
import json
import time
import logging
import re
from urllib.parse import urljoin, urlparse
from collections import deque

import requests
from bs4 import BeautifulSoup
from tqdm import tqdm

# Optional Selenium
SELENIUM_AVAILABLE = False
try:
    from selenium import webdriver
    from selenium.webdriver.chrome.options import Options
    from selenium.webdriver.chrome.service import Service
    from webdriver_manager.chrome import ChromeDriverManager
    SELENIUM_AVAILABLE = True
except ImportError:
    pass

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


class RedTeamSelfAuditCrawler:
    """Minimal red-team style site audit crawler."""

    def __init__(self, site_config, global_config):
        self.name = site_config["name"]
        self.base_url = site_config["base_url"].rstrip("/")
        self.domain = urlparse(self.base_url).netloc

        # Config
        self.max_pages = global_config.get("max_pages_per_site", 500)
        self.delay = global_config.get("delay", 0.8)
        self.use_selenium = global_config.get("use_selenium", True)
        self.bruteforce_paths = global_config.get("bruteforce_paths", True)

        # Output
        self.output_dir = os.path.join(global_config.get("output_dir", "output"), self.name)
        os.makedirs(self.output_dir, exist_ok=True)

        # HTTP session
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36'
        })

        # State
        self.visited = set()
        self.to_visit = deque()
        self.data = []
        self.driver = None

        # Optional wordlist for path discovery
        self.wordlist = []
        if self.bruteforce_paths and os.path.exists("wordlist.txt"):
            with open("wordlist.txt", "r") as f:
                self.wordlist = [line.strip() for line in f if line.strip()]

    def _setup_selenium(self):
        if not SELENIUM_AVAILABLE:
            return None
        chrome_options = Options()
        chrome_options.add_argument("--headless")
        chrome_options.add_argument("--no-sandbox")
        chrome_options.add_argument("--disable-dev-shm-usage")
        chrome_options.add_argument("--disable-gpu")
        service = Service(ChromeDriverManager().install())
        return webdriver.Chrome(service=service, options=chrome_options)

    def seed_urls(self):
        # Seed starting URLs (base, sitemap, wordlist paths, pagination)
        self.to_visit.append(self.base_url)

        try:
            resp = self.session.get(urljoin(self.base_url, '/sitemap.xml'), timeout=10)
            if resp.status_code == 200:
                soup = BeautifulSoup(resp.content, 'xml')
                for loc in soup.find_all('loc'):
                    u = loc.get_text().strip()
                    if self._is_same_domain(u):
                        self.to_visit.append(u)
        except:
            pass

        if self.wordlist:
            for path in self.wordlist:
                self.to_visit.append(urljoin(self.base_url, path))
                for ext in ['', '.php', '.html', '.bak', '.zip', '.sql']:
                    self.to_visit.append(urljoin(self.base_url, path + ext))

        for i in range(1, 101):
            self.to_visit.append(urljoin(self.base_url, f'page/{i}'))
            self.to_visit.append(f"{self.base_url}?page={i}")

    def _is_same_domain(self, url):
        return urlparse(url).netloc == self.domain

    def _fetch_with_requests(self, url):
        try:
            resp = self.session.get(url, timeout=10)
            return resp.status_code, resp.content, resp.url
        except:
            return None, None, None

    def _fetch_with_selenium(self, url):
        if not self.use_selenium or not SELENIUM_AVAILABLE:
            return None, None, None
        if not self.driver:
            self.driver = self._setup_selenium()
        if not self.driver:
            return None, None, None
        try:
            self.driver.get(url)
            time.sleep(2)
            for _ in range(3):
                self.driver.execute_script("window.scrollTo(0, document.body.scrollHeight)")
                time.sleep(1.5)
            return 200, self.driver.page_source.encode('utf-8'), url
        except:
            return None, None, None

    def _extract_insights(self, content, url, status_code):
        # Parse and extract simple indicators
        soup = BeautifulSoup(content, 'html.parser')
        full_text = soup.get_text()

        sensitive_patterns = [
            r'password', r'admin', r'config', r'debug', r'backup',
            r'secret', r'api[_-]?key', r'token', r'credentials',
            r'username', r'login', r'dashboard', r'phpinfo'
        ]

        sensitive_found = []
        for pattern in sensitive_patterns:
            if re.search(pattern, full_text, re.IGNORECASE):
                sensitive_found.append(pattern)

        links = []
        for a in soup.find_all('a', href=True):
            href = urljoin(url, a['href'])
            if self._is_same_domain(href):
                links.append(href)

        emails = re.findall(r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b', full_text)
        youtube_links = re.findall(r'(https?://(?:www\.)?(?:youtube\.com|youtu\.be)/[^\s"]+)', full_text)

        return {
            "url": url,
            "status_code": status_code,
            "title": soup.title.string.strip() if soup.title else '',
            "text_preview": full_text[:500].replace('\n', ' '),
            "emails_found": list(set(emails)),
            "youtube_links": list(set(youtube_links)),
            "sensitive_keywords": sensitive_found,
            "internal_links": links,
            "forms_count": len(soup.find_all('form')),
            "scripts_count": len(soup.find_all('script'))
        }

    def crawl(self):
        # Main crawl loop
        self.seed_urls()
        logger.info(f"[{self.name}] Starting red-team audit | Queue: {len(self.to_visit)}")
        pbar = tqdm(total=self.max_pages, desc=self.name)

        while self.to_visit and len(self.visited) < self.max_pages:
            url = self.to_visit.popleft()
            if url in self.visited:
                continue
            self.visited.add(url)
            pbar.update(1)

            status, content, final_url = self._fetch_with_requests(url)
            used_selenium = False

            if status is None or status >= 400:
                self.data.append({
                    "url": url,
                    "status_code": status or "ERROR",
                    "title": "",
                    "sensitive_keywords": [],
                    "emails_found": [],
                    "youtube_links": [],
                    "internal_links": []
                })
                time.sleep(self.delay)
                continue

            if content:
                item = self._extract_insights(content, final_url, status)
                self.data.append(item)
                for link in item["internal_links"]:
                    if link not in self.visited and link not in self.to_visit:
                        self.to_visit.append(link)

            time.sleep(self.delay)

        pbar.close()
        return self.data

    def save_results(self):
        # Persist results and quick risk summary
        with open(os.path.join(self.output_dir, "full_crawl.json"), 'w', encoding='utf-8') as f:
            json.dump(self.data, f, indent=2, ensure_ascii=False)

        high_risk = [
            item for item in self.data
            if item.get("sensitive_keywords") or item.get("emails_found") or item["status_code"] == 200
        ]
        with open(os.path.join(self.output_dir, "RISK_FINDINGS.json"), 'w', encoding='utf-8') as f:
            json.dump(high_risk, f, indent=2, ensure_ascii=False)

        total_pages = len(self.data)
        sensitive_pages = len([d for d in self.data if d.get("sensitive_keywords")])
        emails_found = set()
        for d in self.data:
            emails_found.update(d.get("emails_found", []))

        summary = {
            "site": self.name,
            "base_url": self.base_url,
            "total_pages_crawled": total_pages,
            "pages_with_sensitive_content": sensitive_pages,
            "emails_exposed": list(emails_found),
            "recommendation": "Review all pages with status 200 and sensitive keywords. Block unintended paths in server config."
        }
        with open(os.path.join(self.output_dir, "SUMMARY.json"), 'w', encoding='utf-8') as f:
            json.dump(summary, f, indent=2, ensure_ascii=False)

        logger.info(f"[{self.name}] Red-team audit complete. Check {self.output_dir}")


# MAIN
def main():
    with open("targets.json", "r", encoding="utf-8") as f:
        config = json.load(f)

    for site in config["sites"]:
        try:
            crawler = RedTeamSelfAuditCrawler(site, config["global"])
            crawler.crawl()
            crawler.save_results()
        except KeyboardInterrupt:
            print("\nStopped by user")
            break
        except Exception as e:
            logger.error(f"Failed on {site['name']}: {e}")


if __name__ == "__main__":
    main()
