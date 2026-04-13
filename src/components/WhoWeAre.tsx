"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { 
  Target, 
  Eye, 
  Heart, 
  History,
  Info
} from "lucide-react";
import { Language, translations } from "@/lib/translations";

interface WhoWeAreProps {
  lang: Language;
  content?: typeof translations.en.whoWeAre;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as any }
  }
};

export default function WhoWeAre({ lang, content }: WhoWeAreProps) {
  const t = translations[lang];
  const local = content || t.whoWeAre;

  return (
    <section id="about" className="py-24 md:py-32 bg-[#F9FAFB] relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-ercs-red/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />
      
      <div className="container mx-auto px-6 relative z-10">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="flex flex-col gap-24"
        >
          {/* Header & Story Section */}
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <motion.div variants={itemVariants} className="space-y-8">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-ercs-red/10 text-ercs-red rounded-xl text-[10px] font-black uppercase tracking-[0.2em]">
                  <Info className="h-3.5 w-3.5" />
                  {local.badge}
                </div>
                <h3 className={`${lang === 'en' ? 'text-5xl md:text-7xl' : 'text-4xl md:text-5xl'} font-black text-black leading-[0.85] tracking-tighter`}>
                  {local.title}
                </h3>
              </div>

              <div className="relative pl-8 border-l-4 border-ercs-red/20 space-y-6">
                <div className="flex items-center gap-3">
                   <div className="h-10 w-10 rounded-full bg-white shadow-md flex items-center justify-center text-ercs-red">
                      <History className="h-5 w-5" />
                   </div>
                   <h4 className="text-2xl font-black text-black">{local.storyTitle}</h4>
                </div>
                <div className="space-y-6 text-black/60 font-medium text-lg leading-relaxed max-w-xl">
                  <p>{local.storyText1}</p>
                  <p>{local.storyText2}</p>
                </div>

                <motion.div variants={itemVariants} className="pt-4">
                  <a 
                    href={local.historyLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-3 px-6 py-3 bg-white hover:bg-black text-black hover:text-white rounded-2xl font-black text-sm uppercase tracking-widest border border-black/10 transition-all duration-300 shadow-sm hover:shadow-xl hover:-translate-y-1"
                  >
                    {local.historyLinkLabel}
                    <div className="w-8 h-8 rounded-full bg-ercs-red/10 flex items-center justify-center group-hover:bg-ercs-red transition-colors">
                      <History className="h-4 w-4 text-ercs-red group-hover:text-white" />
                    </div>
                  </a>
                </motion.div>
              </div>
            </motion.div>

            <motion.div 
              variants={itemVariants}
              className="relative group"
            >
              <div className="absolute -inset-4 bg-ercs-red/5 rounded-[48px] rotate-2 group-hover:rotate-1 transition-transform duration-700" />
              <div className="relative aspect-[4/3] rounded-[40px] overflow-hidden shadow-2xl border-8 border-white">
                <Image 
                  src={local.imageUrl} 
                  alt="ERCS Narrative"
                  fill
                  className="object-cover transition-transform duration-1000 group-hover:scale-110"
                />
                <div className="absolute inset-x-0 bottom-0 p-8 bg-gradient-to-t from-black/80 to-transparent">
                  <p className="text-white/80 text-sm font-bold tracking-wide italic">
                    "Humanity through Neutrality since 1935"
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Core Foundations (Mission/Vision/Values) */}
          <div className="space-y-12">
            <motion.div variants={itemVariants} className="text-center space-y-4">
               <h4 className="text-3xl md:text-4xl font-black text-black tracking-tight underline decoration-ercs-red/20 decoration-8 underline-offset-8">
                  {local.storyTitle}
               </h4>
               <p className="text-black/50 font-bold uppercase text-[10px] tracking-[0.3em]">Our Foundational Pillars</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
              {[
                { 
                  title: local.missionTitle, 
                  text: local.missionText, 
                  icon: Target, 
                  color: "text-[#ED1C24]", 
                  bg: "bg-red-50",
                  border: "hover:border-red-200" 
                },
                { 
                  title: local.visionTitle, 
                  text: local.visionText, 
                  icon: Eye, 
                  color: "text-blue-600", 
                  bg: "bg-blue-50",
                  border: "hover:border-blue-200"
                },
                { 
                  title: local.valuesTitle, 
                  text: local.valuesText, 
                  icon: Heart, 
                  color: "text-rose-500", 
                  bg: "bg-rose-50",
                  border: "hover:border-rose-200"
                }
              ].map((item, i) => (
                <motion.div 
                  key={i}
                  variants={itemVariants}
                  whileHover={{ y: -10 }}
                  className={`group relative bg-white p-12 rounded-[40px] border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] ${item.border} hover:shadow-2xl transition-all duration-500 overflow-hidden`}
                >
                  <div className={`h-16 w-16 ${item.bg} ${item.color} rounded-2xl flex items-center justify-center mb-8 transition-transform duration-500 group-hover:rotate-[10deg] shadow-inner`}>
                    <item.icon className="h-8 w-8" />
                  </div>
                  <h5 className="text-2xl font-black text-black mb-4 tracking-tight">{item.title}</h5>
                  <p className="text-black/60 font-medium text-base leading-relaxed">
                    {item.text}
                  </p>
                  
                  {/* Decorative background number */}
                  <div className="absolute top-10 right-10 text-8xl font-black text-gray-50 -z-10 select-none">
                    0{i + 1}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
