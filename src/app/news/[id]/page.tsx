"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { 
  ArrowLeft, 
  Calendar, 
  User, 
  Share2, 
  Clock, 
  Bookmark, 
  Newspaper,
  Heart,
  Facebook,
  Twitter,
  Linkedin
} from "lucide-react";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/context/LanguageContext";

export default function NewsDetailPage() {
  const { id } = useParams();
  const { lang } = useLanguage();
  
  const [article, setArticle] = useState<any>(null);
  const [recentArticles, setRecentArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticleAndRelated = async () => {
      try {
        setLoading(true);
        // Fetch all published articles to locate the specific one client-side
        const res = await api.get('/news?only_published=true');
        if (res.data?.articles) {
          const matched = res.data.articles.find((art: any) => String(art.id) === String(id));
          if (matched) {
            setArticle(matched);
            
            // Set 3 other recent articles as "More Stories"
            const filtered = res.data.articles.filter((art: any) => String(art.id) !== String(id));
            setRecentArticles(filtered.slice(0, 3));
          } else {
            setError("Article not found");
          }
        } else {
          setError("Failed to retrieve articles");
        }
      } catch (err) {
        console.error("Error fetching news details:", err);
        setError("Error loading article details. Please check your connection.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchArticleAndRelated();
    }
  }, [id]);

  // Fix local docker hostname for Next.js image optimization
  const getCleanImageUrl = (url: string) => {
    if (!url) return "https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&q=80&w=800";
    if (url.includes('minio:9000')) {
      return url.replace('minio:9000', 'localhost:9000');
    }
    return url;
  };

  const renderContent = (text: string) => {
    if (!text) return null;
    
    // Check if it contains HTML
    if (/<[a-z][\s\S]*>/i.test(text)) {
      return <div dangerouslySetInnerHTML={{ __html: text }} className="prose max-w-none text-black/70 dark:text-white/70" />;
    }

    // Split by newlines and render beautifully
    return text.split(/\n+/).map((para, idx) => (
      <p key={idx} className="text-black/70 text-base md:text-lg leading-relaxed mb-6 font-medium">
        {para}
      </p>
    ));
  };

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-between">
        <header className="bg-white border-b border-gray-100 h-20 flex items-center px-6">
          <div className="container mx-auto flex items-center justify-between">
            <div className="h-10 w-24 bg-gray-100 animate-pulse rounded-lg" />
            <div className="h-6 w-20 bg-gray-100 animate-pulse rounded-lg" />
          </div>
        </header>
        <div className="flex-grow container mx-auto px-6 py-20 max-w-4xl space-y-12">
          <div className="space-y-6">
            <div className="h-6 bg-gray-200 animate-pulse rounded w-24" />
            <div className="h-16 bg-gray-200 animate-pulse rounded w-3/4" />
            <div className="h-6 bg-gray-200 animate-pulse rounded w-1/2" />
          </div>
          <div className="h-[400px] bg-gray-200 animate-pulse rounded-3xl" />
          <div className="space-y-4">
            <div className="h-6 bg-gray-200 animate-pulse rounded w-full" />
            <div className="h-6 bg-gray-200 animate-pulse rounded w-full" />
            <div className="h-6 bg-gray-200 animate-pulse rounded w-2/3" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-between">
        <header className="bg-white border-b border-gray-100 h-20 flex items-center px-6">
          <div className="container mx-auto flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <span className="text-xl font-bold text-black">ERCS</span>
            </Link>
            <Link href="/news" className="text-sm font-bold text-black">Back to News</Link>
          </div>
        </header>
        <div className="flex-grow flex flex-col items-center justify-center py-20 px-6 text-center max-w-md mx-auto">
          <div className="h-16 w-16 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center mb-8">
            <Newspaper className="h-8 w-8" />
          </div>
          <h2 className="text-3xl font-black text-black tracking-tight mb-4">
            {error || "Article Not Found"}
          </h2>
          <p className="text-gray-500 font-medium mb-8">
            The news article you are looking for might have been unpublished, deleted, or you might have a temporary network issue.
          </p>
          <div className="flex gap-4">
            <Link href="/news">
              <Button className="bg-[#ED1C24] hover:bg-black text-white rounded-xl px-6 h-12 font-bold cursor-pointer transition-colors shadow-lg shadow-red-500/10">
                Back to News
              </Button>
            </Link>
            <Link href="/">
              <Button variant="outline" className="border-gray-200 rounded-xl px-6 h-12 font-bold cursor-pointer hover:bg-gray-50">
                Go Home
              </Button>
            </Link>
          </div>
        </div>
        <footer className="bg-slate-950 text-gray-500 py-10 text-center text-xs">
          © {new Date().getFullYear()} Ethiopian Red Cross Society
        </footer>
      </div>
    );
  }

  const categoryColor = 
    article.category === "EMERGENCY" ? "bg-red-500 text-white shadow-red-500/20" : 
    article.category === "HEALTH" ? "bg-blue-500 text-white shadow-blue-500/20" : 
    article.category === "YOUTH" ? "bg-green-500 text-white shadow-green-500/20" : 
    "bg-amber-500 text-white shadow-amber-500/20";

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50 transition-all">
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
              <span className="text-xl font-black text-black leading-none tracking-tight">ERCS</span>
              <span className="text-[10px] font-bold text-[#ED1C24] uppercase tracking-[0.2em]">{lang === 'en' ? 'Ethiopia' : 'ኢትዮጵያ'}</span>
            </div>
          </Link>
          <Link href="/news" className="text-xs font-black uppercase tracking-widest text-black hover:text-[#ED1C24] transition-all flex items-center gap-2 group">
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" /> 
            Back to News
          </Link>
        </div>
      </header>

      {/* Hero Banner Section */}
      <section className="bg-slate-950 text-white py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-15">
          <Image 
            src={getCleanImageUrl(article.thumbnail_url)} 
            alt={article.title}
            fill
            className="object-cover blur-[2px] scale-105"
            unoptimized
          />
        </div>
        
        {/* HSL decorative glow */}
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[500px] h-[500px] bg-red-500/10 rounded-full blur-[150px] pointer-events-none" />
        
        <div className="container mx-auto px-6 relative z-10 max-w-4xl space-y-6">
          <div className="flex flex-wrap items-center gap-3">
            <span className={cn("px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg", categoryColor)}>
              {article.category}
            </span>
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 border border-white/10 rounded-xl text-[10px] font-bold text-white/70">
              <Clock className="w-3.5 h-3.5" />
              <span>4 Min Read</span>
            </div>
          </div>
          
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tight leading-[1.0] text-white">
            {article.title}
          </h1>

          <div className="flex flex-wrap items-center gap-6 pt-4 text-xs font-bold text-white/60 border-t border-white/10">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-red-500" />
              <span>{new Date(article.published_at || article.created_at).toLocaleDateString(undefined, { dateStyle: 'long' })}</span>
            </div>
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-blue-400" />
              <span>{article.author || 'ERCS Communications'}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Article Content Layout */}
      <main className="container mx-auto px-6 py-20 flex-grow max-w-5xl">
        <div className="grid lg:grid-cols-12 gap-16 items-start">
          
          {/* Share and action buttons (Left column) */}
          <aside className="lg:col-span-3 flex lg:flex-col items-center lg:items-start justify-between lg:justify-start gap-6 border-b lg:border-b-0 lg:border-r border-gray-100 pb-8 lg:pb-0 lg:pr-8 sticky top-28">
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase tracking-widest text-black/40 mb-2 hidden lg:inline-block">Share Article</span>
              <div className="flex gap-2">
                <button onClick={handleShare} className="h-10 w-10 rounded-xl bg-white hover:bg-black text-black hover:text-white border border-gray-100 flex items-center justify-center transition-all shadow-sm hover:shadow-lg cursor-pointer">
                  <Share2 className="h-4 w-4" />
                </button>
                <button onClick={handleShare} className="h-10 w-10 rounded-xl bg-white hover:bg-[#1877F2] text-[#1877F2] hover:text-white border border-gray-100 flex items-center justify-center transition-all shadow-sm hover:shadow-lg cursor-pointer">
                  <Facebook className="h-4 w-4" />
                </button>
                <button onClick={handleShare} className="h-10 w-10 rounded-xl bg-white hover:bg-[#1DA1F2] text-[#1DA1F2] hover:text-white border border-gray-100 flex items-center justify-center transition-all shadow-sm hover:shadow-lg cursor-pointer">
                  <Twitter className="h-4 w-4" />
                </button>
              </div>
            </div>
            
            <div className="h-px bg-gray-100 w-full hidden lg:block my-4" />
            
            <div className="hidden lg:flex flex-col space-y-3">
              <span className="text-[10px] font-black uppercase tracking-widest text-black/40">Humanitarian Core</span>
              <p className="text-xs text-black/50 leading-relaxed font-medium">
                The Ethiopian Red Cross Society actively delivers healthcare, youth development, emergency support, and clean water services nation-wide.
              </p>
              <Link href="/donate" className="inline-flex">
                <Button className="bg-[#ED1C24] hover:bg-black text-white font-black text-[10px] uppercase tracking-widest px-4 py-2 rounded-lg cursor-pointer transition-colors">
                  Support Our Mission
                </Button>
              </Link>
            </div>
          </aside>

          {/* Main article content body (Right column) */}
          <article className="lg:col-span-9 space-y-12">
            
            {/* Visual Header Image Card */}
            <div className="relative aspect-[16/9] w-full rounded-[40px] overflow-hidden shadow-2xl border-8 border-white group">
              <Image 
                src={getCleanImageUrl(article.thumbnail_url)} 
                alt={article.title}
                fill
                className="object-cover transition-transform duration-[1.5s] group-hover:scale-105"
                unoptimized
              />
            </div>

            {/* Excerpt Section */}
            {article.excerpt && (
              <div className="p-8 md:p-10 bg-red-50/50 border border-red-50 rounded-[32px] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-full blur-2xl pointer-events-none" />
                <p className="text-[#ED1C24] text-lg md:text-xl font-bold tracking-tight leading-relaxed italic">
                  "{article.excerpt}"
                </p>
              </div>
            )}

            {/* Rich Content paragraphs */}
            <div className="space-y-6 text-black/80 font-medium">
              {renderContent(article.content)}
            </div>
            
            <div className="pt-12 border-t border-gray-100 flex items-center justify-between">
              <Link href="/news">
                <Button variant="ghost" className="hover:bg-gray-100 font-bold flex items-center gap-2 rounded-xl h-11 px-5 cursor-pointer">
                  <ArrowLeft className="h-4 w-4" /> Back to All Stories
                </Button>
              </Link>
              <div className="flex items-center gap-2">
                <Heart className="h-4 w-4 text-red-500 fill-red-500" />
                <span className="text-xs font-bold text-black/50">ERCS Communications</span>
              </div>
            </div>
          </article>
        </div>
      </main>

      {/* Related/Recent News Section */}
      {recentArticles.length > 0 && (
        <section className="bg-white border-t border-gray-100 py-24">
          <div className="container mx-auto px-6 max-w-5xl space-y-12">
            <div className="flex justify-between items-end">
              <div className="space-y-2">
                <span className="text-xs font-black tracking-widest text-[#ED1C24] uppercase">RECOMMENDED</span>
                <h3 className="text-3xl font-black text-black tracking-tight">More Stories & Updates</h3>
              </div>
              <Link href="/news" className="text-xs font-black uppercase tracking-widest text-black hover:text-[#ED1C24] transition-colors">
                View All
              </Link>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {recentArticles.map((post) => (
                <Link href={`/news/${post.id}`} key={post.id} className="group flex flex-col space-y-4">
                  <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 shadow-sm">
                    <Image 
                      src={getCleanImageUrl(post.thumbnail_url)} 
                      alt={post.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      unoptimized
                    />
                  </div>
                  <div className="space-y-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#ED1C24]">{post.category}</span>
                    <h4 className="font-black text-black group-hover:text-[#ED1C24] transition-colors line-clamp-2 leading-tight">
                      {post.title}
                    </h4>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Shared Simple Footer for Sub-pages */}
      <footer className="bg-slate-950 text-white py-12 border-t border-slate-900 mt-auto">
        <div className="container mx-auto px-6 max-w-5xl flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <span className="text-xl font-black">ERCS</span>
            <div className="h-4 w-px bg-white/20" />
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Heritage Project</span>
          </div>
          <div className="text-gray-500 text-sm">
            © {new Date().getFullYear()} Ethiopian Red Cross Society. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
