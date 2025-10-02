# ScrapeYard/crawlers/dynamic_headless/crawler.py
import asyncio
import time
from pathlib import Path
from playwright.async_api import async_playwright, TimeoutError as PlaywrightTimeoutError
from ..utils import write_items


class DynamicHeadlessCrawler:
    def __init__(self, config: dict):
        self.config = config
        self.items = []
        self.browser = None
        self.context = None

    async def _launch_browser(self):
        """Launch a realistic browser context."""
        playwright = await async_playwright().start()
        self.browser = await playwright.chromium.launch(headless=True)
        self.context = await self.browser.new_context(
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
            viewport={"width": 1280, "height": 720},
            locale="en-US",
            timezone_id="America/New_York"
        )

    async def _extract_items(self, page, url: str):
        """Extract data with timeout and error handling."""
        extract_config = self.config.get("extract", {})
        list_selector = extract_config.get("list_selector")

        try:
            if list_selector:
                # Wait for items to appear (max 15 seconds)
                await page.wait_for_selector(list_selector, timeout=15000)
                items = await page.query_selector_all(list_selector)
                for item in items:
                    record = {"url": url}
                    item_fields = extract_config.get("item_fields", {})
                    for key, selector in item_fields.items():
                        if selector == "":
                            text = await item.text_content()
                        else:
                            el = await item.query_selector(selector)
                            text = await el.text_content() if el else None
                        record[key] = text.strip() if text else None
                    self.items.append(record)
            else:
                # Page-level extraction
                record = {"url": url}
                page_fields = extract_config.get("fields", {})
                for key, selector in page_fields.items():
                    el = await page.query_selector(selector)
                    text = await el.text_content() if el else None
                    record[key] = text.strip() if text else None
                self.items.append(record)

        except PlaywrightTimeoutError:
            print(f"Timeout: No content found on {url}. Saving debug screenshot.")
            debug_path = Path("./debug") / f"timeout_{int(time.time())}.png"
            debug_path.parent.mkdir(exist_ok=True)
            await page.screenshot(path=str(debug_path))
            return

    async def _handle_pagination(self, page, url: str):
        """Handle pagination: next button or infinite scroll."""
        paginate = self.config.get("paginate", {})
        ptype = paginate.get("type")

        if ptype == "next":
            next_selector = paginate.get("next_selector")
            if next_selector:
                next_btn = await page.query_selector(next_selector)
                if next_btn:
                    await next_btn.click()
                    await page.wait_for_load_state("networkidle")
                    return True

        elif ptype == "infinite":
            last_height = await page.evaluate("document.body.scrollHeight")
            scroll_limit = paginate.get("scroll_limit", 5)
            for _ in range(scroll_limit):
                await page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
                await asyncio.sleep(2)
                new_height = await page.evaluate("document.body.scrollHeight")
                if new_height == last_height:
                    break
                last_height = new_height
            return True

        return False

    async def crawl(self):
        await self._launch_browser()

        for start_url in self.config["start_urls"]:
            print(f"Crawling (dynamic): {start_url}")
            page = await self.context.new_page()
            try:
                await page.goto(start_url, wait_until="networkidle", timeout=30000)
                await self._extract_items(page, start_url)

                max_pages = self.config.get("max_pages", 1)
                for _ in range(1, max_pages):
                    if not await self._handle_pagination(page, start_url):
                        break
                    await self._extract_items(page, page.url)

            except Exception as e:
                print(f"Error during crawl of {start_url}: {e}")
            finally:
                await page.close()

        await self.browser.close()
        await write_items(self.items, self.config["output"])