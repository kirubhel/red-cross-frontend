"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Heart, Users, ChevronRight, ShieldCheck, Sparkles } from "lucide-react";

export default function JoinSelectionPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col selection:bg-ercs-red selection:text-white">
      {/* Decorative background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[20%] left-[-5%] w-[30%] h-[30%] bg-ercs-red/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-[20%] right-[-5%] w-[30%] h-[30%] bg-blue-500/5 rounded-full blur-[100px]" />
      </div>

      <header className="relative z-10 px-8 py-6">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-ercs-red transition-colors group">
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" /> 
          Back to Home
        </Link>
      </header>

      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 pb-20">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-2xl mb-16 space-y-4"
        >
          <h1 className="text-5xl md:text-7xl font-black text-black tracking-tighter">
            Choose Your <span className="text-ercs-red italic">Impact</span>.
          </h1>
          <p className="text-xl text-black/60 font-medium">
            Join the most significant humanitarian network in Ethiopia and start making a difference today.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl w-full">
          {/* Volunteer Option */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="group relative"
          >
            <div className="absolute inset-0 bg-ercs-red/10 rounded-[40px] translate-y-4 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative bg-white border-2 border-gray-100 p-10 rounded-[40px] hover:border-ercs-red transition-all duration-500 flex flex-col h-full shadow-sm hover:shadow-2xl">
              <div className="h-20 w-20 bg-ercs-light text-ercs-red rounded-3xl flex items-center justify-center mb-10 rotate-3 group-hover:rotate-6 transition-transform">
                <Heart className="h-10 w-10 fill-ercs-red" />
              </div>
              <h2 className="text-3xl font-black text-black mb-4">Become a Volunteer</h2>
              <p className="text-black/60 font-medium mb-10 leading-relaxed flex-1">
                Be on the front lines of humanitarian service. Use your skills for emergency response, community health, and disaster relief.
              </p>
              
              <ul className="space-y-4 mb-10">
                 {[ "Front-line Emergency Response", "Community Health Programs", "Skills-based Volunteering" ].map(item => (
                   <li key={item} className="flex items-center gap-3 text-sm font-bold text-black/80">
                     <Sparkles className="h-4 w-4 text-ercs-red" /> {item}
                   </li>
                 ))}
              </ul>

              <Link href="/join/volunteer">
                <Button className="w-full h-16 bg-[#ED1C24] hover:bg-black text-white rounded-2xl font-black text-lg gap-2 shadow-xl shadow-[#ED1C24]/20 transition-all hover:translate-y-[-2px] cursor-pointer">
                  Join as Volunteer <ChevronRight className="h-5 w-5" />
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Member Option */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="group relative"
          >
            <div className="absolute inset-0 bg-black/10 rounded-[40px] translate-y-4 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative bg-white border-2 border-gray-100 p-10 rounded-[40px] hover:border-black transition-all duration-500 flex flex-col h-full shadow-sm hover:shadow-2xl">
              <div className="h-20 w-20 bg-gray-100 text-black rounded-3xl flex items-center justify-center mb-10 -rotate-3 group-hover:-rotate-6 transition-transform">
                <Users className="h-10 w-10" />
              </div>
              <h2 className="text-3xl font-black text-black mb-4">Become a Member</h2>
              <p className="text-black/60 font-medium mb-10 leading-relaxed flex-1">
                Empower the movement through sustainable support. Gain voting rights and help shape the future of ERCS.
              </p>

              <ul className="space-y-4 mb-10">
                 {[ "Voting & Decision Rights", "Sustainable Financial Impact", "Exclusive Member Portal" ].map(item => (
                   <li key={item} className="flex items-center gap-3 text-sm font-bold text-black/80">
                     <ShieldCheck className="h-4 w-4 text-black" /> {item}
                   </li>
                 ))}
              </ul>

              <Link href="/join/member">
                <Button className="w-full h-16 bg-black hover:bg-[#ED1C24] text-white rounded-2xl font-black text-lg gap-2 shadow-xl shadow-black/20 transition-all hover:translate-y-[-2px] cursor-pointer">
                  Join as Member <ChevronRight className="h-5 w-5" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
