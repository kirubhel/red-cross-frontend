"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, Variants, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { landingContent } from "@/lib/cms-content";
import { 
  ArrowRight, 
  Heart, 
  Users, 
  Activity, 
  ShieldCheck, 
  Globe, 
  ChevronRight,
  ChevronDown,
  Flame,
  Droplets,
  Plus,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Languages
} from "lucide-react";
import { translations, Language } from "@/lib/translations";
import { useEffect, useRef, useState } from "react";
import { useInView, useMotionValue, useSpring, useTransform } from "framer-motion";
import WhoWeAre from "@/components/WhoWeAre";
import NewsSection from "@/components/NewsSection";
import WelcomeModal from "@/components/WelcomeModal";
import DonationModal from "@/components/DonationModal";
import Header from "@/components/layout/Header";
import { useLanguage } from "@/context/LanguageContext";

const MotionHeart = motion.create(Heart);


function CountUp({ value, suffix = "" }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, {
    damping: 30,
    stiffness: 100,
  });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (isInView) {
      motionValue.set(value);
    }
  }, [isInView, value, motionValue]);

  useEffect(() => {
    return springValue.on("change", (latest) => {
      setCount(Math.round(latest));
    });
  }, [springValue]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

function FallingDroplets({ color, count = 6 }: { color: string; count?: number }) {
  const [droplets, setDroplets] = useState<{ id: number; left: string; size: number; duration: number; delay: number }[]>([]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDroplets([...Array(count)].map((_, i) => ({
      id: i,
      left: Math.random() * 100 + "%",
      size: Math.random() * 8 + 4,
      duration: Math.random() * 2 + 3,
      delay: Math.random() * 5
    })));
  }, [count]);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {droplets.map((drop) => (
        <motion.div
          key={drop.id}
          className="absolute rounded-full"
          style={{ 
            backgroundColor: color, 
            width: drop.size + "px", 
            height: drop.size * 1.5 + "px",
            top: "-20px",
            left: drop.left,
            opacity: 0
          }}
          animate={{
            y: [0, 450],
            opacity: [0, 0.4, 0],
          }}
          transition={{
            duration: drop.duration,
            repeat: Infinity,
            delay: drop.delay,
            ease: "linear"
          }}
        />
      ))}
    </div>
  );
}

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const heartVariants: Variants = {
  heartbeat: {
    scale: [1, 1.15, 1, 1.35, 1],
    color: ["#ffffff", "#ED1C24", "#ffffff", "#ED1C24", "#ffffff"],
    fill: ["#ffffff", "#ED1C24", "#ffffff", "#ED1C24", "#ffffff"],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut",
      times: [0, 0.15, 0.3, 0.5, 1]
    }
  }
};

export default function LandingPage() {
  const { lang, t } = useLanguage();
  const [dynamicContent, setDynamicContent] = useState<Record<Language, typeof translations.en> | null>(null);
  const [isDonationModalOpen, setIsDonationModalOpen] = useState(false);
  const [currentHeroImageIndex, setCurrentHeroImageIndex] = useState(0);
  
  // Merge dynamic content with context translations
  const mergedT: typeof translations.en = {
    ...t,
    ...(dynamicContent?.[lang] || {}),
    hero: {
      ...t.hero,
      ...(dynamicContent?.[lang]?.hero || {})
    },
    membership: {
      ...t.membership,
      ...(dynamicContent?.[lang]?.membership || {}),
      tiers: {
        ...(t.membership?.tiers || {}),
        ...(dynamicContent?.[lang]?.membership?.tiers || {})
      }
    },
    programsSection: {
      ...t.programsSection,
      ...(dynamicContent?.[lang]?.programsSection || {})
    },
    volunteerSection: {
      ...t.volunteerSection,
      ...(dynamicContent?.[lang]?.volunteerSection || {})
    },
    contactSection: {
      ...t.contactSection,
      ...(dynamicContent?.[lang]?.contactSection || {})
    }
  };

  // Get images from dynamic content or default to empty array
  const heroImages = mergedT.hero.imageUrls || (mergedT.hero.imageUrl ? [mergedT.hero.imageUrl] : []);

  // Auto-rotate hero images
  useEffect(() => {
    if (heroImages.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentHeroImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000); // Change image every 5 seconds
    
    return () => clearInterval(interval);
  }, [heroImages.length]);

  useEffect(() => {
    const fetchCMS = async () => {
      try {
        const languages: Language[] = ['en', 'am', 'om'];
        const results = await Promise.all(
          languages.map(code => 
            fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1'}/config/landing-page?lang=${code}`)
              .then(res => res.json())
              .then(res => ({ code, data: JSON.parse(res.content_json) }))
              .catch(() => ({ code, data: translations[code] }))
          )
        );
        
        const contentMap: any = {};
        results.forEach(r => {
          contentMap[r.code] = r.data;
        });
        setDynamicContent(contentMap);
      } catch (e) {
        console.error("Failed to load CMS content:", e);
      }
    };
    fetchCMS();
  }, []);

  useEffect(() => {
    if (isDonationModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; }
  }, [isDonationModalOpen]);

  return (
    <div className="flex flex-col min-h-screen bg-white selection:bg-ercs-red selection:text-white overflow-x-hidden">
      <DonationModal isOpen={isDonationModalOpen} onClose={() => setIsDonationModalOpen(false)} />

      {/* Decorative Background Elements */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-ercs-red/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-ercs-red/5 rounded-full blur-[120px]" />
      </div>

      <Header />

      <main className="relative z-10">
        {/* Hero Section */}
        <section className="relative pt-10 pb-12 px-6 overflow-hidden min-h-[80vh] flex items-center">
          {/* Decorative Hero Swoosh */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full pointer-events-none z-0 overflow-visible">
            <svg viewBox="0 0 1000 600" className="w-[150%] h-[150%] -translate-x-[15%]">
              <motion.path
                d="M -100 750 C 200 700 600 0 1100 -50"
                stroke="#FF1A21"
                strokeWidth="160"
                fill="none"
                strokeLinecap="round"
                opacity="0.12"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.12 }}
                transition={{ 
                  duration: 2.5, 
                  ease: [0.16, 1, 0.3, 1] as any,
                }}
              />
              {/* Secondary Accent Lines like in the 90th anniversary image */}
              <motion.path
                d="M -50 780 C 250 730 650 30 1150 -20"
                stroke="#FF1A21"
                strokeWidth="2"
                fill="none"
                opacity="0.2"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 3, delay: 0.5 }}
              />
              <motion.path
                d="M 0 810 C 300 760 700 60 1200 10"
                stroke="#FF1A21"
                strokeWidth="1"
                fill="none"
                opacity="0.1"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 3, delay: 0.7 }}
              />
            </svg>
          </div>

          <div className="container mx-auto grid lg:grid-cols-[0.85fr_1.15fr] gap-8 xl:gap-16 items-center relative z-10">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-5"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-ercs-light text-ercs-red rounded-full text-[11px] font-black uppercase tracking-widest animate-pulse">
                <ShieldCheck className="h-4 w-4" /> {mergedT.hero.tagline}
              </div>
              <h1 className={`${lang === 'en' ? 'text-5xl md:text-7xl lg:text-8xl' : 'text-4xl md:text-6xl lg:text-7xl'} font-black text-black leading-[0.9] tracking-tighter`}>
                {mergedT.hero.title1} <br />
                <span className="relative inline-block">
                  <span className="text-[#ED1C24]">{mergedT.hero.title2}</span> <br /> 
                  {mergedT.hero.title3}
                </span>
              </h1>
              <p className={`${lang === 'en' ? 'text-lg md:text-xl' : 'text-base md:text-lg'} text-black/70 max-w-xl leading-relaxed font-medium`}>
                {mergedT.hero.subtitle}
              </p>
              {/* Hero CTA Pathway Buttons */}
              <div className="space-y-4 pt-4">
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.35 }}
                  className="text-[10px] font-black uppercase tracking-[0.3em] text-black/40"
                >
                  {(mergedT.hero as any).pathwaysLabel}
                </motion.p>

                <div className="flex flex-row items-center gap-4 pt-2">
                  {/* Volunteer */}
                  <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.45, duration: 0.5, ease: [0.16, 1, 0.3, 1] as any }}
                  >
                    <Link href="/join/member">
                      <button className="group flex items-center gap-3 sm:gap-4 bg-[#ED1C24] border-2 border-[#ED1C24] hover:bg-white hover:text-[#ED1C24]
                        text-white rounded-full h-12 sm:h-14 px-6 sm:px-8 font-black text-sm sm:text-base
                        shadow-2xl shadow-[#ED1C24]/30 transition-all duration-500
                        hover:-translate-y-2 hover:shadow-[#ED1C24]/40 cursor-pointer whitespace-nowrap">
                        <div className="h-8 w-8 rounded-full bg-white/20 flex items-center
                          justify-center group-hover:bg-[#ED1C24] group-hover:text-white transition-colors flex-shrink-0">
                          <Users className="h-4 w-4" />
                        </div>
                        {mergedT.hero.ctaVolunteer || translations[lang].hero.ctaVolunteer || "Volunteer"}
                      </button>
                    </Link>
                  </motion.div>

                  {/* Donate */}
                  <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.55, duration: 0.5, ease: [0.16, 1, 0.3, 1] as any }}
                  >
                    <button 
                      onClick={() => setIsDonationModalOpen(true)}
                      className="group flex items-center gap-3 sm:gap-4 bg-black border-2 border-black hover:bg-white hover:text-[#ED1C24] hover:border-[#ED1C24]
                        text-white rounded-full h-12 sm:h-14 px-6 sm:px-8 font-black text-sm sm:text-base
                        shadow-2xl shadow-black/20 transition-all duration-500
                        hover:-translate-y-2 hover:shadow-[#ED1C24]/30 cursor-pointer whitespace-nowrap">
                        <div className="h-8 w-8 rounded-full bg-white/15 group-hover:bg-[#ED1C24] group-hover:text-white
                          flex items-center justify-center transition-colors flex-shrink-0">
                          <MotionHeart
                            variants={heartVariants}
                            animate="heartbeat"
                            className="h-4 w-4"
                          />
                        </div>
                        {mergedT.hero.ctaDonate || translations[lang].hero.ctaDonate || "Donate"}
                    </button>
                  </motion.div>
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="relative aspect-[12/8] w-full max-w-3xl mx-auto lg:ml-auto"
            >
              <div className="absolute inset-0 bg-[#ED1C24]/10 rounded-[40px] translate-x-4 translate-y-4 blur-3xl opacity-50" />
              <div className="relative h-full w-full bg-white border-8 border-white rounded-[40px] shadow-2xl overflow-hidden group">
                <AnimatePresence initial={false}>
                  <motion.div
                    key={currentHeroImageIndex}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ 
                      duration: 1.5, 
                      ease: [0.4, 0, 0.2, 1] as any
                    }}
                    className="absolute inset-0"
                  >
                    <Image 
                      src={heroImages[currentHeroImageIndex] || mergedT.hero.imageUrl}
                      alt="ERCS 90 Years"
                      fill
                      className="object-cover"
                      priority
                      unoptimized
                    />
                  </motion.div>
                </AnimatePresence>
                
                {/* Image Navigation Indicators */}
                {heroImages.length > 1 && (
                  <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-2">
                    {heroImages.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentHeroImageIndex(idx)}
                        className={`h-1.5 rounded-full transition-all duration-500 ${
                          currentHeroImageIndex === idx ? "w-8 bg-white" : "w-2 bg-white/40 hover:bg-white/60"
                        }`}
                      />
                    ))}
                  </div>
                )}

                 <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-8">
                    <p className="text-white font-bold text-lg">{mergedT.hero.anniversary}</p>
                 </div>

                  {/* Floating Membership Button */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ 
                      opacity: 1, 
                      scale: 1,
                      y: [0, -15, 0] 
                    }}
                    transition={{ 
                      opacity: { duration: 0.8, delay: 0.8 },
                      scale: { duration: 0.8, delay: 0.8 },
                      y: { 
                        duration: 6, 
                        repeat: Infinity, 
                        ease: "easeInOut",
                        delay: 1.6
                      }
                    }}
                    className="absolute bottom-6 right-6 z-30"
                  >
                    <Link href="/join/member">
                      <button className="group flex items-center gap-4 bg-white hover:bg-[#ED1C24]
                        text-black hover:text-white rounded-3xl h-16 pl-6 pr-8 font-black text-lg
                        border-2 border-black/10 hover:border-[#ED1C24]
                        shadow-2xl shadow-black/10 transition-all duration-500
                        hover:-translate-y-2 cursor-pointer whitespace-nowrap">
                        <div className="h-10 w-10 rounded-full bg-black/5 group-hover:bg-white/20
                          flex items-center justify-center transition-colors flex-shrink-0">
                          <ShieldCheck className="h-5 w-5" />
                        </div>
                        {mergedT.hero.ctaMembership || translations[lang].hero.ctaMembership || "Membership"}
                      </button>
                    </Link>
                  </motion.div>
              </div>

              {/* Stats Floaties */}
              <motion.div 
                animate={{ y: [0, -20, 0] }} transition={{ duration: 4, repeat: Infinity }}
                className="absolute -top-6 -right-6 p-4 bg-white rounded-2xl shadow-xl border border-gray-50 text-center z-20"
              >
                <div className="text-2xl font-black text-[#ED1C24]">45k+</div>
                <div className="text-[10px] uppercase font-black text-black/40">{mergedT.hero.volunteers}</div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Dynamic Stats Bar */}
        <section className="bg-gray-900 py-12 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
             <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />
          </div>
          <div className="container mx-auto px-6 relative z-10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-px md:bg-gray-800">
              {[
                { label: mergedT.stats.volunteers, value: 45000, suffix: "+", icon: Users, isCounter: true },
                { label: mergedT.stats.branches, value: 12, suffix: "+", icon: Globe, isCounter: true },
                { label: mergedT.stats.impact, value: mergedT.stats.impactValue, icon: Activity },
                { label: mergedT.stats.founded, value: "1935", icon: Flame }
              ].map((stat, i) => (
                <div key={i} className="bg-gray-900 md:px-12 py-4 flex flex-col items-center md:items-start space-y-2">
                  <div className="text-[#ED1C24] text-xs font-black uppercase tracking-widest">{stat.label}</div>
                  <div className="text-2xl md:text-3xl font-black text-white">
                    {stat.isCounter ? (
                      <CountUp value={stat.value as number} suffix={stat.suffix} />
                    ) : (
                      stat.value
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Who We Are & About Section */}
        <WhoWeAre lang={lang} content={mergedT.whoWeAre} />

        {/* Services Section */}
        <section id="services" className="py-32 px-6">
          <div className="container mx-auto">
            <div className="max-w-xl mb-20">
              <h2 className="text-sm font-black text-ercs-red uppercase tracking-[0.3em] mb-4">{mergedT.services.badge}</h2>
              <h3 className={`${lang === 'en' ? 'text-3xl md:text-4xl' : 'text-2xl md:text-3xl'} font-black text-black leading-[0.9] tracking-tighter`}>
                {mergedT.services.title}
              </h3>
            </div>

            <motion.div 
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            >
              {((mergedT.services as any).items || []).filter(Boolean).map((service: any, i: number) => {
                const iconName = service.icon || 'Activity';
                const IconComponent = (({
                  Flame,
                  Activity,
                  Droplets,
                  ShieldCheck,
                  Users,
                  Heart,
                  Plus,
                  Globe
                } as Record<string, any>)[iconName]) || Activity;

                const MotionIcon = motion.create(IconComponent);

                return (
                  <motion.div 
                    key={service.id || i}
                    variants={fadeIn}
                    className="group relative bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden flex flex-col"
                  >
                    <div className={`h-14 w-14 ${service.bg || 'bg-red-50'} ${service.color || 'text-ercs-red'} rounded-2xl flex items-center justify-center mb-6 rotate-3 group-hover:rotate-12 transition-transform duration-500`}>
                      <MotionIcon className="h-7 w-7" />
                    </div>
                    <h4 className={`${lang === 'en' ? 'text-lg' : 'text-base'} font-black text-black mb-2 line-clamp-2`}>{service.title || 'Service Title'}</h4>
                    <p className="text-black/60 text-xs leading-relaxed mb-2 line-clamp-4 flex-grow">
                      {service.desc || 'Service description goes here...'}
                    </p>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </section>

        {/* Member Section */}
        <section id="impact" className="py-32 bg-gray-50 relative overflow-hidden">
          <div className="container mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-20 items-center">
              <div className="space-y-8">
                <h2 className="text-sm font-black text-[#ED1C24] uppercase tracking-[0.3em]">{mergedT.membership.badge}</h2>
                <h3 className={`${lang === 'en' ? 'text-5xl md:text-7xl' : 'text-4xl md:text-6xl'} font-black text-black leading-[0.9] tracking-tighter`}>
                  {mergedT.membership.title}
                </h3>
                <p className={`${lang === 'en' ? 'text-xl' : 'text-lg'} text-black/60 font-medium leading-relaxed max-w-lg`}>
                  {mergedT.membership.desc}
                </p>
                <div className="space-y-4">
                  {mergedT.membership.features.map(item => (
                    <div key={item} className="flex items-center gap-3 font-bold text-black">
                      <ShieldCheck className="h-6 w-6 text-[#ED1C24]" /> {item}
                    </div>
                  ))}
                </div>
                <Link href="/join/member">
                  <Button size="lg" className="bg-black border-2 border-black hover:bg-white hover:text-[#ED1C24] hover:border-[#ED1C24] text-white rounded-2xl h-16 px-10 text-lg font-black transition-all shadow-xl shadow-black/10">
                    {mergedT.membership.cta} <ChevronRight className="ml-2" />
                  </Button>
                </Link>
              </div>
              <div className="relative">
                 <div className="aspect-square bg-[#ED1C24] rounded-full absolute -top-10 -right-10 w-32 h-32 blur-3xl opacity-20" />
                 <div className="bg-white p-12 rounded-[48px] shadow-2xl border border-gray-100 relative z-10">
                    <div className="space-y-12">
                       <div className="flex items-center justify-between">
                          <div className="h-20 w-20 bg-white rounded-2xl flex items-center justify-center shadow-lg relative overflow-hidden border border-red-50">
                             <Image 
                               src="/logo.png" 
                               alt="ERCS Logo" 
                               fill
                               className="object-contain p-3"
                               unoptimized
                             />
                          </div>
                          <div className="text-right">
                             <div className="text-4xl font-black text-black">
                               <CountUp value={6.2} suffix="M+" />
                             </div>
                             <div className="text-xs font-black text-black/40 uppercase tracking-widest">{mergedT.membership.activeMembers}</div>
                          </div>
                       </div>
                        <div className="h-px bg-gray-100" />
                        <div className="space-y-6">
                           {/* Individual Tiers */}
                           <div className="space-y-4">
                              <div className="flex items-center gap-3">
                                 <div className="h-px flex-1 bg-gray-50" />
                                 <h6 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#ED1C24] shrink-0">Individual Tiers</h6>
                                 <div className="h-px flex-1 bg-gray-50" />
                              </div>
                              <div className="grid gap-2">
                                {(mergedT.membership.tiers?.individual || []).map((tier: any, idx: number) => (
                                  <div key={idx} className="flex justify-between items-center group cursor-default p-2 rounded-xl hover:bg-red-50/50 transition-all border border-transparent hover:border-red-100/50">
                                    <span className="font-bold text-black tracking-tight group-hover:translate-x-1 transition-transform">{tier.name}</span>
                                    <span className="font-black text-[#ED1C24] bg-white border border-red-50 px-3 py-1 rounded-lg text-xs shadow-sm">{tier.price}</span>
                                  </div>
                                ))}
                              </div>
                           </div>

                             {/* Corporate Tiers */}
                           <div className="space-y-4">
                              <div className="flex items-center gap-3">
                                 <div className="h-px flex-1 bg-gray-50" />
                                 <h6 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#ED1C24] shrink-0">Corporate Tiers</h6>
                                 <div className="h-px flex-1 bg-gray-50" />
                              </div>
                              <div className="grid gap-2">
                                {(mergedT.membership.tiers?.corporate || []).map((tier: any, idx: number) => (
                                  <div key={idx} className="flex justify-between items-center group cursor-default p-2 rounded-xl hover:bg-purple-50/50 transition-all border border-transparent hover:border-purple-100/50">
                                    <span className="font-bold text-black tracking-tight group-hover:translate-x-1 transition-transform">{tier.name}</span>
                                    <span className="font-black text-purple-600 bg-white border border-purple-50 px-3 py-1 rounded-lg text-xs shadow-sm">{tier.price}</span>
                                  </div>
                                ))}
                              </div>
                           </div>
                        </div>
                    </div>
                 </div>
              </div>
            </div>
          </div>
        </section>

        {/* News & Updates Section */}
        <NewsSection lang={lang} content={mergedT.news} />

        {/* Donation Section */}
        <section className="py-32 px-6">
          <div className="container mx-auto max-w-5xl">
            <div className="text-center space-y-4 mb-20">
              <h2 className="text-sm font-black text-[#ED1C24] uppercase tracking-[0.3em]">{mergedT.donation.badge}</h2>
              <h3 className={`${lang === 'en' ? 'text-5xl md:text-7xl' : 'text-4xl md:text-6xl'} font-black text-black tracking-tighter`}>{mergedT.donation.title}</h3>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
               {mergedT.donation.tiers.map((tier, i) => (
                 <motion.div 
                    key={i} 
                    whileHover={{ y: -10 }}
                    className={`relative bg-white border border-gray-100 p-10 rounded-[40px] shadow-sm hover:shadow-2xl transition-all duration-500 group overflow-hidden`}
                 >
                    {/* Decorative Background Pattern */}
                    <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full blur-3xl opacity-20 transition-transform duration-500 group-hover:scale-150" 
                         style={{ backgroundColor: i === 0 ? "#ED1C24" : i === 1 ? "#0EA5E9" : "#991B1B" }} />
                    
                    {(i === 1 || i === 2) && <FallingDroplets color={i === 1 ? "#0EA5E9" : "#991B1B"} />}
                    
                    <div className="relative z-10">
                      <div className={`h-16 w-16 mb-8 rounded-2xl flex items-center justify-center transition-transform duration-500 group-hover:rotate-12 ${i === 0 ? 'bg-red-50 text-[#ED1C24]' : i === 1 ? 'bg-blue-50 text-sky-500' : 'bg-rose-50 text-rose-800'}`}>
                        {i === 0 ? <Plus className="h-8 w-8" /> : i === 1 ? <Droplets className="h-8 w-8" /> : <Heart className="h-8 w-8" />}
                      </div>
                      
                      <div className="text-xs font-black text-black/40 uppercase tracking-[0.2em] mb-2">{tier.label}</div>
                      <div className="text-5xl font-black text-black mb-4 flex items-baseline gap-2">
                        <span className="text-xl">ETB</span> {tier.amount}
                      </div>
                      <p className="text-black/60 font-medium leading-relaxed mb-10">
                        {tier.desc}
                      </p>
                      <Button 
                        onClick={() => setIsDonationModalOpen(true)}
                        className="w-full h-16 rounded-2xl font-black transition-all duration-300 shadow-lg border-2 bg-white hover:bg-[#ED1C24] hover:text-white"
                        style={{ 
                          borderColor: i === 0 ? "#ED1C24" : i === 1 ? "#0EA5E9" : "#991B1B",
                          color: i === 0 ? "#ED1C24" : i === 1 ? "#0EA5E9" : "#991B1B"
                        }}
                      >
                        {mergedT.donation.selectGift}
                      </Button>
                    </div>
                 </motion.div>
               ))}
            </div>

            <div className="mt-12 p-10 bg-black rounded-[40px] text-white flex flex-col md:flex-row items-center justify-between gap-8">
               <div className="space-y-2">
                 <div className="text-2xl font-black">{mergedT.donation.customTitle}</div>
                 <p className="text-white/60 font-medium">{mergedT.donation.customDesc}</p>
               </div>
               <Button 
                  onClick={() => setIsDonationModalOpen(true)}
                  className="bg-[#ED1C24] hover:bg-white hover:text-[#ED1C24] text-white rounded-xl h-14 px-10 font-bold transition-all"
                >
                  {mergedT.donation.customCta}
                </Button>
            </div>
          </div>
        </section>


        {/* Voluntary Services Section */}
        <section className="py-16 px-6 overflow-hidden">
          <div className="container mx-auto">
             <div className="relative bg-black rounded-[48px] overflow-hidden p-12 md:p-20 group border-2 border-[#ED1C24]">
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-[40%] h-full bg-white hidden md:block" 
                     style={{ clipPath: 'polygon(25% 0, 100% 0, 100% 100%, 0% 100%)' }} />
                <div className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none" 
                     style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
                
                <Plus className="absolute top-10 right-20 h-20 w-20 text-black/5 rotate-12 hidden md:block" strokeWidth={4} />
                
                <div className="max-w-3xl space-y-10 relative z-10">
                   <div className="space-y-4">
                      <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-none">
                        {mergedT.volunteerSection.title}
                      </h2>
                      <div className="h-1.5 w-20 bg-[#ED1C24] rounded-full" />
                   </div>
                   <p className="text-xl text-white/70 leading-relaxed font-medium whitespace-pre-wrap">
                      {mergedT.volunteerSection.content}
                   </p>
                   <div className="pt-6">
                      <p className="text-2xl md:text-3xl font-black text-white tracking-tight uppercase">
                        {mergedT.volunteerSection.cta}
                      </p>
                   </div>
                </div>
             </div>
          </div>
        </section>

        {/* Programs & Impact Section */}
        <section className="py-24 px-6 bg-gray-50/50">
          <div className="container mx-auto">
            <div className="max-w-4xl mx-auto space-y-16">
              <div className="space-y-6 text-center">
                 <h2 className="text-4xl md:text-5xl font-black text-black tracking-tighter">{mergedT.programsSection.title}</h2>
                 <div className="h-1.5 w-24 bg-[#ED1C24] mx-auto rounded-full" />
                 <p className="text-xl text-gray-600 leading-relaxed font-medium whitespace-pre-wrap">
                   {mergedT.programsSection.content}
                 </p>
                 <div className="flex flex-wrap justify-center gap-4 pt-4">
                    {mergedT.programsSection.sources.map(source => (
                      <div key={source} className="bg-white px-6 py-3 rounded-2xl shadow-sm border border-gray-100 font-black text-sm uppercase tracking-widest text-[#ED1C24]">
                        {source}
                      </div>
                    ))}
                 </div>
              </div>

              <div className="grid md:grid-cols-2 gap-12 items-stretch">
                 <div className="bg-white p-10 rounded-[40px] shadow-xl border border-gray-100 flex flex-col h-full transition-all hover:shadow-2xl hover:-translate-y-1">
                    <div className="h-14 w-14 bg-red-50 text-[#ED1C24] rounded-2xl flex items-center justify-center font-black text-2xl mb-6">01</div>
                    <h3 className="text-2xl font-black text-black mb-4">{mergedT.programsSection.membershipTitle}</h3>
                    <p className="text-gray-500 leading-relaxed font-medium whitespace-pre-wrap text-sm flex-grow mb-8">
                      {mergedT.programsSection.membershipContent}
                    </p>
                    <Link href="/join/member" className="mt-auto">
                      <Button className="w-full h-14 bg-black hover:bg-[#ED1C24] text-white rounded-2xl font-black transition-all flex items-center justify-center gap-2">
                        {mergedT.membership.cta} <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                 </div>
                 <div className="bg-white p-10 rounded-[40px] shadow-xl border border-gray-100 flex flex-col h-full transition-all hover:shadow-2xl hover:-translate-y-1">
                    <div className="h-14 w-14 bg-red-50 text-[#ED1C24] rounded-2xl flex items-center justify-center font-black text-2xl mb-6">02</div>
                    <h3 className="text-2xl font-black text-black mb-4">{mergedT.programsSection.donationTitle}</h3>
                    <p className="text-gray-500 leading-relaxed font-medium whitespace-pre-wrap text-sm flex-grow mb-8">
                      {mergedT.programsSection.donationContent}
                    </p>
                    <div className="space-y-6 mt-auto">
                      <Button 
                        onClick={() => setIsDonationModalOpen(true)}
                        className="w-full h-14 bg-[#ED1C24] hover:bg-black text-white rounded-2xl font-black transition-all flex items-center justify-center gap-2 shadow-lg shadow-red-500/20"
                      >
                        {mergedT.hero.ctaDonate} <MotionHeart className="h-4 w-4" animate="heartbeat" variants={heartVariants} />
                      </Button>
                      <div className="pt-4 border-t border-gray-50 text-center">
                         <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#ED1C24]">{mergedT.programsSection.donationFooter}</p>
                      </div>
                    </div>
                 </div>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action Banner */}
        <section className="px-6 pb-16">
          <div className="container mx-auto">
             <div className="relative bg-[#ED1C24] rounded-[48px] overflow-hidden shadow-[0_40px_100px_-20px_rgba(237,28,36,0.25)] border border-gray-100/10">
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-1/2 h-full bg-black/5 -skew-x-12 translate-x-1/2 pointer-events-none" />
                <Plus className="absolute top-6 left-10 h-16 w-16 text-white/10 rotate-12 pointer-events-none" strokeWidth={4} />
                
                {/* Asymmetrical White Section */}
                <div className="absolute top-0 right-0 w-[42%] h-full bg-white hidden md:block" 
                     style={{ clipPath: 'polygon(15% 0, 100% 0, 100% 100%, 0% 100%)' }} />
                
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between py-10 px-10 md:py-12 md:px-16 gap-10">
                   <div className="md:w-[50%] space-y-6 text-center md:text-left">
                      <div className="space-y-4">
                         <h2 className="text-3xl md:text-5xl font-black text-white leading-[1.1] tracking-tighter">
                            {mergedT.ctaBanner.title}
                         </h2>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                        <Link href="/join">
                           <Button size="lg" className="bg-white hover:bg-black text-[#ED1C24] hover:text-white rounded-2xl h-14 px-8 text-base font-black shadow-2xl transition-all hover:-translate-y-1 active:translate-y-0 flex items-center gap-3">
                              {mergedT.ctaBanner.volunteer} <ChevronRight className="h-5 w-5" />
                           </Button>
                        </Link>
                      </div>
                   </div>

                   <div className="md:w-[40%] flex flex-col items-center justify-center space-y-4">
                      <div className="text-center space-y-4">
                        <Link href="/join/member">
                          <Button size="lg" className="bg-black hover:bg-[#ED1C24] text-white rounded-2xl h-14 px-8 text-base font-black shadow-2xl transition-all hover:-translate-y-1 active:translate-y-0 whitespace-nowrap group relative z-20">
                             {mergedT.ctaBanner.membership} <Plus className="ml-2 h-5 w-5 group-hover:rotate-90 transition-transform duration-500" strokeWidth={4} />
                          </Button>
                        </Link>
                        <div className="space-y-0.5 mt-8">
                          <p className="text-black font-black text-xs uppercase tracking-[0.2em]">
                            {mergedT.ctaBanner.supporter}
                          </p>
                        </div>
                      </div>
                   </div>
                </div>
             </div>
          </div>
        </section>

        {/* Contact Us Section */}
        <section className="py-24 px-6 bg-white" id="contact">
          <div className="container mx-auto">
             <div className="grid lg:grid-cols-2 gap-20 items-start">
                <div className="space-y-12">
                   <div className="space-y-6">
                      <h2 className="text-5xl md:text-6xl font-black text-black tracking-tighter">{mergedT.contactSection.title}</h2>
                      <p className="text-gray-500 text-lg font-medium max-w-md">
                        Have questions or want to collaborate? Reach out to our team using the form or contact details below.
                      </p>
                   </div>

                   <form className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                         <div className="space-y-2">
                           <label className="text-[10px] font-black uppercase tracking-widest text-[#ED1C24] ml-2">Full Name *</label>
                           <Input placeholder="John Doe" className="h-14 rounded-2xl border-gray-100 bg-gray-50/50 focus:bg-white transition-all font-bold px-6 text-black" />
                         </div>
                         <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-[#ED1C24] ml-2">E-mail *</label>
                            <Input placeholder="john@example.com" className="h-14 rounded-2xl border-gray-100 bg-gray-50/50 focus:bg-white transition-all font-bold px-6 text-black" />
                         </div>
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-black uppercase tracking-widest text-[#ED1C24] ml-2">Subject *</label>
                         <Input placeholder="How can we help?" className="h-14 rounded-2xl border-gray-100 bg-gray-50/50 focus:bg-white transition-all font-bold px-6 text-black" />
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-black uppercase tracking-widest text-[#ED1C24] ml-2">Message *</label>
                         <textarea placeholder="Your message here..." className="w-full min-h-[160px] rounded-2xl border border-gray-100 bg-gray-50/50 focus:bg-white transition-all font-bold p-6 text-sm resize-none text-black" />
                      </div>
                      <Button className="w-full h-16 bg-black hover:bg-[#ED1C24] text-white rounded-2xl font-black text-lg shadow-xl shadow-black/5 transition-all">
                        Send Message
                      </Button>
                      <p className="text-center text-[10px] font-bold text-gray-400 uppercase tracking-widest">* Indicate required field</p>
                   </form>
                </div>

                <div className="space-y-16 lg:pt-8 blur-in">
                   <div>
                      <h4 className="text-xs font-black uppercase tracking-[0.3em] text-[#ED1C24] mb-8">Find Us</h4>
                      <div className="grid gap-10">
                         <div className="flex gap-6 group">
                            <div className="h-14 w-14 rounded-2xl bg-red-50 text-[#ED1C24] flex items-center justify-center shrink-0 group-hover:bg-[#ED1C24] group-hover:text-white transition-all duration-500">
                               <MapPin className="h-6 w-6" />
                            </div>
                            <div className="space-y-1.5">
                               <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Location Address</p>
                               <p className="text-lg font-black text-black leading-tight underline decoration-[#ED1C24]/20 underline-offset-4">{mergedT.contactSection.address}</p>
                            </div>
                         </div>

                         <div className="flex gap-6 group">
                            <div className="h-14 w-14 rounded-2xl bg-red-50 text-[#ED1C24] flex items-center justify-center shrink-0 group-hover:bg-[#ED1C24] group-hover:text-white transition-all duration-500">
                               <Mail className="h-6 w-6" />
                            </div>
                            <div className="space-y-1.5">
                               <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Email</p>
                               <p className="text-lg font-black text-black break-all leading-tight">{mergedT.contactSection.email}</p>
                            </div>
                         </div>

                         <div className="grid md:grid-cols-2 gap-10">
                            <div className="flex gap-6 group">
                               <div className="h-14 w-14 rounded-2xl bg-red-50 text-[#ED1C24] flex items-center justify-center shrink-0 group-hover:bg-[#ED1C24] group-hover:text-white transition-all duration-500">
                                  <Phone className="h-6 w-6" />
                               </div>
                               <div className="space-y-1.5">
                                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Tel</p>
                                  <p className="text-lg font-black text-black leading-tight whitespace-pre-line">{mergedT.contactSection.tel}</p>
                               </div>
                            </div>
                            <div className="flex gap-6 group">
                               <div className="h-14 w-14 rounded-2xl bg-red-50 text-[#ED1C24] flex items-center justify-center shrink-0 group-hover:bg-[#ED1C24] group-hover:text-white transition-all duration-500">
                                  <Phone className="h-6 w-6" />
                               </div>
                               <div className="space-y-1.5">
                                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Mobile</p>
                                  <p className="text-lg font-black text-black leading-tight whitespace-pre-line">{mergedT.contactSection.mobile}</p>
                               </div>
                            </div>
                         </div>

                         <div className="flex gap-6 group">
                            <div className="h-14 w-14 rounded-2xl bg-red-50 text-[#ED1C24] flex items-center justify-center shrink-0 group-hover:bg-[#ED1C24] group-hover:text-white transition-all duration-500">
                               <Plus className="h-6 w-6" />
                            </div>
                            <div className="space-y-1.5">
                               <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Fax</p>
                               <p className="text-lg font-black text-black leading-tight">{mergedT.contactSection.fax}</p>
                            </div>
                         </div>
                      </div>
                   </div>
                </div>
             </div>
          </div>
        </section>
      </main>

      {/* Refined Footer */}
      <footer className="bg-gray-950 text-white pt-32 relative overflow-hidden">
        {/* Subtle Map Grid Overlay */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
             style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        
        <div className="container mx-auto px-6 relative z-10 mb-24">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16">
            <div className="space-y-8">
              <div className="flex items-center gap-3">
                <div className="bg-white p-1 rounded-lg">
                  <Image src="/logo.png" alt="ERCS Logo" width={80} height={80} className="object-contain" unoptimized />
                </div>
                <div className="flex flex-col">
                  <span className="text-2xl font-black tracking-tighter uppercase leading-none">ERCS</span>
                  <span className="text-[10px] font-black text-[#ED1C24] uppercase tracking-[0.2em]">Ethiopia</span>
                </div>
              </div>
              <p className="text-gray-400 text-lg leading-relaxed font-medium">
                {mergedT.footer.desc}
              </p>
              <div className="flex gap-4">
                {[Facebook, Twitter, Instagram, Linkedin].map((Icon, idx) => (
                  <Link key={idx} href="#" className="h-10 w-10 rounded-full bg-gray-900 flex items-center justify-center border border-gray-800 hover:bg-[#ED1C24] hover:border-[#ED1C24] transition-all duration-300 group">
                    <Icon className="h-5 w-5 text-gray-400 group-hover:text-white transition-colors" />
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <h5 className="text-xs font-black uppercase tracking-[0.3em] text-[#ED1C24] mb-10">{mergedT.footer.mission}</h5>
              <ul className="space-y-4 font-bold">
                {["Emergency Response", "Health & Wellness", "Clean Water (WASH)", "Community Growth", "Blood Donation"].map(u => (
                  <li key={u}><Link href="#" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 group">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#ED1C24] opacity-0 group-hover:opacity-100 transition-opacity" />
                    {u}
                  </Link></li>
                ))}
              </ul>
            </div>

            <div>
              <h5 className="text-xs font-black uppercase tracking-[0.3em] text-[#ED1C24] mb-10">{mergedT.footer.involved}</h5>
              <ul className="space-y-4 font-bold">
                {["Join as Volunteer", "Life Membership", "Corporate Giving", "Media Center", "Career Portal"].map(u => (
                  <li key={u}><Link href="#" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 group">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#ED1C24] opacity-0 group-hover:opacity-100 transition-opacity" />
                    {u}
                  </Link></li>
                ))}
              </ul>
            </div>

            <div className="space-y-10">
              <div>
                <h5 className="text-xs font-black uppercase tracking-[0.3em] text-[#ED1C24] mb-8">{mergedT.footer.location}</h5>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-xl bg-gray-900 border border-gray-800 flex items-center justify-center shrink-0">
                      <MapPin className="h-6 w-6 text-[#ED1C24]" />
                    </div>
                    <div className="text-gray-400 font-bold leading-snug">
                      Ras Desta Damtew Ave, <br />
                      Addis Ababa, Ethiopia
                    </div>
                  </div>
                  
                  {/* Interactive Map Embed */}
                  <div className="relative w-full h-48 rounded-2xl overflow-hidden border border-gray-800 group">
                    <iframe 
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3940.50972230733!2d38.7562883!3d9.0171633!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x164b8593cc18e53d%3A0x6a05953051412035!2sEthiopian%20Red%20Cross%20Society!5e0!3m2!1sen!2set!4v1700000000000!5m2!1sen!2set" 
                      width="100%" 
                      height="100%" 
                      style={{ border: 0, filter: 'grayscale(1) invert(0.9) contrast(1.2) brightness(0.8)' }} 
                      allowFullScreen 
                      loading="lazy" 
                      referrerPolicy="no-referrer-when-downgrade"
                      className="transition-all duration-700 group-hover:filter-none opacity-60 group-hover:opacity-100"
                    />
                    <div className="absolute inset-0 pointer-events-none ring-1 ring-inset ring-white/10 rounded-2xl" />
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-gray-900 border border-gray-800 flex items-center justify-center shrink-0">
                      <Phone className="h-6 w-6 text-[#ED1C24]" />
                    </div>
                    <div className="text-gray-400 font-bold">+251 11 515 3820</div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-gray-900 border border-gray-800 flex items-center justify-center shrink-0">
                      <Mail className="h-6 w-6 text-[#ED1C24]" />
                    </div>
                    <div className="text-gray-400 font-bold hover:text-white transition-colors">info@redcrosseth.org</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright Section - White Background */}
        <div className="bg-white py-6 px-6 relative z-10 border-t border-gray-50">
          <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="text-gray-500 text-sm font-bold uppercase tracking-widest text-center md:text-left">
              © {new Date().getFullYear()} Ethiopian Red Cross Society. <br className="md:hidden" />
              <span className="hidden md:inline"> · </span> {mergedT.footer.rights}
            </div>
            <div className="flex gap-10 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
               <Link href="#" className="hover:text-[#ED1C24] transition-colors">Privacy</Link>
               <Link href="#" className="hover:text-[#ED1C24] transition-colors">Terms</Link>
               <Link href="#" className="hover:text-[#ED1C24] transition-colors">Cookies</Link>
            </div>
          </div>
        </div>
      </footer>
       {/* Welcome Pathway Modal - Moved to end for stacking priority */}
       <WelcomeModal lang={lang} />
    </div>
  );
}
