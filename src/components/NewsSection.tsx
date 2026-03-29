"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Calendar, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Language, translations } from "@/lib/translations";

interface NewsSectionProps {
  lang: Language;
}

export default function NewsSection({ lang }: NewsSectionProps) {
  const t = translations[lang];
  const local = t.news;

  // Static articles for demo, labels are now from CMS
  const articles = lang === 'am' ? [
    {
      id: 1,
      category: "ድንገተኛ",
      date: "መጋቢት 11, 2018",
      author: "ኮሙኒኬሽን",
      title: "በጎርፍ ለተጎዱ አካባቢዎች ወሳኝ እርዳታ ተሰራጨ",
      desc: "የምላሽ ቡድኖቻችን በደቡብ ኢትዮጵያ በቅርብ ጊዜ በተከሰተው የጎርፍ አደጋ ለተጎዱ ከ5,000 በላይ አባወራዎች አስፈላጊ አቅርቦቶችን አሰራጭተዋል።",
      image: "https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&q=80&w=800",
      color: "bg-red-500",
    },
    {
      id: 2,
      category: "ጤና",
      date: "መጋቢት 6, 2018",
      author: "የደምና ደዋይ",
      title: "የዓለም የደም ለጋሾች ቀን፡ ሕይወትን ለማዳን ጥሪ",
      desc: "ለጋሾቻችንን ለማክበር እና በአገር አቀፍ ደረጃ ደህንነቱ የተጠበቀ የደም ፍላጎትን በተመለከተ ግንዛቤ ማሳደግ ላይ ይቀላቀሉን።",
      image: "https://images.unsplash.com/photo-1615461066841-6116e61058f4?auto=format&fit=crop&q=80&w=800",
      color: "bg-blue-500",
    },
    {
      id: 3,
      category: "ወጣቶች",
      date: "መጋቢት 1, 2018",
      author: "በጎ ፈቃደኝነት",
      title: "የወጣት በጎ ፈቃደኞች የአየር ንብረት መቋቋም ፕሮጀክት ጀመሩ",
      desc: "በ4 ክልሎች ውስጥ ከ500 በላይ ወጣት በጎ ፈቃደኞች ዛፎችን በመትከል እና በአካባቢ ጥበቃ ላይ ስልጠናዎችን እየመሩ ይገኛሉ።",
      image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=800",
      color: "bg-green-500",
    }
  ] : lang === 'om' ? [
    {
      id: 1,
      category: "Ariifachiisaa",
      date: "March 20, 2026",
      author: "Kominikeeshinii",
      title: "Gargaarsi Murtteessaan Naannolee Balaa Lafaatiin Miidhamaniif Raabsame",
      desc: "Garee deebii keenyaa maatii 5,000 oliif wantoota barbaachisoo ta'an naannoo kibba Itiyoophiyaatti raabsaniiru.",
      image: "https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&q=80&w=800",
      color: "bg-red-500",
    },
    {
      id: 2,
      category: "Fayyaa",
      date: "March 15, 2026",
      author: "Dhiiga",
      title: "Guyyaa Arjoomtota Dhiigaa Addunyaa: Waamicha Lubbuu Baraaruu",
      desc: "Arjoomtota keenya kabajuu fi dhiiga qulqulluu barbaachisummaa isaa irratti hubannoo uumuu irratti nu waliin hirmaadhaa.",
      image: "https://images.unsplash.com/photo-1615461066841-6116e61058f4?auto=format&fit=crop&q=80&w=800",
      color: "bg-blue-500",
    },
    {
      id: 3,
      category: "Dargaggoota",
      date: "March 10, 2026",
      author: "Fedhaan Tajaajiluu",
      title: "Dargaggoonni Karee Dandamannaa Qilleensaa Jalqabsiisaniiru",
      desc: "Tajaajiltoonni dargaggootaa 500 oli naannoo 4 keessatti mukkeen dhaabaa fi barnoota naannoo irratti workshop geggeessaa jiru.",
      image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=800",
      color: "bg-green-500",
    }
  ] : [
    {
      id: 1,
      category: "Emergency",
      date: "March 20, 2026",
      author: "ERCS Communications",
      title: "Critical Aid Distributed to Flood-Affected Regions",
      desc: "Our response teams have distributed essential supplies to over 5,000 households affected by recent flooding in southern Ethiopia.",
      image: "https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&q=80&w=800",
      color: "bg-red-500",
    },
    {
      id: 2,
      category: "Health",
      date: "March 15, 2026",
      author: "Blood Bank Division",
      title: "World Blood Donor Day: A Call to Save Lives",
      desc: "Join us in celebrating our donors and raising awareness about the continuous need for safe blood products across the nation.",
      image: "https://images.unsplash.com/photo-1615461066841-6116e61058f4?auto=format&fit=crop&q=80&w=800",
      color: "bg-blue-500",
    },
    {
      id: 3,
      category: "Youth",
      date: "March 10, 2026",
      author: "Volunteer Network",
      title: "Youth Volunteers Launch Climate Resilience Project",
      desc: "Over 500 youth volunteers across 4 regions are planting trees and leading workshops on sustainable environmental practices.",
      image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=800",
      color: "bg-green-500",
    }
  ];

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
          {articles.map((post, idx) => (
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
          ))}
        </div>
      </div>
    </section>
  );
}
