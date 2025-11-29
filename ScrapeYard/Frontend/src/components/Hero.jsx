import React, { useState } from "react";
import {
  ChevronRight,
  Star,
  Code2,
  ExternalLink,
  Sparkles,
  Github,
  Zap,
  TrendingUp,
  Search,
  Filter,
  Play,
  Edit,
  Trash2,
  Globe,
  BookOpen,
  Users,
  LogIn,
} from "lucide-react";

export default function ScrapeYardDashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTab, setSelectedTab] = useState("personal");

  return (
    <div className="min-h-screen bg-[#0A0A0E]">
      {/* Header Navigation - Sticky */}
      <nav className="sticky top-0 z-50 bg-[rgba(10,10,14,0.8)] backdrop-blur-lg border-b border-white/5">
        <div className="max-w-[1400px] mx-auto px-8 py-4 flex items-center justify-between">
          {/* Left - Logo & Nav */}
          <div className="flex items-center gap-12">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[#00FF7F] to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                <Code2 className="w-6 h-6 text-white" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-white font-bold text-xl">Scrapeyard</span>
                <span className="px-2 py-0.5 bg-[#00FF7F]/20 text-[#00FF7F] text-xs font-semibold rounded-full flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  AI-Powered
                </span>
              </div>
            </div>
            <div className="flex items-center gap-8 text-sm">
              <a href="#" className="text-white hover:text-[#00FF7F] transition-colors font-medium">Explore</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Templates</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Docs</a>
            </div>
          </div>
          
          {/* Right - Links & CTA */}
          <div className="flex items-center gap-6">
            <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">FAQ</a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Community</a>
            <button className="bg-[#00FF7F] hover:bg-[#00FF7F]/90 text-gray-900 px-6 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 shadow-lg shadow-[#00FF7F]/20">
              <Github className="w-4 h-4" />
              Sign In
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-[1400px] mx-auto px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="relative inline-block mb-8">
            <div className="absolute inset-0 bg-gradient-to-r from-[#00FF7F]/20 to-[#8A2BE2]/20 blur-3xl"></div>
            <h1 className="relative text-6xl font-bold text-white mb-6 leading-tight">
              Unlock the <Zap className="inline-block w-14 h-14 text-[#00FF7F] -mt-2" /> Future of
              <br />
              Web Scraping with <span className="bg-gradient-to-r from-[#00FF7F] to-emerald-400 bg-clip-text text-transparent">Scrapeyard</span>
            </h1>
          </div>
          
          <p className="text-gray-400 text-xl max-w-3xl mx-auto mb-10 leading-relaxed">
            Discover, customize, and deploy scrapers for any site — powered by AI and community wisdom.
            <br />
            Run live code, track performance, and scale your data pipelines — all in one place.
          </p>

          {/* CTA Buttons */}
          <div className="flex items-center justify-center gap-4 mb-12">
            <button className="bg-[#00FF7F] hover:bg-[#00FF7F]/90 text-gray-900 px-8 py-4 rounded-xl font-bold text-lg transition-all flex items-center gap-2 shadow-lg shadow-[#00FF7F]/30">
              🚀 Start Exploring
              <ChevronRight className="w-5 h-5" />
            </button>
            <button className="bg-transparent border-2 border-[#8A2BE2] hover:bg-[#8A2BE2]/10 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all flex items-center gap-2">
              💡 How It Works
            </button>
          </div>

          {/* Trending Domains */}
          <div className="flex items-center justify-center gap-3 text-sm">
            <span className="text-gray-500">Trending:</span>
            {["Amazon", "Twitter", "LinkedIn", "eBay"].map((domain) => (
              <span key={domain} className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-gray-300 cursor-pointer transition-all">
                {domain}
              </span>
            ))}
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-[rgba(30,30,45,0.6)] backdrop-blur-xl border border-white/10 rounded-2xl p-6 mb-12 shadow-xl">
          <div className="flex items-center gap-4 mb-4">
            <div className="flex-1 flex items-center gap-3 bg-[#0A0A0E]/50 border border-white/10 rounded-xl px-4 py-3">
              <Search className="w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="🔍 Search domains, stacks, or use cases..."
                className="flex-1 bg-transparent text-white placeholder-gray-500 outline-none"
              />
            </div>
            <button className="bg-[#00FF7F] hover:bg-[#00FF7F]/90 text-gray-900 px-6 py-3 rounded-xl font-bold transition-all">
              Search
            </button>
            <button className="bg-[#8A2BE2]/20 hover:bg-[#8A2BE2]/30 text-white px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-2 border border-[#8A2BE2]/30">
              <Filter className="w-4 h-4" />
              Advanced Filters
            </button>
          </div>
          
          {/* Quick Filters */}
          <div className="flex items-center gap-3 text-sm">
            <span className="text-gray-500">Try:</span>
            {["ecommerce", "news", "social media", "jobs", "real estate"].map((term) => (
              <button key={term} className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-gray-300 transition-all">
                {term}
              </button>
            ))}
          </div>
        </div>

        {/* Dashboard Widgets Grid */}
        <div className="grid grid-cols-12 gap-6 mb-12">
          {/* My Scrapers Widget - Large */}
          <div className="col-span-8 bg-[rgba(30,30,45,0.6)] backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">My Scrapers</h2>
              <button className="text-[#00FF7F] text-sm font-semibold hover:text-[#00FF7F]/80 transition-colors">
                View All →
              </button>
            </div>

            <div className="space-y-4">
              {[
                { name: "Amazon Product Scraper", lang: "Python", stars: "2.3k", status: "live", desc: "Extract product data with pricing and reviews" },
                { name: "Twitter Profile Extractor", lang: "Node.js", stars: "1.8k", status: "queued", desc: "AI-optimized social media scraping" },
                { name: "LinkedIn Jobs Parser", lang: "Python", stars: "3.1k", status: "error", desc: "MIT Licensed job listing aggregator" },
              ].map((scraper, idx) => (
                <div key={idx} className="bg-[#0A0A0E]/50 border border-white/10 rounded-xl p-5 hover:border-[#00FF7F]/30 transition-all group">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-white font-semibold text-lg">{scraper.name}</h3>
                        <span className={`w-2 h-2 rounded-full ${scraper.status === 'live' ? 'bg-[#00FF7F]' : scraper.status === 'queued' ? 'bg-yellow-400' : 'bg-red-400'} animate-pulse`}></span>
                        <span className={`text-xs font-semibold ${scraper.status === 'live' ? 'text-[#00FF7F]' : scraper.status === 'queued' ? 'text-yellow-400' : 'text-red-400'}`}>
                          {scraper.status.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-gray-400 text-sm mb-2">{scraper.desc}</p>
                      <div className="flex items-center gap-3">
                        <span className="px-3 py-1 bg-[#8A2BE2]/20 border border-[#8A2BE2]/30 text-[#8A2BE2] rounded-full text-xs font-semibold">
                          {scraper.lang}
                        </span>
                        <div className="flex items-center gap-1 text-gray-400">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm">{scraper.stars}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="p-2 bg-[#00FF7F]/20 hover:bg-[#00FF7F]/30 text-[#00FF7F] rounded-lg transition-all">
                        <Play className="w-4 h-4" />
                      </button>
                      <button className="p-2 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white rounded-lg transition-all">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-2 bg-white/5 hover:bg-red-500/20 text-gray-400 hover:text-red-400 rounded-lg transition-all">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Usage Stats Widget */}
          <div className="col-span-4 bg-[rgba(30,30,45,0.6)] backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-xl">
            <h2 className="text-xl font-bold text-white mb-6">Usage Stats</h2>
            
            <div className="mb-8">
              <div className="flex items-center justify-between mb-3">
                <span className="text-gray-400 text-sm">Monthly Scraping Limit</span>
                <span className="text-white font-bold">24.9%</span>
              </div>
              <div className="w-full h-2 bg-[#0A0A0E] rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-[#00FF7F] to-emerald-400" style={{ width: '24.9%' }}></div>
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className="text-2xl font-bold text-white">12,450</span>
                <span className="text-gray-500 text-sm">/ 50,000 requests</span>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex items-center justify-between p-3 bg-[#0A0A0E]/50 rounded-lg">
                <span className="text-gray-400 text-sm">Success Rate</span>
                <span className="text-[#00FF7F] font-bold">98.5%</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-[#0A0A0E]/50 rounded-lg">
                <span className="text-gray-400 text-sm">Active Scrapers</span>
                <span className="text-white font-bold">23</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-[#0A0A0E]/50 rounded-lg">
                <span className="text-gray-400 text-sm">Data Extracted</span>
                <span className="text-white font-bold">1.2M rows</span>
              </div>
            </div>

            <button className="w-full bg-gradient-to-r from-[#8A2BE2] to-[#9370DB] hover:from-[#9370DB] hover:to-[#8A2BE2] text-white py-3 rounded-xl font-bold transition-all">
              Upgrade Plan
            </button>
          </div>
        </div>

        {/* Live Code Explorer */}
        <div className="bg-[rgba(30,30,45,0.6)] backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-xl mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Live Code Preview</h2>
            <button className="bg-[#00FF7F] hover:bg-[#00FF7F]/90 text-gray-900 px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-2">
              <Play className="w-4 h-4" />
              Run in Sandbox
            </button>
          </div>

          {/* Code Editor */}
          <div className="bg-[#0A0A0E] border border-white/10 rounded-xl overflow-hidden">
            <div className="flex items-center gap-3 px-4 py-3 bg-[#0A0A0E]/80 border-b border-white/10">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <span className="text-gray-400 text-sm font-mono">scraper.py</span>
            </div>
            <div className="p-6 font-mono text-sm text-gray-300 leading-relaxed">
              <div className="flex"><span className="text-gray-600 w-12">1</span><span className="text-purple-400">import</span> <span className="text-white">scrapy</span></div>
              <div className="flex"><span className="text-gray-600 w-12">2</span><span className="text-purple-400">class</span> <span className="text-yellow-300">ProductSpider</span>(<span className="text-blue-400">scrapy.Spider</span>):</div>
              <div className="flex"><span className="text-gray-600 w-12">3</span><span className="ml-8 text-white">name = </span><span className="text-green-400">'products'</span></div>
              <div className="flex"><span className="text-gray-600 w-12">4</span><span className="ml-8 text-white">start_urls = [</span><span className="text-green-400">'https://example.com/products'</span>]</div>
              <div className="flex"><span className="text-gray-600 w-12">5</span></div>
              <div className="flex"><span className="text-gray-600 w-12">6</span><span className="ml-8 text-purple-400">def</span> <span className="text-yellow-300">parse</span>(<span className="text-white">self, response</span>):</div>
              <div className="flex"><span className="text-gray-600 w-12">7</span><span className="ml-16 text-purple-400">for</span> <span className="text-white">product </span><span className="text-purple-400">in</span> <span className="text-white">response.css(</span><span className="text-green-400">'.product'</span>):</div>
              <div className="flex"><span className="text-gray-600 w-12">8</span><span className="ml-24 text-purple-400">yield</span> {'{'}<span className="text-green-400">'name'</span>: product.css(<span className="text-green-400">'.title::text'</span>).get(){'}'}</div>
            </div>
          </div>

          {/* Output Panel */}
          <div className="mt-4 bg-[#0A0A0E] border border-white/10 rounded-xl p-6">
            <div className="text-gray-400 text-sm font-mono">
              <div className="text-[#00FF7F]">✓ Scraper initialized successfully</div>
              <div className="text-gray-500">→ Fetching https://example.com/products</div>
              <div className="text-gray-500">→ Parsing 127 items...</div>
              <div className="text-[#00FF7F]">✓ Extraction complete: 127 products scraped</div>
            </div>
          </div>
        </div>

        {/* Domain Intelligence */}
        <div className="bg-[rgba(30,30,45,0.6)] backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-xl mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Recommended for You</h2>
            <div className="flex items-center gap-2">
              {["Python", "Node.js", "Go"].map((lang) => (
                <button key={lang} className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-gray-300 text-sm transition-all">
                  {lang}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6">
            {[
              { name: "Amazon Product Scraper", rate: "89%", tag: "E-commerce", color: "from-orange-500 to-red-500" },
              { name: "Twitter Profile Extractor", tag: "AI-optimized", rate: "94%", color: "from-blue-500 to-cyan-500" },
              { name: "LinkedIn Jobs API Parser", tag: "MIT Licensed", rate: "91%", color: "from-blue-600 to-indigo-600" },
            ].map((item, idx) => (
              <div key={idx} className="bg-[#0A0A0E]/50 border border-white/10 rounded-xl p-6 hover:border-[#00FF7F]/30 transition-all group cursor-pointer">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-4`}>
                  <Globe className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-white font-bold text-lg mb-2">{item.name}</h3>
                <div className="flex items-center gap-2 mb-4">
                  <span className="px-3 py-1 bg-[#00FF7F]/20 border border-[#00FF7F]/30 text-[#00FF7F] rounded-full text-xs font-semibold">
                    {item.tag}
                  </span>
                  <span className="text-gray-400 text-sm">{item.rate} success rate</span>
                </div>
                <button className="w-full bg-white/5 hover:bg-white/10 text-white py-2 rounded-lg transition-all group-hover:bg-[#00FF7F]/20 group-hover:text-[#00FF7F]">
                  View Details
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Status Bar */}
        <div className="flex items-center justify-between bg-[rgba(30,30,45,0.6)] backdrop-blur-xl border border-white/10 rounded-2xl p-6">
          <div className="flex items-center gap-4">
            <div className="flex -space-x-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 border-2 border-[#0A0A0E]"></div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 border-2 border-[#0A0A0E]"></div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-teal-500 border-2 border-[#0A0A0E]"></div>
            </div>
            <div>
              <div className="text-white font-semibold text-sm">⭐ 15k+ new scrapers added monthly</div>
              <div className="text-gray-400 text-xs">Join our growing community</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setSelectedTab("personal")}
              className={`px-6 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                selectedTab === "personal"
                  ? "bg-[#00FF7F] text-gray-900"
                  : "bg-white/5 text-gray-400 hover:bg-white/10"
              }`}
            >
              Personal
            </button>
            <button
              onClick={() => setSelectedTab("team")}
              className={`px-6 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                selectedTab === "team"
                  ? "bg-[#00FF7F] text-gray-900"
                  : "bg-white/5 text-gray-400 hover:bg-white/10"
              }`}
            >
              Team
            </button>
            <button
              onClick={() => setSelectedTab("enterprise")}
              className={`px-6 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                selectedTab === "enterprise"
                  ? "bg-[#00FF7F] text-gray-900"
                  : "bg-white/5 text-gray-400 hover:bg-white/10"
              }`}
            >
              Enterprise
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}