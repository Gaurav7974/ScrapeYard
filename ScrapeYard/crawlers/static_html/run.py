# ScrapeYard/crawlers/static_html/run.py
import asyncio
import sys
import json
from pathlib import Path
from .crawler import StaticHTMLCrawler


async def main(): 
     # Set the default config file to be in the same directory as this script
    default_config = Path(__file__).parent / "config.json"

    if len(sys.argv) == 1:
        config_path = default_config
        print(f"Using default config: {config_path}")
    elif len(sys.argv) == 2:
        config_path = Path(sys.argv[1])
    else:
        print("Usage: python -m crawlers.static_html.run [config.json]")
        sys.exit(1)

    if not config_path.exists():
        print(f"Error: Config file not found at {config_path.absolute()}")
        sys.exit(1)
    #JSON config load here!!
    config = json.loads(config_path.read_text())
    crawler = StaticHTMLCrawler(config)
    await crawler.crawl()
    print(f"Done! Output saved to: {config['output']['path']}")

if __name__ == "__main__":
    asyncio.run(main())