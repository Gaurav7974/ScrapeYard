import asyncio
import time
import json
from urllib.robotparser import RobotFileParser
from urllib.parse import urljoin, urlparse
import httpx
from tenacity import retry, stop_after_attempt, wait_exponential


class PoliteCrawler:
    """Handles respectful crawling: robots.txt, delays, and retries."""

    def __init__(self, domain: str, user_agent: str, delay: float = 1.0):
        self.domain = domain
        self.user_agent = user_agent
        self.delay = delay
        self.last_request = 0
        self.robot_parser = None
        self._init_robots()

    def _init_robots(self):
        """Fetch and parse robots.txt if available."""
        robots_url = f"https://{self.domain}/robots.txt"
        try:
            resp = httpx.get(robots_url, timeout=10)
            if resp.status_code == 200:
                self.robot_parser = RobotFileParser()
                self.robot_parser.parse(resp.text.splitlines())
        except Exception:
            # Ignore failures (e.g., no robots.txt or network error)
            pass

    def can_fetch(self, url: str) -> bool:
        """Check if crawling this URL is allowed by robots.txt."""
        if not self.robot_parser:
            return True
        return self.robot_parser.can_fetch(self.user_agent, url)

    @retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=1, min=2, max=10))
    async def fetch(self, url: str) -> httpx.Response:
        """Fetch a URL with politeness and retry logic."""
        if not self.can_fetch(url):
            raise PermissionError(f"robots.txt disallows {url}")

        # Enforce crawl delay
        now = time.time()
        wait_time = self.delay - (now - self.last_request)
        if wait_time > 0:
            await asyncio.sleep(wait_time)

        async with httpx.AsyncClient(headers={"User-Agent": self.user_agent}) as client:
            resp = await client.get(url)
            resp.raise_for_status()
            self.last_request = time.time()
            return resp


async def write_items(items: list[dict], output_config: dict):
    """Write extracted items to JSONL or CSV."""
    from pathlib import Path

    output_path = Path(output_config["path"])
    output_path.mkdir(parents=True, exist_ok=True)
    filepath = output_path / f"output.{output_config['format']}"

    if output_config["format"] == "jsonl":
        with open(filepath, "w", encoding="utf-8") as f:
            for item in items:
                f.write(json.dumps(item, ensure_ascii=False) + "\n")
    elif output_config["format"] == "csv" and items:
        import csv
        with open(filepath, "w", newline="", encoding="utf-8") as f:
            writer = csv.DictWriter(f, fieldnames=items[0].keys())
            writer.writeheader()
            writer.writerows(items)