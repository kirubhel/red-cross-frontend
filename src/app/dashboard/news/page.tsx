"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Newspaper, 
  ArrowLeft, 
  Share2, 
  Clock, 
  Bookmark, 
  TrendingUp,
  Search,
  ChevronRight,
  Loader2,
  ExternalLink
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function NewsPage() {
  const [loading, setLoading] = useState(true);

  // Mock news data
  const articles = [
    {
      id: 1,
      title: "ERCS Responds to Flash Floods in Afar Region",
      excerpt: "The Ethiopia Red Cross Society has deployed three emergency teams to the Afar region following devastating flash floods that displaced over 5,000 families.",
      date: "2 hours ago",
      author: "Communication Dept",
      category: "Emergency Response",
      image: "https://images.unsplash.com/photo-1547683908-21aa538c716b?auto=format&fit=crop&q=80&w=1000",
      featured: true,
      readTime: "5 min read"
    },
    {
      id: 2,
      title: "New Digital Membership Portal Goes Live",
      excerpt: "Members can now access their digital ID cards, track their impact history, and renew memberships entirely online.",
      date: "Yesterday",
      author: "IT Support",
      category: "Announcement",
      image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=800",
      featured: false,
      readTime: "3 min read"
    },
    {
      id: 3,
      title: "International Red Cross President Visits Addis Ababa HQ",
      excerpt: "Discussions focused on scaling up humanitarian aid and strengthening community resilience in drought-affected areas.",
      date: "2 days ago",
      author: "Admin Office",
      category: "Diplomatic",
      image: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80&w=800",
      featured: false,
      readTime: "8 min read"
    },
    {
      id: 4,
      title: "Youth Volunteer Program: Summer Intake Now Open",
      excerpt: "Are you ready to make a difference? Applications are now open for the 2024 Summer Youth Volunteer Corps.",
      date: "3 days ago",
      author: "Youth Wing",
      category: "Recruitment",
      image: "https://images.unsplash.com/photo-1559027615-cd93739bee94?auto=format&fit=crop&q=80&w=800",
      featured: false,
      readTime: "4 min read"
    }
  ];

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 text-[#ED1C24] animate-spin" />
      </div>
    );
  }

  const featured = articles.find(a => a.featured);
  const regular = articles.filter(a => !a.featured);

  return (
    <div className="p-6 md:p-10 space-y-12 pb-20 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-gray-100 pb-10">
        <div className="space-y-2">
          <Link 
            href="/dashboard" 
            className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-[#ED1C24] transition-colors flex items-center gap-2 group"
          >
            <ArrowLeft className="h-3 w-3 group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
          </Link>
          <h1 className="text-5xl font-black tracking-tighter text-black">ERCS Newsroom</h1>
          <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">
            Official updates, impact stories, and humanitarian bulletins
          </p>
        </div>
        
        <div className="relative w-full md:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300" />
          <input 
            type="text" 
            placeholder="Search news..."
            className="w-full bg-white border border-gray-100 rounded-2xl h-14 pl-12 pr-6 font-bold text-gray-900 focus:ring-2 focus:ring-[#ED1C24]/10 transition-all shadow-sm"
          />
        </div>
      </div>

      {/* Featured Article */}
      {featured && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative group cursor-pointer"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 bg-white rounded-[48px] overflow-hidden border border-gray-100 shadow-2xl shadow-gray-200/50">
             <div className="h-[400px] lg:h-auto overflow-hidden">
                <img 
                  src={featured.image} 
                  alt={featured.title} 
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                />
             </div>
             <div className="p-10 md:p-16 flex flex-col justify-center space-y-8">
                <div className="flex items-center gap-4">
                   <div className="bg-[#ED1C24]/10 text-[#ED1C24] px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">
                      {featured.category}
                   </div>
                   <div className="flex items-center gap-2 text-gray-400 text-xs font-bold">
                      <Clock className="h-4 w-4" /> {featured.readTime}
                   </div>
                </div>
                
                <h2 className="text-4xl md:text-5xl font-black tracking-tighter leading-tight text-gray-900 group-hover:text-[#ED1C24] transition-colors">
                   {featured.title}
                </h2>
                <p className="text-lg text-gray-500 font-medium leading-relaxed">
                   {featured.excerpt}
                </p>
                
                <div className="flex items-center justify-between pt-4">
                   <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-2xl bg-gray-100 border border-gray-100 overflow-hidden">
                         <img src="https://i.pravatar.cc/100?u=admin" alt="author" className="h-full w-full object-cover" />
                      </div>
                      <div>
                         <p className="text-sm font-black text-gray-900">{featured.author}</p>
                         <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">{featured.date}</p>
                      </div>
                   </div>
                   <div className="flex items-center gap-3">
                      <button className="h-12 w-12 rounded-2xl border border-gray-100 flex items-center justify-center text-gray-400 hover:text-[#ED1C24] hover:bg-red-50 transition-all">
                         <Bookmark className="h-5 w-5" />
                      </button>
                      <button className="h-12 w-12 rounded-2xl border border-gray-100 flex items-center justify-center text-gray-400 hover:text-[#ED1C24] hover:bg-red-50 transition-all">
                         <Share2 className="h-5 w-5" />
                      </button>
                   </div>
                </div>
             </div>
          </div>
        </motion.div>
      )}

      {/* Categories & Trending */}
      <div className="grid lg:grid-cols-[1fr_360px] gap-12">
         {/* News Feed */}
         <div className="space-y-12">
            <h3 className="text-2xl font-black tracking-tighter flex items-center gap-3">
               Latest Updates <div className="h-1.5 w-1.5 bg-[#ED1C24] rounded-full animate-pulse" />
            </h3>
            
            <div className="grid gap-8">
               {regular.map((article, idx) => (
                 <motion.div 
                   key={article.id}
                   initial={{ opacity: 0, x: -20 }}
                   animate={{ opacity: 1, x: 0 }}
                   transition={{ delay: idx * 0.1 }}
                   className="group flex flex-col md:flex-row gap-8 items-center bg-white p-6 rounded-[40px] border border-transparent hover:border-gray-100 hover:shadow-xl transition-all cursor-pointer"
                 >
                    <div className="w-full md:w-64 h-48 rounded-[32px] overflow-hidden shrink-0">
                       <img 
                         src={article.image} 
                         alt={article.title} 
                         className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                       />
                    </div>
                    <div className="space-y-4 flex-1">
                       <div className="flex items-center gap-4">
                          <span className="text-[10px] font-black text-[#ED1C24] uppercase tracking-widest">{article.category}</span>
                          <span className="text-xs text-gray-300">•</span>
                          <span className="text-xs text-gray-400 font-bold">{article.date}</span>
                       </div>
                       <h3 className="text-2xl font-black tracking-tight text-gray-900 group-hover:text-[#ED1C24] transition-colors leading-tight">
                          {article.title}
                       </h3>
                       <p className="text-sm text-gray-500 font-medium line-clamp-2">
                          {article.excerpt}
                       </p>
                       <div className="pt-2 flex items-center gap-4 text-xs font-black uppercase tracking-widest text-gray-400">
                          <span className="flex items-center gap-1.5 group-hover:text-black transition-colors">
                             Read More <ChevronRight className="h-3 w-3" />
                          </span>
                       </div>
                    </div>
                 </motion.div>
               ))}
            </div>

            <Button variant="outline" className="w-full h-16 rounded-[24px] border-2 border-gray-100 font-black text-xs uppercase tracking-widest text-gray-400 hover:text-black hover:border-gray-200 transition-all">
               Load More Stories
            </Button>
         </div>

         {/* Sidebar: Trending & Newsletter */}
         <div className="space-y-10">
            {/* Trending */}
            <div className="bg-white rounded-[40px] p-8 border border-gray-100 shadow-sm space-y-8">
               <h3 className="text-xl font-black tracking-tighter flex items-center gap-3">
                  Trending Now <TrendingUp className="h-5 w-5 text-[#ED1C24]" />
               </h3>
               <div className="space-y-6">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="group cursor-pointer space-y-2">
                       <p className="text-[10px] font-black text-[#ED1C24] uppercase tracking-widest">#{i} Most Read</p>
                       <p className="font-black text-gray-900 leading-tight group-hover:text-[#ED1C24] transition-colors">
                          {i === 1 && "Ethiopian Red Cross marks 89th Anniversary with country-wide events."}
                          {i === 2 && "Call for Volunteers: Medical support teams for national exam centers."}
                          {i === 3 && "How your 10 ETB monthly donation changed lives in Wollo."}
                       </p>
                    </div>
                  ))}
               </div>
            </div>

            {/* Newsletter */}
            <div className="bg-black rounded-[40px] p-8 text-white space-y-6 shadow-2xl shadow-black/10">
               <div className="h-14 w-14 bg-white/10 rounded-2xl flex items-center justify-center border border-white/10">
                  <ExternalLink className="h-7 w-7" />
               </div>
               <div className="space-y-2">
                  <h3 className="text-2xl font-black tracking-tighter">Humanitarian Digest</h3>
                  <p className="text-sm font-medium opacity-60">Subscribe to our weekly newsletter and never miss a critical update from the frontlines.</p>
               </div>
               <div className="space-y-4">
                  <input 
                    type="email" 
                    placeholder="your@email.com" 
                    className="w-full bg-white/5 border border-white/10 rounded-2xl h-14 px-6 text-white font-bold focus:ring-2 focus:ring-white/10 transition-all outline-none"
                  />
                  <Button className="w-full h-14 bg-[#ED1C24] text-white hover:bg-red-700 rounded-2xl font-black text-xs uppercase tracking-widest transition-all">
                     Join the Bulletin
                  </Button>
               </div>
            </div>

            {/* Archive */}
            <div className="px-8 flex flex-wrap gap-2">
               {["Report 2023", "Policy", "Safety", "COVID-19", "Archive", "Media Kit"].map((tag) => (
                 <span key={tag} className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-[#ED1C24] cursor-pointer transition-colors">
                    #{tag}
                 </span>
               ))}
            </div>
         </div>
      </div>
    </div>
  );
}
