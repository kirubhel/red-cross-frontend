"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, 
  Calendar, 
  User, 
  Search, 
  Filter,
  Newspaper
} from "lucide-react";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";
import { cn } from "@/lib/utils";

const CATEGORIES = ["All", "EMERGENCY", "HEALTH", "YOUTH", "DEVELOPMENT"];

export default function NewsPage() {
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchNews();
  }, [selectedCategory]);

  const fetchNews = async () => {
    setLoading(true);
    try {
      const categoryParam = selectedCategory === "All" ? "" : selectedCategory;
      const res = await api.get(`/news?only_published=true&category=${categoryParam}`);
      if (res.data?.articles) {
        setNews(res.data.articles);
      }
    } catch (error) {
      console.error("Failed to fetch news:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredNews = news.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          article.excerpt?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative overflow-hidden rounded-lg">
              <Image 
                src="/logo.png" 
                alt="ERCS Logo" 
                width={40} 
                height={40} 
                className="object-contain transition-transform duration-500 group-hover:scale-110" 
                unoptimized
              />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-black leading-none tracking-tight">ERCS</span>
              <span className="text-[10px] font-bold text-[#ED1C24] uppercase tracking-[0.2em]">Ethiopia</span>
            </div>
          </Link>
          <Link href="/" className="text-sm font-bold text-black hover:text-[#ED1C24] transition-colors flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" /> Back to Home
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-slate-900 text-white py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <Image 
            src="https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&q=80&w=1200" 
            alt="News Banner"
            fill
            className="object-cover"
            unoptimized
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-slate-900" />
        
        <div className="container mx-auto px-6 relative z-10 text-center max-w-2xl">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
              News & Media Centre
            </h1>
            <p className="text-white/60 text-lg font-medium">
              Stay updated with the latest press releases, stories, and humanitarian impact from across the nation.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12 flex-grow">
        {/* Filters & Search */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
          {/* Categories */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 no-scrollbar">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap
                  ${selectedCategory === cat 
                    ? 'bg-[#ED1C24] text-white shadow-lg shadow-[#ED1C24]/20' 
                    : 'bg-gray-50 text-black/60 hover:bg-gray-100 hover:text-black'}`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-black/40" />
            <input 
              type="text" 
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ED1C24] focus:bg-white transition-all text-sm"
            />
          </div>
        </div>

        {/* News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence>
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm animate-pulse">
                  <div className="aspect-[4/3] bg-gray-100" />
                  <div className="p-8 space-y-4">
                    <div className="h-4 bg-gray-100 rounded w-1/2" />
                    <div className="h-6 bg-gray-100 rounded w-full" />
                    <div className="h-20 bg-gray-100 rounded w-full" />
                  </div>
                </div>
              ))
            ) : filteredNews.map((article, i) => (
              <motion.div
                key={article.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-500 group"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100">
                  {article.thumbnail_url ? (
                    <img 
                      src={article.thumbnail_url} 
                      alt={article.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                      <Newspaper className="h-12 w-12" />
                    </div>
                  )}
                  <div className="absolute top-4 left-4">
                    <span className={cn(
                      "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider text-white",
                      article.category === "EMERGENCY" ? "bg-red-500" : 
                      article.category === "HEALTH" ? "bg-blue-500" : 
                      article.category === "YOUTH" ? "bg-green-500" : "bg-amber-500"
                    )}>
                      {article.category}
                    </span>
                  </div>
                </div>
                <div className="p-8 space-y-4">
                  <div className="flex items-center gap-4 text-black/40 text-xs font-bold">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>{new Date(article.published_at || article.created_at).toLocaleDateString()}</span>
                    </div>
                    <div className="w-1 h-1 rounded-full bg-black/20" />
                    <div className="flex items-center gap-1">
                      <User className="h-3.5 w-3.5" />
                      <span>{article.author}</span>
                    </div>
                  </div>
                  
                  <h4 className="text-xl font-black text-black leading-snug group-hover:text-[#ED1C24] transition-colors line-clamp-2">
                    {article.title}
                  </h4>
                  
                  <p className="text-black/60 font-medium text-sm leading-relaxed line-clamp-3">
                    {article.excerpt}
                  </p>

                  <div className="pt-4">
                    <Button variant="ghost" className="p-0 hover:bg-transparent text-[#ED1C24] font-bold flex items-center gap-2 group/btn cursor-pointer">
                      Read Story <ArrowLeft className="h-4 w-4 rotate-180 transition-transform group-hover/btn:translate-x-1" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filteredNews.length === 0 && (
          <div className="text-center py-20">
            <p className="text-black/40 font-bold">No articles found matching your criteria.</p>
          </div>
        )}
      </main>

      {/* Shared Simple Footer for Sub-pages */}
      <footer className="bg-slate-950 text-white py-12 border-t border-slate-900">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <span className="text-xl font-black">ERCS</span>
          </div>
          <div className="text-gray-500 text-sm">
            © {new Date().getFullYear()} Ethiopian Red Cross Society. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
