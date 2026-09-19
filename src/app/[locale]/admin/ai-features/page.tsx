"use client";

export const dynamic = 'force-dynamic';

import { useState } from "react";
import { motion, Variants } from "framer-motion";
import { 
  Users, 
  LineChart, 
  Search, 
  ShieldAlert, 
  MessageSquareText, 
  FileText,
  Sparkles,
  ArrowRight,
  X,
  CheckCircle2,
  Send,
  Zap,
  Bot
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

const features = [
  {
    id: "volunteer-matching",
    title: "Smart Volunteer Matching",
    description: "Automatically match volunteers to emergencies based on skills, location, availability, and previous activity.",
    example: '"Assign medical volunteers near flood areas automatically."',
    benefit: "Faster coordination • Less manual work • Better resource allocation",
    icon: Users,
    color: "from-blue-500 to-cyan-400",
    bgLight: "bg-blue-50",
    href: "/admin/volunteers",
    status: "Phase 2 Pipeline"
  },
  {
    id: "analytics-dashboard",
    title: "AI Analytics Dashboard",
    description: "Predictive analytics for volunteer activity, regional participation, emergency response trends, and branch performance.",
    example: "View engagement trends & forecast emergency hotspots.",
    benefit: "Data-driven decisions • Operational insights • Better planning",
    icon: LineChart,
    color: "from-indigo-500 to-purple-400",
    bgLight: "bg-indigo-50",
    href: "/admin/reports",
    status: "Beta Ready"
  },
  {
    id: "search-system",
    title: "Intelligent Search System",
    description: "Natural Language Processing (NLP) search that converts conversational queries into complex database queries.",
    example: '"Show active volunteers in Addis with medical skills."',
    benefit: "Faster data access • Easier admin workflow • Better usability",
    icon: Search,
    color: "from-emerald-500 to-teal-400",
    bgLight: "bg-emerald-50",
    href: "/admin/members",
    status: "Prototype Available"
  },
  {
    id: "fraud-detection",
    title: "Fraud & Suspicious Activity Detection",
    description: "Machine Learning models that flag fake registrations, duplicate accounts, and abnormal login behaviors instantly.",
    example: "Alert: 'Suspicious login attempt from unauthorized region.'",
    benefit: "Stronger security • Reduced abuse • Safer database",
    icon: ShieldAlert,
    color: "from-red-500 to-rose-400",
    bgLight: "bg-red-50",
    href: "/admin/active-sessions",
    status: "Live Integration Ready"
  },
  {
    id: "chat-assistant",
    title: "AI Chat Assistant for Admins",
    description: "An integrated chatbot that helps admins generate reports, answer system questions, and summarize statistics.",
    example: '"What is the volunteer growth rate this month?"',
    benefit: "Instant answers • Automated guidance • Increased productivity",
    icon: MessageSquareText,
    color: "from-amber-500 to-orange-400",
    bgLight: "bg-amber-50",
    href: "/admin/messages",
    status: "Sandbox Ready"
  },
  {
    id: "report-gen",
    title: "Automatic Report Generation",
    description: "AI-generated monthly reports, branch summaries, volunteer performance metrics, and emergency activity summaries.",
    example: "Click to generate a comprehensive 10-page regional report.",
    benefit: "Time savings • Standardized reporting • Error-free data",
    icon: FileText,
    color: "from-pink-500 to-rose-400",
    bgLight: "bg-pink-50",
    href: "/admin/reports",
    status: "Export Engine Connected"
  }
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 24 }
  }
};

export default function AiFeaturesPage() {
  const { lang } = useLanguage();
  const [selectedFeature, setSelectedFeature] = useState<typeof features[0] | null>(null);
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [promptInput, setPromptInput] = useState("");
  const [promptOutput, setPromptOutput] = useState<string | null>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [isSubmittingPlan, setIsSubmittingPlan] = useState(false);

  const handleOpenFeature = (feat: typeof features[0]) => {
    setSelectedFeature(feat);
    setPromptInput(feat.example.replace(/^"|"$/g, ''));
    setPromptOutput(null);
  };

  const handleRunSimulatedPrompt = () => {
    if (!promptInput.trim()) return;
    setIsEvaluating(true);
    setPromptOutput(null);
    setTimeout(() => {
      setIsEvaluating(false);
      setPromptOutput(`[AI Engine Demo Output]: Synthesized query for "${promptInput}". 18 matches identified across ERCS registry. Model confidence: 96.4%.`);
      toast.success("Simulation completed successfully!");
    }, 700);
  };

  const handleSubmitPlanRequest = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingPlan(true);
    setTimeout(() => {
      setIsSubmittingPlan(false);
      setIsPlanModalOpen(false);
      toast.success("Implementation Plan Requested!", {
        description: "ERCS Technical Architecture team will prepare deployment specifications."
      });
    }, 600);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 relative">
        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-purple-100 to-indigo-100 text-indigo-700 rounded-full text-[10px] font-black uppercase tracking-widest leading-none mb-2 shadow-inner">
            <Sparkles className="h-3.5 w-3.5" /> Next-Gen Capabilities
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-black tracking-tighter">
            AI Ecosystem
          </h1>
          <p className="text-gray-500 font-medium text-sm max-w-2xl mt-2 leading-relaxed">
            Discover the artificial intelligence features recommended to supercharge the ERCS portal. From smart volunteer matching to autonomous fraud detection, these tools transform raw data into operational power.
          </p>
        </div>
      </div>

      {/* Grid Section */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
      >
        {features.map((feature, idx) => (
          <motion.div
            key={idx}
            variants={itemVariants}
            onClick={() => handleOpenFeature(feature)}
            className="group relative bg-white rounded-[32px] p-8 border border-gray-100 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_50px_-10px_rgba(0,0,0,0.08)] transition-all duration-300 overflow-hidden flex flex-col h-full cursor-pointer hover:border-gray-200"
          >
            {/* Background Glow */}
            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${feature.color} opacity-[0.03] group-hover:opacity-[0.08] blur-2xl rounded-full -mr-10 -mt-10 transition-opacity duration-500 pointer-events-none`} />

            <div className="flex items-center gap-4 mb-6">
              <div className={`h-14 w-14 rounded-2xl ${feature.bgLight} flex items-center justify-center shrink-0 shadow-inner group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className={`h-7 w-7 text-gray-800`} />
              </div>
              <div>
                <h3 className="text-lg font-black tracking-tight text-gray-900 leading-tight">
                  {feature.title}
                </h3>
                <span className="inline-block mt-1 text-[9px] font-bold text-gray-400 uppercase tracking-wider">
                  {feature.status}
                </span>
              </div>
            </div>

            <p className="text-gray-500 text-sm font-medium mb-6 leading-relaxed flex-1">
              {feature.description}
            </p>

            <div className="space-y-4 mt-auto">
              {/* Example Block */}
              <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 relative overflow-hidden group-hover:bg-gray-100/50 transition-colors">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b opacity-50 group-hover:opacity-100 transition-opacity duration-300 rounded-l-2xl" />
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">Example Prompt</p>
                <p className="text-sm font-semibold text-gray-900 italic">
                  {feature.example}
                </p>
              </div>

              {/* Benefit Block */}
              <div>
                <p className="text-[10px] font-black text-[#ED1C24] uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                  <Sparkles className="h-3 w-3" /> Backend Benefit
                </p>
                <p className="text-xs font-bold text-gray-500 flex flex-wrap gap-x-2 gap-y-1">
                  {feature.benefit.split(' • ').map((b, i) => (
                    <span key={i} className="inline-flex items-center gap-1">
                      <span className="h-1 w-1 rounded-full bg-gray-300" /> {b}
                    </span>
                  ))}
                </p>
              </div>
            </div>

            {/* Hover Action */}
            <div className="absolute top-8 right-8 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
              <button 
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleOpenFeature(feature);
                }}
                className="h-9 w-9 rounded-full bg-black hover:bg-[#ED1C24] flex items-center justify-center text-white shadow-lg transition-colors"
                title={`Configure ${feature.title}`}
              >
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* CTA Section */}
      <motion.div 
        variants={itemVariants}
        initial="hidden"
        animate="visible"
        className="mt-12 bg-gradient-to-br from-gray-900 to-black rounded-[40px] p-10 md:p-14 relative overflow-hidden text-center flex flex-col items-center shadow-2xl"
      >
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />
        <Sparkles className="h-10 w-10 text-white/50 mb-6 relative z-10" />
        <h2 className="text-3xl md:text-4xl font-black text-white tracking-tighter mb-4 relative z-10">
          Ready to activate AI?
        </h2>
        <p className="text-gray-400 text-sm font-medium max-w-xl mx-auto mb-8 relative z-10">
          Implementing these features requires integrating advanced NLP engines and vector databases. Our architecture is already primed for microservice expansion.
        </p>
        <Button 
          onClick={() => setIsPlanModalOpen(true)}
          className="h-14 px-8 rounded-2xl bg-white text-black hover:bg-gray-100 hover:scale-105 active:scale-95 transition-all shadow-xl font-black uppercase tracking-widest text-xs relative z-10 flex items-center gap-2"
        >
          Request Implementation Plan <ArrowRight className="h-4 w-4" />
        </Button>
      </motion.div>

      {/* Feature Preview & Test Modal */}
      {selectedFeature && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-2xl rounded-3xl p-6 shadow-2xl border border-gray-100 space-y-6 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-2xl ${selectedFeature.bgLight}`}>
                  <selectedFeature.icon className="h-6 w-6 text-gray-900" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-gray-900">{selectedFeature.title}</h3>
                  <span className="text-xs font-bold text-gray-400 uppercase">{selectedFeature.status}</span>
                </div>
              </div>
              <button 
                onClick={() => setSelectedFeature(null)} 
                className="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-black transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <p className="text-sm text-gray-600 font-medium leading-relaxed">
              {selectedFeature.description}
            </p>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-wider text-gray-700 flex items-center gap-2">
                <Bot className="h-4 w-4 text-purple-600" /> Test Simulated Query
              </label>
              <div className="flex gap-2">
                <Input
                  value={promptInput}
                  onChange={(e) => setPromptInput(e.target.value)}
                  placeholder="Enter a conversational query or rule..."
                  className="rounded-xl text-sm"
                />
                <Button 
                  onClick={handleRunSimulatedPrompt}
                  disabled={isEvaluating}
                  className="bg-black hover:bg-gray-800 text-white rounded-xl px-5 text-xs font-black shrink-0"
                >
                  {isEvaluating ? "Processing..." : "Run Demo"}
                </Button>
              </div>
              {promptOutput && (
                <div className="p-4 bg-purple-50/60 border border-purple-100 rounded-2xl text-xs font-mono text-purple-900 leading-relaxed mt-3">
                  {promptOutput}
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
              <Link
                href={`/${lang}${selectedFeature.href}`}
                className="inline-flex items-center gap-2 text-xs font-black text-[#ED1C24] hover:underline"
              >
                Open Connected Module <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <Button 
                onClick={() => setSelectedFeature(null)}
                variant="outline"
                className="rounded-xl text-xs font-bold px-5"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Request Implementation Plan Modal */}
      {isPlanModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-xl rounded-3xl p-6 sm:p-8 shadow-2xl border border-gray-100 space-y-6 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-red-50 text-[#ED1C24]">
                  <Sparkles className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-gray-900">Request AI Implementation Plan</h3>
                  <p className="text-xs text-gray-400 font-medium">ERCS Microservices Technical Roadmap</p>
                </div>
              </div>
              <button 
                onClick={() => setIsPlanModalOpen(false)} 
                className="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-black transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitPlanRequest} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase tracking-wider text-gray-700">Target Region / Directorate</label>
                <Input defaultValue="ERCS National Headquarters (Addis Ababa)" required className="rounded-xl text-xs font-medium" />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase tracking-wider text-gray-700">Deployment Timeline Target</label>
                <select className="w-full h-10 px-3 border border-gray-200 rounded-xl text-xs font-medium bg-white outline-none focus:ring-2 focus:ring-red-500">
                  <option>Q1 2027 (Immediate Pilot)</option>
                  <option>Q2 2027 (Nationwide Rollout)</option>
                  <option>Q3 2027 (Advanced Machine Learning Models)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase tracking-wider text-gray-700">Requested Capabilities</label>
                <div className="grid grid-cols-2 gap-2 text-xs text-gray-700">
                  <label className="flex items-center gap-2 p-2 rounded-lg bg-gray-50 border border-gray-100 cursor-pointer">
                    <input type="checkbox" defaultChecked className="accent-red-600 rounded" />
                    <span>Volunteer Matching</span>
                  </label>
                  <label className="flex items-center gap-2 p-2 rounded-lg bg-gray-50 border border-gray-100 cursor-pointer">
                    <input type="checkbox" defaultChecked className="accent-red-600 rounded" />
                    <span>Predictive Analytics</span>
                  </label>
                  <label className="flex items-center gap-2 p-2 rounded-lg bg-gray-50 border border-gray-100 cursor-pointer">
                    <input type="checkbox" defaultChecked className="accent-red-600 rounded" />
                    <span>Fraud Detection</span>
                  </label>
                  <label className="flex items-center gap-2 p-2 rounded-lg bg-gray-50 border border-gray-100 cursor-pointer">
                    <input type="checkbox" defaultChecked className="accent-red-600 rounded" />
                    <span>Admin NLP Assistant</span>
                  </label>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase tracking-wider text-gray-700">Project Notes & Infrastructure Requirements</label>
                <textarea 
                  rows={3} 
                  placeholder="Provide any specific requirements, existing server infrastructure, or integration constraints..."
                  className="w-full p-3 border border-gray-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-red-500" 
                />
              </div>

              <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsPlanModalOpen(false)}
                  className="rounded-xl text-xs font-bold px-5"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={isSubmittingPlan}
                  className="bg-[#ED1C24] hover:bg-black text-white rounded-xl text-xs font-black px-6 shadow-md shadow-red-500/20"
                >
                  {isSubmittingPlan ? "Submitting..." : "Submit Request"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
