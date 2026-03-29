"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { 
  Target, 
  Eye, 
  Heart, 
  ShieldCheck 
} from "lucide-react";
import { Language, translations } from "@/lib/translations";

interface WhoWeAreProps {
  lang: Language;
}

export default function WhoWeAre({ lang }: WhoWeAreProps) {
  const t = translations[lang];
  const local = t.whoWeAre;

  return (
    <section id="about" className="py-32 bg-white relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="max-w-xl mb-20">
          <h2 className="text-sm font-black text-ercs-red uppercase tracking-[0.3em] mb-4">
            {local.badge}
          </h2>
          <h3 className={`${lang === 'en' ? 'text-5xl md:text-6xl' : 'text-4xl md:text-5xl'} font-black text-black leading-[0.9] tracking-tighter`}>
            {local.title}
          </h3>
        </div>

        <div className="grid md:grid-cols-2 gap-16 items-center mb-24">
          <div className="space-y-6">
            <h4 className="text-3xl font-black text-black">{local.storyTitle}</h4>
            <div className="space-y-4 text-black/70 font-medium leading-relaxed">
              <p>{local.storyText1}</p>
              <p>{local.storyText2}</p>
            </div>
          </div>
          <div className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl group border-4 border-white">
            <Image 
              src={local.imageUrl} 
              alt="Our Story"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: local.missionTitle, text: local.missionText, icon: Target, color: "text-red-500", bg: "bg-red-50" },
            { title: local.visionTitle, text: local.visionText, icon: Eye, color: "text-blue-500", bg: "bg-blue-50" },
            { title: local.valuesTitle, text: local.valuesText, icon: Heart, color: "text-rose-500", bg: "bg-rose-50" }
          ].map((item, i) => (
            <div 
              key={i}
              className="group relative bg-white p-10 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
            >
              <div className={`h-14 w-14 ${item.bg} ${item.color} rounded-2xl flex items-center justify-center mb-6 transition-transform duration-500 group-hover:rotate-6`}>
                <item.icon className="h-7 w-7" />
              </div>
              <h5 className="text-xl font-bold text-black mb-3">{item.title}</h5>
              <p className="text-black/60 font-medium text-sm leading-relaxed">
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
