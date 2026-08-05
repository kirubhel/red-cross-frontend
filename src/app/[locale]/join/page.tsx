"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Heart, Users, ChevronRight, ShieldCheck, Sparkles } from "lucide-react";

import Header from "@/components/layout/Header";

export default function JoinSelectionPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col selection:bg-ercs-red selection:text-white">
      <Header minimal={true} />

      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 pb-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-2xl mb-10 space-y-3"
        >
          <h1 className="text-3xl md:text-5xl font-black text-black tracking-tighter">
            Choose Your <span className="text-ercs-red italic">Impact</span>.
          </h1>
          <p className="text-lg text-black/60 font-medium">
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
            <div className="relative bg-white border-2 border-gray-100 p-6 rounded-3xl hover:border-ercs-red transition-all duration-500 flex flex-col h-full shadow-sm hover:shadow-2xl">
              <div className="h-12 w-12 bg-ercs-light text-ercs-red rounded-xl flex items-center justify-center mb-4 rotate-3 group-hover:rotate-6 transition-transform">
                <Heart className="h-6 w-6 fill-ercs-red" />
              </div>
              <h2 className="text-xl font-black text-black mb-2">Become a Volunteer</h2>
              <p className="text-black/60 font-medium mb-6 leading-relaxed flex-1 text-xs">
                Be on the front lines of humanitarian service. Use your skills for emergency response, community health, and disaster relief.
              </p>
              
              <ul className="space-y-2 mb-6">
                 {[ "Front-line Emergency Response", "Community Health Programs", "Skills-based Volunteering" ].map(item => (
                    <li key={item} className="flex items-center gap-2 text-[11px] font-bold text-black/80">
                      <Sparkles className="h-3 w-3 text-ercs-red" /> {item}
                    </li>
                 ))}
              </ul>

              <Link href="/join/volunteer">
                <Button className="w-full h-12 bg-[#ED1C24] hover:bg-black text-white rounded-lg font-black text-sm gap-2 shadow-lg shadow-[#ED1C24]/20 transition-all hover:translate-y-[-2px] cursor-pointer">
                  Join as Volunteer <ChevronRight className="h-3.5 w-3.5" />
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
            <div className="relative bg-white border-2 border-gray-100 p-6 rounded-3xl hover:border-black transition-all duration-500 flex flex-col h-full shadow-sm hover:shadow-2xl">
              <div className="h-12 w-12 bg-gray-100 text-black rounded-xl flex items-center justify-center mb-4 -rotate-3 group-hover:-rotate-6 transition-transform">
                <Users className="h-6 w-6" />
              </div>
              <h2 className="text-xl font-black text-black mb-2">Become a Member</h2>
              <p className="text-black/60 font-medium mb-6 leading-relaxed flex-1 text-xs">
                Empower the movement through sustainable support. Gain voting rights and help shape the future of ERCS.
              </p>

              <ul className="space-y-2 mb-6">
                 {[ "Voting & Decision Rights", "Sustainable Financial Impact", "Exclusive Member Portal" ].map(item => (
                    <li key={item} className="flex items-center gap-2 text-[11px] font-bold text-black/80">
                      <ShieldCheck className="h-3 w-3 text-black" /> {item}
                    </li>
                 ))}
              </ul>

              <Link href="/join/member">
                <Button className="w-full h-12 bg-black hover:bg-[#ED1C24] text-white rounded-lg font-black text-sm gap-2 shadow-lg shadow-black/20 transition-all hover:translate-y-[-2px] cursor-pointer">
                  Join as Member <ChevronRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
