"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { ArrowRight, Calendar, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Language, translations } from "@/lib/translations";

interface NewsSectionProps {
  lang: Language;
  content?: typeof translations.en.news;
}

export default function NewsSection({ lang, content }: NewsSectionProps) {
  const t = translations[lang];
  const local = content || t.news;

  const [liveArticles, setLiveArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';
        const res = await fetch(`${apiUrl}/news?page=1&page_size=3&only_published=true`);
        const data = await res.json();
        if (data && data.articles) {
          setLiveArticles(data.articles);
        }
      } catch (err) {
        console.error("Failed to fetch live news:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  const displayArticles = liveArticles.map((a, idx) => {
    const colors = ["bg-red-500", "bg-blue-500", "bg-green-500"];
    
    // Fix local docker hostname for Next.js image optimization
    let imageUrl = a.thumbnail_url;
    if (imageUrl && imageUrl.includes('minio:9000')) {
        imageUrl = imageUrl.replace('minio:9000', 'localhost:9000');
    }

    return {
      id: a.id,
      category: a.category,
      date: a.published_at ? new Date(a.published_at).toLocaleDateString() : 'Recent',
      author: a.author || 'ERCS Communications',
      title: a.title,
      desc: a.excerpt,
      image: imageUrl || "https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&q=80&w=800",
      color: colors[idx % colors.length]
    };
  });

  return (
    <section id="news" className="py-32 bg-gray-50/50 relative overflow-hidden">
      {/* Decorative background shape */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-red-50 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-red-50 rounded-full blur-3xl opacity-30 translate-y-1/2 -translate-x-1/2" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
          <div className="max-w-xl">
            <h2 className="text-sm font-black text-[#ED1C24] uppercase tracking-[0.3em] mb-4">
              {local.badge}
            </h2>
            <h3 className={`${lang === 'en' ? 'text-5xl md:text-6xl' : 'text-4xl md:text-5xl'} font-black text-black leading-[0.9] tracking-tighter`}>
              {local.title}
            </h3>
          </div>
          <Link href="/news" className="group flex items-center gap-3 text-sm font-black text-black uppercase tracking-widest hover:text-[#ED1C24] transition-colors">
            {local.viewAll}
            <div className="w-10 h-10 rounded-full border border-black/10 flex items-center justify-center group-hover:border-[#ED1C24] transition-colors">
              <ArrowRight className="w-5 h-5" />
            </div>
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {displayArticles.length === 0 && !loading ? (
             <div className="col-span-1 md:col-span-3 text-center py-12 bg-white rounded-3xl border border-black/[0.05]">
                <h3 className="text-2xl font-black text-black tracking-tighter mb-2">No Stories Available</h3>
                <p className="text-sm font-bold text-black/50">There are currently no published news articles. Check back soon for updates!</p>
             </div>
          ) : (
            displayArticles.map((post, idx) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="group bg-white rounded-3xl overflow-hidden border border-black/[0.03] hover:shadow-2xl hover:shadow-black/10 transition-all duration-500"
              >
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute top-6 left-6">
                    <span className={`${post.color} text-white text-[10px] font-black uppercase tracking-wider px-4 py-2 rounded-full`}>
                      {post.category}
                    </span>
                  </div>
                </div>

                <div className="p-8">
                  <div className="flex items-center gap-6 mb-6 text-[10px] font-black uppercase tracking-widest text-black/40">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3 h-3" />
                      {post.date}
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="w-3 h-3" />
                      {post.author}
                    </div>
                  </div>

                  <h4 className="text-xl font-black text-black mb-4 line-clamp-2 min-h-[3.5rem] leading-tight group-hover:text-[#ED1C24] transition-colors">
                    {post.title}
                  </h4>
                  
                  <p className="text-black/60 font-medium text-sm mb-8 line-clamp-3 leading-relaxed">
                    {post.desc}
                  </p>

                  <div className="pt-8 border-t border-black/[0.05]">
                    <Link href={`/news/${post.id}`} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-black group-hover:gap-4 transition-all">
                      {local.readStory}
                      <ArrowRight className="w-4 h-4 text-[#ED1C24]" />
                    </Link>
                  </div>
                </div>
              </motion.article>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
