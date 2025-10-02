# ScrapeYard/crawlers/dynamic_headless/run.py
import asyncio
import sys
import json
from pathlib import Path
from .crawler import DynamicHeadlessCrawler


async def main():
    default_config = Path(__file__).parent / "config.json"
    config_path = default_config if len(sys.argv) == 1 else Path(sys.argv[1])

    if not config_path.exists():
        print(f"Config not found: {config_path}")
        sys.exit(1)

    config = json.loads(config_path.read_text())
    crawler = DynamicHeadlessCrawler(config)
    await crawler.crawl()
    print(f"Done! Output saved to: {config['output']['path']}")


if __name__ == "__main__":
    asyncio.run(main())