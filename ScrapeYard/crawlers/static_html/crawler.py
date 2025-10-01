import asyncio
from urllib.parse import urljoin, urlparse
from bs4 import BeautifulSoup
from ..utils import PoliteCrawler, write_items


class StaticHTMLCrawler:
    def __init__(self, config: dict):
        self.config = config
        self.polite = PoliteCrawler(
            domain=config["domain"],
            user_agent=config.get("user_agent", "ScrapeYard (+https://github.com/scrapyard)"),
            delay=1.0
        )
        self.visited = set()
        self.queue = list(config["start_urls"])
        self.items = []

    def _should_follow(self, url: str) -> bool:
        """Check if a URL should be crawled based on domain and allow/deny rules."""
        if not url.startswith(("http://", "https://")):
            return False
        if urlparse(url).netloc != self.config["domain"]:
            return False
        if url in self.visited:
            return False

        # Skip if any deny pattern matches
        for pattern in self.config.get("follow_deny", []):
            if pattern in url:
                return False

        # If allow list exists, require a match
        allow_patterns = self.config.get("follow_allow", [])
        if allow_patterns:
            return any(p in url for p in allow_patterns)

        return True

    def _extract_items(self, soup: BeautifulSoup, base_url: str):
        """Extract structured data — either a single record or a list of items."""
        extract_config = self.config.get("extract", {})
        list_selector = extract_config.get("list_selector")

        if list_selector:
            # Extract multiple items (e.g., quotes, products)
            items = soup.select(list_selector)
            for item in items:
                record = {"url": base_url}
                item_fields = extract_config.get("item_fields", {})
                for key, selector in item_fields.items():
                    if selector == "":
                        el = item  # Use the element itself
                    elif selector.startswith("next+"):
                        # Get the next sibling of a given tag (e.g., "next+p")
                        tag_name = selector.split("+", 1)[1]
                        el = item.find_next_sibling(tag_name)
                    else:
                        el = item.select_one(selector)
                    record[key] = el.get_text(strip=True) if el else None
                self.items.append(record)
        else:
            # Extract a single page-level record
            record = {"url": base_url}
            page_fields = extract_config.get("fields", {})
            for key, selector in page_fields.items():
                if selector.startswith("next+"):
                    tag_name = selector.split("+", 1)[1]
                    first_el = soup.find(tag_name)
                    el = first_el.find_next_sibling(tag_name) if first_el else None
                else:
                    el = soup.select_one(selector)
                record[key] = el.get_text(strip=True) if el else None
            self.items.append(record)

    async def crawl(self):
        """Run the crawl loop: fetch pages, extract data, follow links."""
        pages = 0
        max_pages = self.config.get("max_pages", 100)

        while self.queue and pages < max_pages:
            url = self.queue.pop(0)
            if url in self.visited:
                continue
            self.visited.add(url)

            try:
                print(f"Crawling: {url}")
                resp = await self.polite.fetch(url)
                soup = BeautifulSoup(resp.text, "html.parser")

                self._extract_items(soup, url)

                # Handle "Next" pagination if configured
                paginate = self.config.get("paginate", {})
                if paginate.get("type") == "next":
                    next_selector = paginate.get("next_selector")
                    if next_selector:
                        next_el = soup.select_one(next_selector)
                        if next_el and next_el.get("href"):
                            next_url = urljoin(url, next_el["href"])
                            if self._should_follow(next_url):
                                self.queue.append(next_url)

                # Discover internal links (only for page-level extraction)
                if not self.config.get("extract", {}).get("list_selector"):
                    for link in soup.find_all("a", href=True):
                        full_url = urljoin(url, link["href"])
                        if self._should_follow(full_url):
                            self.queue.append(full_url)

                pages += 1

            except Exception as e:
                print(f"Error at {url}: {e}")
                continue

        await write_items(self.items, self.config["output"])