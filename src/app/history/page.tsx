"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { 
  ArrowLeft, 
  History, 
  Award, 
  Heart, 
  ShieldAlert, 
  Globe, 
  Compass, 
  Calendar,
  Sparkles
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const milestones = [
  {
    year: "1935",
    icon: ShieldAlert,
    color: "bg-red-500 shadow-red-500/20",
    en: {
      title: "Founding & War Mobilization",
      desc: "ERCS was established by a decree on 8 July 1935 following the outbreak of the Second Italo-Ethiopian War. It quickly mobilized to provide emergency medical relief, ambulance networks, and shelter to wounded combatants and vulnerable civilians on the frontlines."
    },
    am: {
      title: "መመሥረት እና የጦርነት ምላሽ",
      desc: "በሁለተኛው የኢጣሊያ ወረራ ወቅት ሐምሌ 1 ቀን 1927 ዓ.ም (8 July 1935) ይፋዊ በሆነ አዋጅ ተመሠረተ። ድርጅቱ በፍጥነት በመንቀሳቀስ ለቆሰሉ ወታደሮች እና ሰላማዊ ሰዎች ድንገተኛ የመጀመሪያ እርዳታን፣ የአምቡላንስ አገልግሎትን እና መጠለያዎችን አቅርቧል።"
    },
    om: {
      title: "Hundeeffama & Sochii Waraanaa",
      desc: "Waraana lammaffaa Xaaliyaanii fi Itiyoophiyaa hordofee labsiin Adoolessa 8 bara 1935 hundeeffame. Dhaabbatichi battalatti ambulansii fi deeggarsa fayyaa ariifachiisaa waraana irratti miidhamaniifi siivilii hundaaf qopheessee bobba'e."
    }
  },
  {
    year: "1948",
    icon: Globe,
    color: "bg-blue-500 shadow-blue-500/20",
    en: {
      title: "International Recognition",
      desc: "Official recognition by the International Committee of the Red Cross (ICRC) was granted, and ERCS became a full member of the League of Red Cross Societies (now IFRC), integrating Ethiopia into the global humanitarian movement."
    },
    am: {
      title: "ዓለም አቀፍ እውቅና ማግኘት",
      desc: "በዓለም አቀፉ ቀይ መስቀል ኮሚቴ (ICRC) ይፋዊ እውቅና የተሰጠው ሲሆን በዓለም ቀይ መስቀል እና ቀይ ጨረቃ ማህበራት ፌዴሬሽን (IFRC) ውስጥ ሙሉ አባል በመሆን ኢትዮጵያን በዓለም አቀፉ ሰብአዊ ንቅናቄ ውስጥ አሳትፏል።"
    },
    om: {
      title: "Beekamtii Idil-addunyaa",
      desc: "Koreen Fannoo Diimaa Idil-addunyaa (ICRC) beekamtii seeraa kan kenne yoo ta'u, Fannoo Diimaan Itiyoophiyaa Federeeshinii Fannoo Diimaa Addunyaa (IFRC) tti makamuun sochii namoomaa addunyaa keessatti qooda fudhachuu jalqabe."
    }
  },
  {
    year: "1974-1985",
    icon: Heart,
    color: "bg-rose-500 shadow-rose-500/20",
    en: {
      title: "Crisis Relief & Famine Response",
      desc: "During severe nation-wide famines and droughts, ERCS scaled operations significantly. Establishing massive emergency feeding centers, medical camps, and relief logistics networks that saved millions of rural and urban lives."
    },
    am: {
      title: "የድርቅ እና የምግብ ዋስትና ቀውስ ምላሽ",
      desc: "በሀገሪቱ አስከፊ ድርቅ እና ረሃብ በተከሰተበት ወቅት ኢ.ቀ.መ.ማ የአሠራር አድማሱን በከፍተኛ ሁኔታ አስፋፋ። ግዙፍ የአስቸኳይ ጊዜ ምግቦች ማዕከላትን፣ የህክምና ካምፖችን እና የእርዳታ ስርጭት መረቦችን በመዘርጋት በሚሊዮን የሚቆጠሩ ሰዎችን ህይወት ታድጓል።"
    },
    om: {
      title: "Qubannaa Balaa fi Beela Mudate",
      desc: "Hongee fi beela hamaan biyyattii keessatti mudatee ture keessatti hojii isaa guddisee babal'ise. Gargaarsa nyaataa dafee dhaqqabu, buufataale wal'aansaa fi lojistiksii mijeessuun lubbuu miliyoonaa ol ta'u oolchuu danda'eera."
    }
  },
  {
    year: "2000s",
    icon: Compass,
    color: "bg-teal-500 shadow-teal-500/20",
    en: {
      title: "Modernization & Branch Expansion",
      desc: "ERCS modernized its operational capabilities and expanded structural coverage to all regional states, establishing more than 20 branches and the country's most comprehensive network of volunteer youth and blood banks."
    },
    am: {
      title: "የአሠራር ዘመናዊነት እና ቅርንጫፎች መስፋፋት",
      desc: "የአደጋ ምላሽ አቅሙን ዘመናዊ በማድረግ ሁሉንም የአገሪቱ ክልሎች የሚያካልሉ ከ20 በላይ ጠንካራ ቅርንጫፎችን አቋቋመ። በሀገሪቱ እጅግ አስተማማኝ የሆነ የበጎ ፈቃደኞች እና የደም ባንክ መዋቅርን ገነባ።"
    },
    om: {
      title: "Hammayyeessuufi Dameewwan Babal'isuu",
      desc: "Humna fi dandeettii hojii isaa hammayyeessuun naannolee biyyattii hunda irratti damee 20 ol ijaare. Networkii fedhan-laattotaa fi hojii baankii dhiigaa biyyattii keessatti bal'aa fi cimaa ta'e uumuu danda'eera."
    }
  },
  {
    year: "Present",
    icon: Award,
    color: "bg-amber-500 shadow-amber-500/20",
    en: {
      title: "90 Years of Legacy & Resilience",
      desc: "With a rich 90-year legacy of selfless service, ERCS remains Ethiopia's premier humanitarian institution, actively driving Disaster Risk Management (DRM), clean water projects (WASH), and youth resilience training."
    },
    am: {
      title: "የ90 ዓመታት ታላቅ ሰብአዊ ውርስ",
      desc: "ለ90 ዓመታት ያህል በቆየው ታላቅ የሰብአዊ አገልግሎት ውርሱ፣ ኢ.ቀ.መ.ማ በሀገሪቱ ውስጥ ግንባር ቀደም ሰብአዊ ተቋም ሆኖ ይቀጥላል፤ የአደጋ ስጋት ስራ አመራርን (DRM)፣ የንጹህ ውሃ (WASH) ፕሮጀክቶችን እና የወጣቶችን አቅም ግንባታ በንቃት እየመራ ይገኛል።"
    },
    om: {
      title: "Dhaala Gootummaa fi Waggaa 90ffaa",
      desc: "Waggaa 90 guutuu tajaajila namoomaa qulqulluu kennuun, ERCS Itiyoophiyaa keessatti dhaabbata namoomaa jalqabaa fi dursa ta'ee itti fufeera. Bulchiinsa balaa (DRM), bishaan qulqulluu (WASH) fi leenjii dargaggootaa irratti hojjechaa jira."
    }
  }
];

export default function HistoryPage() {
  const { lang } = useLanguage();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* Dynamic Header / Navigation */}
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
              <span className="text-[10px] font-bold text-[#ED1C24] uppercase tracking-[0.2em]">Ethiopia</span>
            </div>
          </Link>
          <Link href="/" className="text-xs font-black uppercase tracking-widest text-black hover:text-[#ED1C24] transition-all flex items-center gap-2 group">
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" /> 
            {lang === 'en' ? 'Back to Home' : lang === 'am' ? 'ወደ ዋናው ገጽ' : 'Gara Manaa'}
          </Link>
        </div>
      </header>

      {/* Hero Banner Section */}
      <section className="bg-slate-950 text-white py-32 relative overflow-hidden">
        <div className="absolute inset-0 opacity-15">
          <Image 
            src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=1200" 
            alt="History Hero"
            fill
            className="object-cover"
            unoptimized
          />
        </div>
        
        {/* Background HSL radial gradient circles */}
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[500px] h-[500px] bg-red-500/10 rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="container mx-auto px-6 relative z-10 text-center max-w-3xl space-y-6">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 bg-red-500/10 text-red-400 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] border border-red-500/20"
          >
            <History className="h-3 w-3 animate-spin [animation-duration:10s]" />
            {lang === 'en' ? 'OUR LEGACY' : lang === 'am' ? 'የእኛ ታሪክ' : 'SEENAA KEENYA'}
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-5xl md:text-7xl font-black tracking-tight leading-[0.9] text-white"
          >
            {lang === 'en' ? 'Humanity Through Time' : lang === 'am' ? 'ሰብአዊነት በታሪክ ሂደት' : 'Namooma Yeroo Keessa'}
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.0, delay: 0.3 }}
            className="text-white/60 text-lg md:text-xl font-medium leading-relaxed max-w-2xl mx-auto"
          >
            {lang === 'en' 
              ? "Guided by the seven fundamental principles, the Ethiopian Red Cross Society has spent nearly nine decades alleviating suffering and saving lives." 
              : lang === 'am' 
              ? "በሰባቱ መሰረታዊ መርሆች በመመራት የኢትዮጵያ ቀይ መስቀል ማህበር ለዘጠኝ አስርት አመታት ያህል ስቃይን በማቃለል እና ህይወትን በማዳን ላይ ቆይቷል።" 
              : "Qajeeltoowwan bu'uuraa toorban kanaan geggeeffamuun, Sosayetiin Fannoo Diimaa Itiyoophiyaa waggoota kurnan sagal guutuu dhiphuu hir'isuu fi lubbuu oolchaa jira."}
          </motion.p>
        </div>
      </section>

      {/* Interactive Timeline Body */}
      <main className="container mx-auto px-6 py-24 flex-grow relative max-w-5xl">
        {/* Central Vertical Line */}
        <div className="absolute left-1/2 top-24 bottom-24 w-1 bg-gradient-to-b from-red-500 via-blue-400 to-amber-500 -translate-x-1/2 hidden md:block rounded-full opacity-30" />

        <div className="space-y-16 md:space-y-24">
          {milestones.map((item, idx) => {
            const isEven = idx % 2 === 0;
            const Icon = item.icon;
            const localContent = lang === 'om' ? item.om : lang === 'am' ? item.am : item.en;

            return (
              <div key={idx} className={`relative flex flex-col md:flex-row items-center justify-between w-full ${isEven ? '' : 'md:flex-row-reverse'}`}>
                {/* Visual Placeholder for layout sizing on desktop */}
                <div className="w-full md:w-[45%] hidden md:block" />

                {/* Timeline Center Node */}
                <div className="absolute left-1/2 -translate-x-1/2 z-20 hidden md:block">
                  <motion.div 
                    whileHover={{ scale: 1.2, rotate: 10 }}
                    className={`w-14 h-14 rounded-2xl ${item.color} text-white flex items-center justify-center border-4 border-white transition-all`}
                  >
                    <Icon className="w-6 h-6" />
                  </motion.div>
                </div>

                {/* Milestones Card */}
                <motion.div 
                  initial={{ opacity: 0, x: isEven ? 50 : -50, y: 20 }}
                  whileInView={{ opacity: 1, x: 0, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className="w-full md:w-[45%] bg-white p-8 md:p-10 rounded-[36px] shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-gray-100 hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 relative overflow-hidden group"
                >
                  {/* Decorative faint background year */}
                  <div className="absolute top-4 right-6 text-7xl font-black text-gray-50 -z-10 select-none transition-transform duration-700 group-hover:scale-105">
                    {item.year}
                  </div>

                  {/* Icon for mobile view only */}
                  <div className="flex items-center gap-4 mb-6 md:hidden">
                    <div className={`w-10 h-10 rounded-xl ${item.color} text-white flex items-center justify-center`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-xl font-black text-[#ED1C24]">{item.year}</span>
                  </div>

                  <div className="space-y-4">
                    <span className="text-sm font-black tracking-widest text-[#ED1C24] uppercase hidden md:inline-block">
                      {item.year}
                    </span>
                    <h3 className="text-2xl font-black text-black leading-tight tracking-tight group-hover:text-[#ED1C24] transition-colors">
                      {localContent.title}
                    </h3>
                    <p className="text-gray-500 font-medium text-sm leading-relaxed">
                      {localContent.desc}
                    </p>
                  </div>

                  {/* Top Highlight strip */}
                  <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-[#ED1C24] to-red-500 rounded-t-full scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                </motion.div>
              </div>
            );
          })}
        </div>
      </main>

      {/* Quote Banner */}
      <section className="bg-slate-900 py-20 px-6 border-t border-slate-800 text-center relative overflow-hidden">
        <div className="container mx-auto max-w-2xl space-y-6 relative z-10">
          <Sparkles className="h-8 w-8 text-red-500 mx-auto animate-pulse" />
          <blockquote className="text-xl md:text-2xl font-black tracking-tight text-white/95 italic">
            {lang === 'en' 
              ? '"Humanity through Neutrality since 1935."' 
              : lang === 'am' 
              ? '"ሰብአዊነት በገለልተኝነት ከ1927 ዓ.ም ጀምሮ።"' 
              : '"Tajaajila Namoomaa Giddu-galeessummaan bara 1935 eegalee."'}
          </blockquote>
          <p className="text-xs font-black uppercase tracking-[0.25em] text-red-500">
            {lang === 'en' 
              ? 'ETHIOPIAN RED CROSS SOCIETY' 
              : lang === 'am' 
              ? 'የኢትዮጵያ ቀይ መስቀል ማህበር' 
              : 'SOSAYETII FANNOO DIIMAA ITIYOOPHIYAA'}
          </p>
        </div>
      </section>

      {/* Simple Footer */}
      <footer className="bg-slate-950 text-gray-500 py-10 border-t border-slate-900">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-bold uppercase tracking-wider">
          <span>ERCS Heritage Project</span>
          <span>© {new Date().getFullYear()} Ethiopian Red Cross Society</span>
        </div>
      </footer>
    </div>
  );
}
