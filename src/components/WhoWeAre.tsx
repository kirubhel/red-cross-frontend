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

  // Default contents if not in translations yet
  const content = {
    en: {
      aboutBadge: "Who We Are",
      aboutTitle: "Leading humanitarian organization in Ethiopia",
      storyTitle: "Our Story",
      storyText: "The Ethiopian Red Cross Society has been at the forefront of humanitarian action in Ethiopia for decades. As part of the International Red Cross and Red Crescent Movement, we are committed to preventing and alleviating human suffering. Our network of volunteers and staff reaches communities across Ethiopia, providing essential services and support to those in need.",
      storyText2: "We work tirelessly to protect life and health, ensure respect for human beings, and prevent and alleviate human suffering. Guided by the seven Fundamental Principles of the Red Cross Movement—Humanity, Impartiality, Neutrality, Independence, Voluntary Service, Unity, and Universality.",
      missionTitle: "Our Mission",
      missionText: "To prevent and alleviate human suffering, protect life and health, and ensure respect for the human being, without any discrimination.",
      visionTitle: "Our Vision",
      visionText: "To be a leading, strong, and self-reliant humanitarian organization that provides effective and efficient services to the vulnerable.",
      valuesTitle: "Our Values",
      valuesText: "Guided by the 7 Principles: Humanity, Impartiality, Neutrality, Independence, Voluntary Service, Unity, and Universality."
    },
    am: {
      aboutBadge: "እኛ ማን ነን",
      aboutTitle: "በኢትዮጵያ ቀዳሚው ሰብአዊ ድርጅት",
      storyTitle: "የእኛ ታሪክ",
      storyText: "የኢትዮጵያ ቀይ መስቀል ማህበር ለበርካታ አስርት ዓመታት በኢትዮጵያ የሰብአዊ እርምጃ ግንባር ቀደም ሆኖ ቆይቷል. የዓለም አቀፉ ቀይ መስቀል እና ቀይ ጨረቃ ንቅናቄ አካል በመሆን የሰውን ልጅ ስቃይ ለመከላከል እና ለማቃለል ቆርጠን ተነስተናል.",
      storyText2: "ሕይወትንና ጤናን ለመጠበቅ፣ ለሰው ልጆች መከባበርን ለማረጋገጥ እና የሰውን ልጅ ስቃይ ለመከላከልና ለማቃለል ደከመኝ ሰለቸኝ ሳይሉ እንሰራለን። በሰባቱ የቀይ መስቀል ንቅናቄ መርሆዎች የሚመራ።",
      missionTitle: "የእኛ ተልዕኮ",
      missionText: "የሰውን ልጅ ስቃይ መከላከልና ማቃለል፣ ሕይወትንና ጤናን መጠበቅ፣ ያለ ምንም አድልዎ ሰብአዊነትን ማክበር",
      visionTitle: "የእኛ ራዕይ",
      visionText: "ለተጎዱ ወገኖች ውጤታማ ድጋፍ የሚሰጥ ጠንካራ እና ራሱን የቻለ ድርጅት መሆን",
      valuesTitle: "እሴቶቻችን",
      valuesText: "በ7ቱ መርሆች ይመራል፡- ሰብአዊነት፣ አድልዎ የለሽነት፣ ገለልተኝነት፣ ነፃነት፣ በጎ ፈቃደኝነት፣ አንድነት፣ ሁለንተናዊነት"
    },
    om: {
      aboutBadge: "Eenyu Nu'i",
      aboutTitle: "Dhaabbata namoomaa jalqabaa Itiyoophiyaa",
      storyTitle: "Seenaa Keenya",
      storyText: "Waldaan Fannoo Diimaa Itiyoophiyaa waggoota kurnan hedduuf Itiyoophiyaa keessatti tarkaanfii namoomaa irratti shoora guddaa taphachaa jira.",
      storyText2: "Lubbuu fi fayyaa eeguuf, namoota kabajuu mirkaneessuuf, akkasumas dhiphuu namoomaa ittisuu fi hir'isuuf jabaannee hojjenna. Qajeeltoo 7n Fannoo Diimaatiin geggeeffama.",
      missionTitle: "Ergama Keenya",
      missionText: "Dhiphuu namoomaa ittisuu fi hir'isuu, lubbuu fi fayyaa eeguu, akkasumas korniyaa fi loogii malee nama kabajuu.",
      visionTitle: "Mul'ata Keenya",
      visionText: "Dhaabbata namoomaa cimaa fi of danda'e ta'anii tajaajila bu'a qabeessa kennuu",
      valuesTitle: "Gatataa Keenya",
      valuesText: "Qajeeltoo 7n geggeeffama: Namooma, Wal-qixxummaa, Giddu-galeessummaa, Of-danda'uu, Fedhaan Tajaajiluu, Tokkummaa, Universality"
    }
  };

  const local = content[lang] || content['en'];

  return (
    <section id="about" className="py-32 bg-white relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="max-w-xl mb-20">
          <h2 className="text-sm font-black text-ercs-red uppercase tracking-[0.3em] mb-4">
            {local.aboutBadge}
          </h2>
          <h3 className={`${lang === 'en' ? 'text-5xl md:text-6xl' : 'text-4xl md:text-5xl'} font-black text-black leading-[0.9] tracking-tighter`}>
            {local.aboutTitle}
          </h3>
        </div>

        <div className="grid md:grid-cols-2 gap-16 items-center mb-24">
          <div className="space-y-6">
            <h4 className="text-3xl font-black text-black">{local.storyTitle}</h4>
            <div className="space-y-4 text-black/70 font-medium leading-relaxed">
              <p>{local.storyText}</p>
              <p>{local.storyText2}</p>
            </div>
          </div>
          <div className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl group border-4 border-white">
            <Image 
              src="https://redcrosseth.org/wp-content/uploads/2025/06/90-AMET-COVER-for-website-1200-by-700.png" 
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
