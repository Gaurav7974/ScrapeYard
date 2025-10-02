import React, { useState, useEffect } from "react";
import {
  ChevronRight,
  Star,
  GitBranch,
  Code2,
  Globe,
  ExternalLink,
  Sparkles,
  Search,
  Github,
} from "lucide-react";

// --- Code Preview ---
const CodePreview = () => {
  const codeLines = [
    "import scrapy",
    "class ProductSpider(scrapy.Spider):",
    "    name = 'products'",
    "    start_urls = ['https://example.com/products']",
    "    def parse(self, response):",
    "        for product in response.css('.product'):",
    "            yield {'name': product.css('.title::text').get(),",
    "                   'price': product.css('.price::text').get()}",
    "        yield response.follow_all(css='a.next')",
  ];

  return (
    <div className="bg-gray-900 rounded-xl shadow-xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
        <div className="flex items-center gap-3 text-sm text-gray-300">
          <span className="text-green-400 font-mono">scraper.py</span>
          <span className="text-gray-400">Python • Scrapy</span>
          <span className="flex items-center gap-1 ml-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            Live
          </span>
        </div>
        <ExternalLink className="w-4 h-4 text-gray-400" />
      </div>

      {/* Code body */}
      <div className="p-4 font-mono text-sm leading-relaxed text-emerald-400">
        {codeLines.map((line, i) => (
          <div key={i} className="flex">
            <span className="text-gray-600 mr-4 w-6 text-right">{i + 1}</span>
            <span>{line}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- Scraper Card ---
const ScraperCard = ({ title, stars, language, description }) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md transition-all">
      <div className="flex items-start justify-between mb-2">
        <div>
          <h3 className="font-semibold text-gray-900 text-sm">{title}</h3>
          <p className="text-xs text-gray-500">{description}</p>
        </div>
        <Code2 className="w-4 h-4 text-gray-400" />
      </div>
      <div className="flex items-center justify-between text-xs mt-2">
        <div className="flex items-center gap-1 text-gray-600">
          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
          <span>{stars}</span>
        </div>
        <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">
          {language}
        </span>
      </div>
    </div>
  );
};

// --- Search Box Component ---
const SearchBox = () => {
  const [query, setQuery] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Navigate to explorer with search query
    window.location.href = `/explore?q=${encodeURIComponent(query)}`;
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-xl mx-auto mt-6"
      role="search"
      aria-label="Search scrapers"
    >
      <div className="flex items-stretch gap-2 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-xl p-1 shadow-sm">
        <div className="flex items-center pl-3">
          <Search className="w-4 h-4 text-gray-400" />
        </div>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search domains, stacks, or use cases..."
          className="flex-1 px-3 py-3 rounded-lg outline-none bg-transparent placeholder-gray-500"
          aria-label="Search scrapers by keyword"
        />
        <button
          type="submit"
          className="px-5 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold hover:shadow-md transition-all"
        >
          Search
        </button>
      </div>
      {/* Search suggestions */}
      <div className="flex flex-wrap gap-2 mt-3 justify-center">
        <span className="text-xs text-gray-500">Try:</span>
        {["ecommerce", "news", "python", "jobs"].map((term) => (
          <button
            key={term}
            type="button"
            onClick={() => setQuery(term)}
            className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
          >
            {term}
          </button>
        ))}
      </div>
    </form>
  );
};

// --- Main Hero Section ---
export default function ScrapeYardHero() {
  return (
    <section className="relative min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/50 to-indigo-50/50 overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center space-y-8">
          {/* Badge */}
          <div className="flex justify-center">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 text-indigo-600 text-sm font-medium">
              <Sparkles className="w-4 h-4" />
              Open Source Web Scraping
            </div>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
            Explore{" "}
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              open-source
            </span>{" "}
            web crawlers by domain
          </h1>

          {/* Subtitle */}
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Curated scrapers with live GitHub code and smart recommendations for
            static, dynamic, and API-backed sites.
          </p>

          {/* Feature pills */}
          <div className="flex flex-wrap gap-3 justify-center">
            {[
              { icon: Code2, text: "150+ curated scrapers" },
              { icon: GitBranch, text: "Live code from GitHub" },
              { icon: Globe, text: "Domain-based recommendations" },
            ].map(({ icon: Icon, text }) => (
              <div
                key={text}
                className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-gray-200 shadow-sm text-sm text-gray-700"
              >
                <Icon className="w-4 h-4 text-gray-500" />
                {text}
              </div>
            ))}
          </div>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-xl font-semibold text-lg hover:shadow-lg transition group">
              Open Explorer
              <ChevronRight className="w-5 h-5 inline-block ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="bg-white border-2 border-gray-200 text-gray-700 px-8 py-3 rounded-xl font-semibold text-lg hover:shadow-md transition">
              <Code2 className="w-5 h-5 inline-block mr-2" />
              How it works
            </button>
          </div>

          {/* Search Box */}
          <SearchBox />

          {/* GitHub & Open Source signals */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm">
            <a
              href="https://github.com/Gaurav7974/ScrapeYard"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 bg-white hover:shadow-sm transition-all text-gray-700 hover:text-gray-900"
            >
              <Github className="w-4 h-4" />
              <span>View on GitHub</span>
              <div className="flex items-center gap-1 ml-2 text-xs text-gray-500">
                <Star className="w-3 h-3" />
                <span>Star</span>
              </div>
            </a>
            <span className="text-gray-500">MIT Licensed • Community contributions welcome</span>
          </div>

          {/* Trust note */}
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              Ethical guidance included
            </span>
            <span>•</span>
            <span>robots.txt, rate limits, API-first</span>
          </div>
        </div>

        {/* Bottom section - Code Preview */}
        <div className="mt-16 bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/40 shadow-lg">
          {/* Header */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg">
              <Code2 className="w-4 h-4 text-white" />
            </div>
            <h2 className="text-lg font-bold text-gray-800">Live Code Preview</h2>
          </div>

          {/* Code preview */}
          <CodePreview />

          {/* Cards */}
          <div className="grid gap-3 mt-6">
            <ScraperCard
              title="BeautifulSoup Parser"
              stars="2.1k"
              language="Python"
              description="Simple HTML parsing and extraction"
            />
            <ScraperCard
              title="Puppeteer Headless"
              stars="1.8k"
              language="Node.js"
              description="Dynamic content and JavaScript rendering"
            />
            <ScraperCard
              title="Scrapy Framework"
              stars="3.2k"
              language="Python"
              description="Production-ready web crawling framework"
            />
          </div>

          {/* Footer note */}
          <div className="text-center pt-4 mt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              ✨ Featured scrapers include Scrapy, Crawlee, Colly
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
