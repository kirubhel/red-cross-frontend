import Link from 'next/link';
import { Home, ShieldCheck, HeartPulse, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 w-full h-1/2 bg-gradient-to-b from-red-50 to-transparent -z-10" />
      <div className="absolute -top-48 -left-48 w-96 h-96 bg-red-100 rounded-full blur-3xl opacity-50 -z-10" />
      <div className="absolute top-1/2 -right-48 w-96 h-96 bg-red-50 rounded-full blur-3xl opacity-50 -z-10" />

      <div className="max-w-lg w-full bg-white border border-slate-100 rounded-3xl shadow-2xl p-8 md:p-12 text-center relative z-10">
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-red-100 rounded-full animate-ping opacity-25"></div>
            <div className="h-24 w-24 bg-red-50 rounded-full flex items-center justify-center relative border border-red-100">
              <span className="text-red-500 font-bold text-4xl">404</span>
            </div>
          </div>
        </div>
        
        <h1 className="text-3xl font-bold text-slate-900 mb-3 tracking-tight">Destination Unknown</h1>
        
        <p className="text-slate-500 mb-8 leading-relaxed text-sm md:text-base">
          The humanitarian mission you are looking for cannot be found. The page might have been moved or no longer exists in our registry.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
          <Button asChild size="lg" className="w-full bg-ercs-red hover:bg-red-700 text-white shadow-md font-medium group transition-all">
            <Link href="/">
              <Home className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
              Homepage
            </Link>
          </Button>
          
          <Button asChild variant="outline" size="lg" className="w-full font-medium group border-slate-200 hover:bg-slate-50 hover:text-slate-900 transition-all">
            <Link href="/login">
              <ShieldCheck className="mr-2 h-4 w-4 transition-transform group-hover:scale-110 text-slate-500" />
              System Login
            </Link>
          </Button>
        </div>

        <div className="pt-6 border-t border-slate-100">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">Quick Links</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/join/member" className="text-sm font-medium text-slate-600 hover:text-ercs-red transition-colors flex items-center gap-1.5">
              <UserPlus className="h-3.5 w-3.5" /> Join as Member
            </Link>
            <span className="hidden sm:block text-slate-300">•</span>
            <Link href="/join/volunteer" className="text-sm font-medium text-slate-600 hover:text-ercs-red transition-colors flex items-center gap-1.5">
              <HeartPulse className="h-3.5 w-3.5" /> Become a Volunteer
            </Link>
          </div>
        </div>
      </div>

      {/* Footer text */}
      <div className="mt-12 text-sm text-slate-400 font-medium tracking-wide">
        &copy; {new Date().getFullYear()} Ethiopian Red Cross Society
      </div>
    </div>
  );
}
