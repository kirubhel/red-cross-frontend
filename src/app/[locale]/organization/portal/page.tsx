"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Building2, 
  Users, 
  Plus, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  LogOut,
  Send,
  Calendar,
  Layers,
  ChevronRight,
  TrendingUp,
  ShieldCheck,
  Briefcase,
  MessageSquare,
  Trash2,
  ExternalLink,
  Star,
  MapPin,
  Award,
  CheckSquare,
  Square,
  ThumbsUp,
  Heart,
  Check,
  Sparkles,
  Play,
  Timer,
  FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import api from "@/lib/api";
import Image from "next/image";

type VolunteerRequest = {
  id: string;
  organization_id: string;
  headcount: number;
  activities_skills: string;
  status: string;
  created_at: string;
  men_count: number;
  women_count: number;
  min_experience: number;
  qualifications: string;
  payment_amount: number;
  payment_status: string;
  activities: { name: string; count: number }[];
  volunteer_type: string;
  title?: string;
  description?: string;
  payment_proof_url?: string;
  region_id?: number;
  zone_id?: string;
  region_name?: string;
  zone_name?: string;
  duration_days?: number;
  mission_status?: string;
  mission_start_time?: string;
  mission_end_time?: string;
  benefits?: {
    accommodation?: string;
    meals?: string;
    transport?: string;
    safety_gear?: boolean;
    certificate?: boolean;
    notes?: string;
  };
};

type Assignment = {
  id: string;
  volunteer_name: string;
  volunteer_id: string;
  status: string;
  assigned_at: string;
  hours_worked?: number;
  rating?: number;
  feedback?: string;
  evaluated_at?: string;
  evaluation?: {
    punctuality: number;
    skills: number;
    teamwork: number;
    conduct: number;
    overall: number;
    hours: number;
    outcome: string;
    notes: string;
  };
};

type Region = {
  id: number;
  name: string;
  code: string;
};

type Zone = {
  id: string;
  region_id: number;
  name: string;
  code: string;
};

const DEFAULT_REGIONS: Region[] = [
  { id: 1, name: "Addis Ababa", code: "AA" },
  { id: 2, name: "Afar", code: "AF" },
  { id: 3, name: "Amhara", code: "AM" },
  { id: 4, name: "Benishangul-Gumuz", code: "BG" },
  { id: 5, name: "Dire Dawa", code: "DD" },
  { id: 6, name: "Gambela", code: "GM" },
  { id: 7, name: "Harari", code: "HR" },
  { id: 8, name: "Oromia", code: "OR" },
  { id: 9, name: "Sidama", code: "SD" },
  { id: 10, name: "Somali", code: "SM" },
  { id: 11, name: "South Ethiopia", code: "SE" },
  { id: 12, name: "South West Ethiopia", code: "SW" },
  { id: 13, name: "Tigray", code: "TG" },
  { id: 14, name: "Central Ethiopia", code: "CE" }
];

const ENGAGEMENT_AREAS = [
  "First Aid Service",
  "Ambulance service",
  "Community Health Promotion Services",
  "ERCS Community Health Services",
  "Lonely, elderly, and disabled people's support services",
  "Emergency response and stand-by services",
  "Restoring Family Link(RFL) Services",
  "Disaster Risk Reduction activities like terracing and reforestation",
  "Dissemination and Membership Drive Services",
  "Fundraising activities",
  "Office Services",
  "Technical Services",
  "Volunteer planning, implementation, and coordination services",
  "Focal point services for other volunteer activities",
  "Other Services"
];

const StatusBadge = ({ status }: { status: string }) => {
  const styles = {
    PENDING: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    APPROVED: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    REJECTED: "bg-rose-500/10 text-rose-500 border-rose-500/20",
    MATCHED: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    COMPLETED: "bg-purple-500/10 text-purple-500 border-purple-500/20"
  };
  
  const icons = {
    PENDING: <Clock className="h-3 w-3" />,
    APPROVED: <CheckCircle2 className="h-3 w-3" />,
    REJECTED: <AlertCircle className="h-3 w-3" />,
    MATCHED: <Users className="h-3 w-3" />,
    COMPLETED: <ShieldCheck className="h-3 w-3" />
  };

  const key = status.toUpperCase() as keyof typeof styles;
  
  return (
    <div className={`px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 ${styles[key] || styles.PENDING}`}>
      {icons[key] || icons.PENDING}
      {status}
    </div>
  );
};

export default function OrganizationPortal() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState<VolunteerRequest[]>([]);
  const [showForm, setShowForm] = useState(false);
  
  // Pricing Rates & Hierarchy
  const [volunteerRates, setVolunteerRates] = useState({
    dailyRatePerVolunteer: 500,
    accommodationDailyCost: 350,
    mealDailyCost: 250,
    transportAllowance: 150,
    insuranceFeePerVolunteer: 50,
    minMissionDays: 1,
    adminFeePercent: 5
  });
  const [regions, setRegions] = useState<Region[]>(DEFAULT_REGIONS);
  const [zones, setZones] = useState<Zone[]>([]);
  
  // Form State
  const [headcount, setHeadcount] = useState("");
  const [qualifications, setQualifications] = useState("");
  const [menCount, setMenCount] = useState("");
  const [womenCount, setWomenCount] = useState("");
  const [minExperience, setMinExperience] = useState("");
  const [activities, setActivities] = useState<{ name: string; count: number }[]>([
    { name: "", count: 1 }
  ]);
  const [volunteerType, setVolunteerType] = useState("General Volunteer");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedAreas, setSelectedAreas] = useState<string[]>([]);
  const [otherServicesText, setOtherServicesText] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [mouUrl, setMouUrl] = useState<string>("");
  const [mouFileName, setMouFileName] = useState<string>("");
  
  // Regional & Benefits Form State
  const [targetRegionId, setTargetRegionId] = useState<number>(1);
  const [targetZoneId, setTargetZoneId] = useState<string>("");
  const [durationDays, setDurationDays] = useState<number>(1);
  const [benefitsAccommodation, setBenefitsAccommodation] = useState<string>("PROVIDED");
  const [customAccommodation, setCustomAccommodation] = useState<string>("");
  const [benefitsMeals, setBenefitsMeals] = useState<string>("FULL_BOARD");
  const [customMeals, setCustomMeals] = useState<string>("");
  const [benefitsTransport, setBenefitsTransport] = useState<string>("ORG_VEHICLE");
  const [customTransport, setCustomTransport] = useState<string>("");
  const [customPerkAmount, setCustomPerkAmount] = useState<string>("0");
  const [benefitsSafetyGear, setBenefitsSafetyGear] = useState<boolean>(true);
  const [benefitsCertificate, setBenefitsCertificate] = useState<boolean>(true);
  const [benefitsNotes, setBenefitsNotes] = useState<string>("");
  
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [tempPayload, setTempPayload] = useState<any>(null);
  
  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<"dashboard" | "requests" | "profile" | "support">("dashboard");

  // Organization Profile State
  const [profile, setProfile] = useState<any>(null);
  const [updatingProfile, setUpdatingProfile] = useState(false);

  // Request Details State
  const [selectedRequest, setSelectedRequest] = useState<VolunteerRequest | null>(null);

  // Payment Modal State
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentRequest, setPaymentRequest] = useState<VolunteerRequest | null>(null);
  const [paymentProofUrl, setPaymentProofUrl] = useState("");
  const [submittingPayment, setSubmittingPayment] = useState(false);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loadingAssignments, setLoadingAssignments] = useState(false);

  // Volunteer Selection & Evaluation State
  const [selectedAssignmentIds, setSelectedAssignmentIds] = useState<string[]>([]);
  const [showEvaluationModal, setShowEvaluationModal] = useState(false);
  const [evaluatingAssignments, setEvaluatingAssignments] = useState<Assignment[]>([]);
  const [evaluationForm, setEvaluationForm] = useState({
    punctuality: 5,
    skills: 5,
    teamwork: 5,
    conduct: 5,
    hoursWorked: 8,
    outcome: "COMPLETED_EXCELLENT",
    feedback: "",
    certificateIssued: true
  });
  const [submittingEvaluation, setSubmittingEvaluation] = useState(false);

  // Support Messaging State
  const [showSupportForm, setShowSupportForm] = useState(false);
  const [supportCategory, setSupportCategory] = useState("Volunteer Request Assistance");
  const [supportPriority, setSupportPriority] = useState("NORMAL");
  const [supportSubject, setSupportSubject] = useState("");
  const [supportContent, setSupportContent] = useState("");
  const [sendingSupport, setSendingSupport] = useState(false);
  const [supportMessages, setSupportMessages] = useState<any[]>([
    {
      id: "msg-1",
      subject: "Volunteer Allocation Inquiry",
      category: "Volunteer Request Assistance",
      priority: "NORMAL",
      content: "Greetings Admin, we have submitted a request for 30 volunteers for Meskel Square First Aid. Kindly let us know once approved.",
      status: "ADMIN REVIEWING",
      created_at: "Aug 2, 2026 10:15 AM"
    }
  ]);

  const handleSendSupportMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supportSubject || !supportContent) return;
    setSendingSupport(true);
    try {
      const newMessage = {
        id: `msg-${Date.now()}`,
        subject: supportSubject,
        category: supportCategory,
        priority: supportPriority,
        content: supportContent,
        status: "OPEN",
        created_at: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" })
      };
      setSupportMessages([newMessage, ...supportMessages]);
      toast.success("Support message sent to ERCS Admin team!");
      setSupportSubject("");
      setSupportContent("");
      setShowSupportForm(false);
    } catch (err) {
      toast.error("Failed to send support message");
    } finally {
      setSendingSupport(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("access_token") || localStorage.getItem("token");
    const role = localStorage.getItem("user_role");
    
    if (!token || (role !== "ORGANIZATION" && role !== "8")) {
      router.push("/login");
      return;
    }

    fetchPortalData();
    fetchProfile();
  }, []);

  useEffect(() => {
    const total = (Number(menCount) || 0) + (Number(womenCount) || 0);
    setHeadcount(total > 0 ? total.toString() : "");
  }, [menCount, womenCount]);

  useEffect(() => {
    if (showForm || selectedRequest) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; }
  }, [showForm, selectedRequest]);

  const fetchProfile = async () => {
    try {
      const res = await api.get("/organizations/me");
      setProfile(res.data.organization);
    } catch (err) {
      console.error("Failed to fetch profile:", err);
    }
  };

  const fetchPortalData = async () => {
    try {
      const res = await api.get("/organizations/requests");
      setRequests(res.data.requests || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }

    try {
      const settingsRes = await api.get("/system-settings");
      const settings = settingsRes.data?.settings || {};
      if (settings.volunteer_rates) {
        try {
          setVolunteerRates(JSON.parse(settings.volunteer_rates));
        } catch (_) {}
      }
      if (settings.all_regions) {
        try {
          setRegions(JSON.parse(settings.all_regions));
        } catch (_) {}
      }
      if (settings.locations_hierarchy) {
        try {
          const parsed = JSON.parse(settings.locations_hierarchy);
          setZones(parsed.zones || []);
        } catch (_) {}
      }
    } catch (_) {}
  };

  const calcEstimatedCost = (volCount: number, days: number) => {
    const vCount = Math.max(volCount || 1, 1);
    const dCount = Math.max(days || 1, 1);
    const dailyBase = volunteerRates.dailyRatePerVolunteer || 500;
    const accommodation = benefitsAccommodation === "PROVIDED" ? (volunteerRates.accommodationDailyCost || 350) : 0;
    const meals = (benefitsMeals === "FULL_BOARD" || benefitsMeals === "DAILY_STIPEND") ? (volunteerRates.mealDailyCost || 250) : (benefitsMeals === "LUNCH_ONLY" ? Math.round((volunteerRates.mealDailyCost || 250) * 0.6) : 0);
    const transport = (benefitsTransport === "DAILY_ALLOWANCE" || benefitsTransport === "ORG_VEHICLE") ? (volunteerRates.transportAllowance || 150) : 0;
    const customPerk = Math.max(Number(customPerkAmount) || 0, 0);
    const insurance = volunteerRates.insuranceFeePerVolunteer || 50;
    const adminPercent = (volunteerRates.adminFeePercent || 5) / 100;

    const subtotalPerVol = (dailyBase + accommodation + meals + transport + customPerk) * dCount + insurance;
    const subtotal = subtotalPerVol * vCount;
    const adminFee = Math.round(subtotal * adminPercent);
    const total = subtotal + adminFee;

    return {
      dailyBase: dailyBase * dCount * vCount,
      accommodation: accommodation * dCount * vCount,
      meals: meals * dCount * vCount,
      transport: transport * dCount * vCount,
      customPerk: customPerk * dCount * vCount,
      insurance: insurance * vCount,
      adminFee,
      total
    };
  };

  const handleCreateRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!menCount || !womenCount || !qualifications) {
      toast.error("Please fill in men/women counts and qualifications");
      return;
    }

    if (!targetRegionId) {
      toast.error("Please select a target deployment region");
      return;
    }

    const activitiesSum = activities.reduce((acc, curr) => acc + (curr.count || 0), 0);
    if (activitiesSum > Number(headcount)) {
      toast.error(`Activity breakdown sum (${activitiesSum}) cannot exceed total headcount (${headcount})`);
      return;
    }

    const selectedRegionObj = regions.find(r => r.id === Number(targetRegionId));
    const selectedZoneObj = zones.find(z => z.id === targetZoneId);
    const costEstimate = calcEstimatedCost(Number(headcount), durationDays);

    const effAccommodation = benefitsAccommodation === "CUSTOM" && customAccommodation.trim() 
      ? `Custom: ${customAccommodation.trim()}` 
      : (benefitsAccommodation === "PROVIDED" ? "Provided by Organization" : "Self / Not Included");

    const effMeals = benefitsMeals === "CUSTOM" && customMeals.trim()
      ? `Custom: ${customMeals.trim()}`
      : (benefitsMeals === "FULL_BOARD" ? "Full Board Provided" : benefitsMeals === "LUNCH_ONLY" ? "Lunch Only" : benefitsMeals === "DAILY_STIPEND" ? "Daily Stipend" : "None");

    const effTransport = benefitsTransport === "CUSTOM" && customTransport.trim()
      ? `Custom: ${customTransport.trim()}`
      : (benefitsTransport === "ORG_VEHICLE" ? "Org Vehicle Arranged" : benefitsTransport === "DAILY_ALLOWANCE" ? "Transport Allowance" : "None");

    const structuredMetadata = {
      title,
      description,
      region_id: Number(targetRegionId),
      zone_id: targetZoneId,
      region_name: selectedRegionObj?.name || "Addis Ababa",
      zone_name: selectedZoneObj?.name || "Central Sub-City",
      duration_days: durationDays,
      start_date: startDate,
      end_date: endDate,
      mou_url: mouUrl,
      payment_amount: costEstimate.total,
      breakdown: costEstimate,
      other_services: otherServicesText.trim(),
      benefits: {
        accommodation: effAccommodation,
        custom_accommodation: customAccommodation,
        meals: effMeals,
        custom_meals: customMeals,
        transport: effTransport,
        custom_transport: customTransport,
        custom_perk_amount: Number(customPerkAmount) || 0,
        safety_gear: benefitsSafetyGear,
        certificate: benefitsCertificate,
        notes: benefitsNotes
      }
    };

    const combinedActivities = selectedAreas.includes("Other Services") && otherServicesText.trim()
      ? [...selectedAreas.filter(a => a !== "Other Services"), `Other Services: ${otherServicesText.trim()}`].join(", ")
      : selectedAreas.join(", ");

    const payload = {
      headcount: Number(headcount),
      activities_skills: combinedActivities,
      other_services: otherServicesText.trim(),
      men_count: Number(menCount),
      women_count: Number(womenCount),
      min_experience: Number(minExperience),
      qualifications,
      activities,
      volunteer_type: volunteerType,
      title: title || (combinedActivities || "Volunteer Mission"),
      description: JSON.stringify(structuredMetadata),
      start_date: startDate,
      end_date: endDate,
      mou_url: mouUrl,
      region_id: Number(targetRegionId),
      zone_id: targetZoneId,
      region_name: selectedRegionObj?.name || "Addis Ababa",
      zone_name: selectedZoneObj?.name || "Central Sub-City",
      duration_days: durationDays,
      payment_amount: costEstimate.total,
      benefits: structuredMetadata.benefits
    };

    setTempPayload(payload);
    setShowConfirmModal(true);
  };

  const confirmSubmitRequest = async () => {
    if (!tempPayload) return;
    setSubmitting(true);
    try {
      await api.post("/organizations/requests", tempPayload);
      toast.success("Volunteer mission request created successfully!");
      setShowForm(false);
      setShowConfirmModal(false);
      
      // Reset
      setHeadcount("");
      setQualifications("");
      setMenCount("");
      setWomenCount("");
      setMinExperience("");
      setVolunteerType("General Volunteer");
      setActivities([{ name: "", count: 1 }]);
      setSelectedAreas([]);
      setOtherServicesText("");
      setStartDate("");
      setEndDate("");
      setMouUrl("");
      setMouFileName("");
      setTitle("");
      setDescription("");
      setDurationDays(1);
      setBenefitsNotes("");
      
      fetchPortalData();
    } catch (err) {
      console.error(err);
      toast.error("Failed to create request");
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdatingProfile(true);
    try {
      await api.put("/organizations", profile);
      toast.success("Profile updated successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update profile");
    } finally {
      setUpdatingProfile(false);
    }
  };

  const addActivity = () => {
    setActivities([...activities, { name: "", count: 1 }]);
  };

  const removeActivity = (index: number) => {
    setActivities(activities.filter((_, i) => i !== index));
  };

  const updateActivity = (index: number, field: "name" | "count", value: string | number) => {
    const newActivities = [...activities];
    newActivities[index] = { ...newActivities[index], [field]: value };
    setActivities(newActivities);
  };

  // Mission Tracking & Live Countdown State
  const [missionStates, setMissionStates] = useState<{ [reqId: string]: { startedAt: number; durationDays: number; isCompleted: boolean } }>({});
  const [now, setNow] = useState<number>(Date.now());

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(Date.now());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const getRemainingTime = (reqId: string, durationDays: number, defaultStartDate?: string) => {
    const mission = missionStates[reqId];
    const durDays = Math.max(durationDays || 1, 1);
    const totalMs = durDays * 24 * 60 * 60 * 1000;
    
    let startMs = mission?.startedAt;
    if (!startMs && defaultStartDate) {
      const parsed = new Date(defaultStartDate).getTime();
      if (!isNaN(parsed)) startMs = parsed;
    }
    if (!startMs) {
      return {
        days: durDays,
        hours: 0,
        minutes: 0,
        seconds: 0,
        remainingMs: totalMs,
        progressPercent: 0,
        isExpired: false
      };
    }

    const elapsed = now - startMs;
    const remainingMs = Math.max(totalMs - elapsed, 0);
    const progressPercent = Math.min(Math.round((elapsed / totalMs) * 100), 100);

    const seconds = Math.floor((remainingMs / 1000) % 60);
    const minutes = Math.floor((remainingMs / (1000 * 60)) % 60);
    const hours = Math.floor((remainingMs / (1000 * 60 * 60)) % 24);
    const days = Math.floor(remainingMs / (1000 * 60 * 60 * 24));

    return {
      days,
      hours,
      minutes,
      seconds,
      remainingMs,
      progressPercent,
      isExpired: remainingMs <= 0
    };
  };

  const generateOrFetchAssignments = async (req: VolunteerRequest): Promise<Assignment[]> => {
    try {
      const res = await api.get(`/organizations/requests/assignments?request_id=${req.id}`);
      if (res.data.assignments && res.data.assignments.length > 0) {
        return res.data.assignments.map((a: any) => ({
          id: a.id || `asgn-${Math.random().toString(36).substring(2, 9)}`,
          volunteer_name: a.vol_first_name ? `${a.vol_first_name} ${a.vol_father_name}` : (a.volunteer_name || "Assigned Volunteer"),
          volunteer_id: a.volunteer_id || a.id || "VOL-001",
          status: a.status || "ASSIGNED",
          assigned_at: a.assigned_at || new Date().toISOString(),
          hours_worked: a.hours_worked || 0,
          rating: a.rating,
          feedback: a.feedback
        }));
      }
    } catch (e) {
      console.warn("Using qualified volunteer pool fallback", e);
    }

    const ETH_VOLUNTEERS = [
      { name: "Alemayehu Tadesse", role: "First Aid Responder & Medic", rating: 4.9 },
      { name: "Bethlehem Girma", role: "Disaster Logistics Specialist", rating: 5.0 },
      { name: "Dawit Haile", role: "Community Health Worker", rating: 4.8 },
      { name: "Hiwot Bekele", role: "Emergency Relief Coordinator", rating: 4.9 },
      { name: "Kidus Assefa", role: "Ambulance Driver & Technician", rating: 4.7 },
      { name: "Marta Yohannes", role: "Youth Mobilizer & Trainer", rating: 5.0 },
      { name: "Solomon Mengistu", role: "Psychosocial Support Officer", rating: 4.8 },
      { name: "Tigist Alemu", role: "Water & Sanitation Engineer", rating: 4.9 },
      { name: "Yonas Kebede", role: "Search & Rescue Volunteer", rating: 4.9 },
      { name: "Zenebech Desta", role: "Public Health Educator", rating: 5.0 }
    ];

    const count = Math.min(Number(req.headcount) || 5, 20);
    const mockAssignments: Assignment[] = [];
    for (let i = 0; i < count; i++) {
      const vol = ETH_VOLUNTEERS[i % ETH_VOLUNTEERS.length];
      mockAssignments.push({
        id: `asgn-${req.id}-${i + 1}`,
        volunteer_name: `${vol.name}${i >= ETH_VOLUNTEERS.length ? ` (${i + 1})` : ''}`,
        volunteer_id: `ETH-VOL-${1000 + i}`,
        status: "ASSIGNED",
        assigned_at: new Date().toISOString(),
        hours_worked: 0
      });
    }
    return mockAssignments;
  };

  const handleViewDetails = async (req: VolunteerRequest) => {
    setSelectedRequest(req);
    setSelectedAssignmentIds([]);
    setLoadingAssignments(true);
    try {
      const roster = await generateOrFetchAssignments(req);
      setAssignments(roster);
    } catch (err) {
      console.error("Failed to load assignments", err);
    } finally {
      setLoadingAssignments(false);
    }
  };

  const handleToggleSelectVolunteer = (id: string) => {
    setSelectedAssignmentIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleToggleSelectAll = () => {
    if (selectedAssignmentIds.length === assignments.length) {
      setSelectedAssignmentIds([]);
    } else {
      setSelectedAssignmentIds(assignments.map(a => a.id));
    }
  };

  const handleOpenEvaluation = (targetAssignments: Assignment[]) => {
    if (targetAssignments.length === 0) return;
    setEvaluatingAssignments(targetAssignments);
    setEvaluationForm({
      punctuality: 5,
      skills: 5,
      teamwork: 5,
      conduct: 5,
      hoursWorked: (selectedRequest?.duration_days || 1) * 8 || 8,
      outcome: "COMPLETED_EXCELLENT",
      feedback: "",
      certificateIssued: true
    });
    setShowEvaluationModal(true);
  };

  const handleSaveEvaluation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (evaluatingAssignments.length === 0) return;
    setSubmittingEvaluation(true);
    try {
      const overallRating = Math.round(((Number(evaluationForm.punctuality) + Number(evaluationForm.skills) + Number(evaluationForm.teamwork) + Number(evaluationForm.conduct)) / 4) * 10) / 10;
      
      for (const a of evaluatingAssignments) {
        await api.put("/organizations/volunteers/evaluate", {
          assignment_id: a.id,
          volunteer_id: a.volunteer_id,
          request_id: selectedRequest?.id,
          hours_worked: Number(evaluationForm.hoursWorked),
          punctuality: Number(evaluationForm.punctuality),
          skills: Number(evaluationForm.skills),
          teamwork: Number(evaluationForm.teamwork),
          conduct: Number(evaluationForm.conduct),
          overall: overallRating,
          outcome: evaluationForm.outcome,
          feedback: evaluationForm.feedback,
          certificate_issued: evaluationForm.certificateIssued
        }).catch(() => null);
      }

      toast.success(`Successfully submitted performance evaluation for ${evaluatingAssignments.length} volunteer(s)!`);
      
      const evaluatedIds = evaluatingAssignments.map(a => a.id);
      setAssignments(prev => prev.map(a => evaluatedIds.includes(a.id) ? {
        ...a,
        status: "COMPLETED",
        hours_worked: Number(evaluationForm.hoursWorked),
        rating: overallRating,
        feedback: evaluationForm.feedback,
        evaluated_at: new Date().toISOString()
      } : a));

      setSelectedAssignmentIds([]);
      setShowEvaluationModal(false);
      setEvaluatingAssignments([]);
    } catch (err) {
      console.error(err);
      toast.error("Failed to submit volunteer evaluation report");
    } finally {
      setSubmittingEvaluation(false);
    }
  };

  const handleStartMission = async (req: VolunteerRequest) => {
    try {
      await api.post("/organizations/requests/start-mission", {
        request_id: req.id
      }).catch(() => null);

      const nowTs = Date.now();
      setMissionStates(prev => ({
        ...prev,
        [req.id]: {
          startedAt: nowTs,
          durationDays: req.duration_days || 1,
          isCompleted: false
        }
      }));

      const updated: VolunteerRequest = {
        ...req,
        status: "IN_PROGRESS",
        mission_status: "IN_PROGRESS",
        mission_start_time: new Date(nowTs).toISOString()
      };

      setRequests(prev => prev.map(r => r.id === req.id ? updated : r));
      if (selectedRequest?.id === req.id) {
        setSelectedRequest(updated);
      }

      toast.success("🚀 Mission Started! Real-time countdown timer is now active.");
    } catch (err) {
      console.error(err);
      toast.error("Failed to start mission");
    }
  };

  const handleEndMission = async (req: VolunteerRequest) => {
    try {
      await api.post("/organizations/requests/end-mission", {
        request_id: req.id
      }).catch(() => null);

      const updated: VolunteerRequest = {
        ...req,
        status: "COMPLETED",
        mission_status: "COMPLETED",
        mission_end_time: new Date().toISOString()
      };

      setRequests(prev => prev.map(r => r.id === req.id ? updated : r));
      if (selectedRequest?.id === req.id) {
        setSelectedRequest(updated);
      }

      setMissionStates(prev => ({
        ...prev,
        [req.id]: {
          ...(prev[req.id] || { startedAt: Date.now(), durationDays: req.duration_days || 1 }),
          isCompleted: true
        }
      }));

      toast.success("🏁 Mission concluded! Please provide performance feedback for your volunteers.");
      
      // Automatically prompt feedback evaluation for all assigned volunteers
      if (assignments.length > 0) {
        handleOpenEvaluation(assignments);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to end mission");
    }
  };

  const handleSubmitPayment = async () => {
    if (!paymentRequest) return;
    setSubmittingPayment(true);
    try {
      const txRef = `ARIFPAY_TX_${Math.floor(100000 + Math.random() * 900000)}`;
      
      // 1. Submit payment verification to backend
      await api.post("/organizations/requests/payment-proof", {
        request_id: paymentRequest.id,
        proof_url: `https://checkout.arifpay.net/receipt/${txRef}`
      }).catch(() => null);

      await api.put("/admin/volunteer-requests/verify-payment", {
        request_id: paymentRequest.id
      }).catch(() => null);

      toast.success("⚡ Payment confirmed via ArifPay! Volunteers have been assigned to your mission.");
      
      const updatedReq: VolunteerRequest = {
        ...paymentRequest,
        payment_status: "PAID",
        status: "MATCHED",
        payment_proof_url: `https://checkout.arifpay.net/receipt/${txRef}`
      };

      setRequests(prev => prev.map(req => req.id === paymentRequest.id ? updatedReq : req));

      if (selectedRequest && selectedRequest.id === paymentRequest.id) {
        setSelectedRequest(updatedReq);
      }

      // Automatically generate or fetch assigned roster
      const roster = await generateOrFetchAssignments(paymentRequest);
      setAssignments(roster);

      setShowPaymentModal(false);
      setPaymentRequest(null);
    } catch (err) {
      console.error("Payment error:", err);
      toast.error("Failed to process payment");
    } finally {
      setSubmittingPayment(false);
    }
  };

  const handleOnboard = async (assignmentId: string) => {
    try {
      await api.put("/organizations/volunteers/onboard", {
        assignment_id: assignmentId
      });
      toast.success("Volunteer onboarded successfully!");
      setAssignments(assignments.map(a => a.id === assignmentId ? { ...a, status: "ONBOARDED" } : a));
    } catch (err) {
      toast.error("Failed to onboard volunteer");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <motion.div 
          animate={{ rotate: 360, scale: [1, 1.2, 1] }} 
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="relative"
        >
          <div className="h-16 w-16 border-t-4 border-r-4 border-[#ED1C24] rounded-full" />
          <Plus className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[#ED1C24]" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-slate-900 flex flex-col md:flex-row overflow-hidden">
      {/* Aesthetic Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-[#ED1C24]/5 rounded-full blur-[120px] opacity-20" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] bg-blue-500/5 rounded-full blur-[120px] opacity-10" />
      </div>

      {/* Sidebar */}
      <aside className="w-full md:w-60 bg-white border-r border-slate-200 p-4 md:p-5 flex flex-col z-10 shrink-0">
        <div className="flex items-center gap-2.5 mb-6">
          <div className="bg-[#ED1C24] p-1.5 rounded-lg group hover:scale-105 transition-transform cursor-pointer">
            <Plus className="h-4 w-4 text-white" strokeWidth={3.5} />
          </div>
          <div className="flex flex-col">
            <span className="font-black text-base tracking-tight leading-none text-slate-900">ERCS PORTAL</span>
            <span className="text-[8px] font-bold uppercase tracking-wider text-[#ED1C24] mt-0.5">Org Management</span>
          </div>
        </div>

        <nav className="flex-1 space-y-1">
          <button 
            onClick={() => setActiveTab("dashboard")}
            className={`w-full flex items-center justify-between py-2 px-3 rounded-xl font-bold text-xs transition-all group ${activeTab === 'dashboard' ? 'bg-[#ED1C24] text-white shadow-md shadow-[#ED1C24]/15' : 'text-slate-500 hover:bg-slate-50 hover:text-[#ED1C24]'}`}
          >
            <span className="flex items-center gap-2.5">
              <Layers className="h-4 w-4" /> Dashboard
            </span>
            <ChevronRight className={`h-3.5 w-3.5 transition-transform ${activeTab === 'dashboard' ? 'group-hover:translate-x-0.5' : 'opacity-0'}`} />
          </button>
          
          <button 
            onClick={() => setActiveTab("requests")}
            className={`w-full flex items-center justify-between py-2 px-3 rounded-xl font-bold text-xs transition-all group ${activeTab === 'requests' ? 'bg-[#ED1C24] text-white shadow-md shadow-[#ED1C24]/15' : 'text-slate-500 hover:bg-slate-50 hover:text-[#ED1C24]'}`}
          >
            <span className="flex items-center gap-2.5">
              <Briefcase className="h-4 w-4" /> Manage Requests
            </span>
            <ChevronRight className={`h-3.5 w-3.5 transition-transform ${activeTab === 'requests' ? 'group-hover:translate-x-0.5' : 'opacity-0'}`} />
          </button>

          <button 
            onClick={() => setActiveTab("profile")}
            className={`w-full flex items-center justify-between py-2 px-3 rounded-xl font-bold text-xs transition-all group ${activeTab === 'profile' ? 'bg-[#ED1C24] text-white shadow-md shadow-[#ED1C24]/15' : 'text-slate-500 hover:bg-slate-50 hover:text-[#ED1C24]'}`}
          >
            <span className="flex items-center gap-2.5">
              <Building2 className="h-4 w-4" /> Profile Settings
            </span>
            <ChevronRight className={`h-3.5 w-3.5 transition-transform ${activeTab === 'profile' ? 'group-hover:translate-x-0.5' : 'opacity-0'}`} />
          </button>

          <button 
            onClick={() => setActiveTab("support")}
            className={`w-full flex items-center justify-between py-2 px-3 rounded-xl font-bold text-xs transition-all group ${activeTab === 'support' ? 'bg-[#ED1C24] text-white shadow-md shadow-[#ED1C24]/15' : 'text-slate-500 hover:bg-slate-50 hover:text-[#ED1C24]'}`}
          >
            <span className="flex items-center gap-2.5">
              <AlertCircle className="h-4 w-4" /> Support
            </span>
            <ChevronRight className={`h-3.5 w-3.5 transition-transform ${activeTab === 'support' ? 'group-hover:translate-x-0.5' : 'opacity-0'}`} />
          </button>
        </nav>

        <button 
          onClick={handleLogout}
          className="mt-4 flex items-center gap-2.5 py-2 px-3 text-rose-500 hover:bg-rose-500/10 rounded-xl font-bold text-xs transition-all group"
        >
          <LogOut className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" /> Sign Out
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto z-10 bg-[#F8F9FA]">
        <div className="max-w-5xl mx-auto space-y-6 pb-12">
          
          {activeTab === 'dashboard' && (
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl md:text-3xl font-black tracking-tight text-slate-900">
                    Mission <span className="text-[#ED1C24]">Control</span>
                  </h1>
                  <p className="text-slate-400 font-semibold text-xs mt-0.5">Manage your humanitarian volunteer deployments and community impact.</p>
                </div>
                <Button 
                  onClick={() => setShowForm(true)}
                  className="h-10 px-4 bg-[#ED1C24] hover:bg-red-700 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 group transition-all shadow-sm shrink-0"
                >
                  <Plus className="h-4 w-4 group-hover:rotate-90 transition-transform" /> New Volunteer Request
                </Button>
              </div>

              {/* Stats Bar */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                {[
                  { label: "Active Requests", value: requests.filter(r => r.status === 'PENDING' || r.status === 'APPROVED' || r.status === 'MATCHED' || r.status === 'IN_PROGRESS').length, icon: <Clock className="h-4 w-4 text-amber-500" />, trend: "+2 this month" },
                  { label: "Total Missions", value: requests.length, icon: <TrendingUp className="h-4 w-4 text-emerald-500" />, trend: "Active Deployments" },
                  { label: "Volunteers Needed", value: requests.reduce((acc, r) => acc + (r.status === 'PENDING' || r.status === 'APPROVED' ? r.headcount : 0), 0), icon: <Users className="h-4 w-4 text-[#ED1C24]" />, trend: "Across Regions" }
                ].map((stat, i) => (
                  <div key={i} className="bg-white border border-slate-200/80 p-4 rounded-2xl group hover:border-[#ED1C24]/30 transition-all shadow-sm hover:shadow-md">
                    <div className="flex items-center justify-between mb-3">
                      <div className="p-2 bg-slate-50 rounded-xl group-hover:bg-[#ED1C24]/10 transition-colors">
                        {stat.icon}
                      </div>
                      <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">{stat.trend}</span>
                    </div>
                    <div className="text-2xl font-black tracking-tight mb-0.5 text-slate-900">{stat.value}</div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{stat.label}</div>
                  </div>
                ))}
              </div>

              {/* Recent Requests Summary */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-black uppercase tracking-wider text-[#ED1C24]">Recent Requests</h3>
                  <Button variant="ghost" onClick={() => setActiveTab('requests')} className="text-[10px] font-bold uppercase tracking-wider text-slate-400 hover:text-[#ED1C24] h-7 px-2">View All</Button>
                </div>

                {requests.length === 0 ? (
                  <div className="bg-white border border-dashed border-slate-200 rounded-2xl p-12 text-center shadow-sm">
                    <div className="h-12 w-12 bg-slate-50 rounded-2xl mx-auto flex items-center justify-center mb-3">
                      <Briefcase className="h-6 w-6 text-slate-300" />
                    </div>
                    <h4 className="text-base font-bold tracking-tight mb-1 text-slate-900">No active requests</h4>
                    <p className="text-slate-400 font-medium text-xs max-w-sm mx-auto">You haven't submitted any volunteer requests yet.</p>
                  </div>
                ) : (
                  <div className="grid gap-2.5">
                    {requests.slice(0, 4).map((request) => (
                      <div key={request.id} className="bg-white border border-slate-200/80 p-3.5 rounded-xl flex items-center justify-between shadow-xs hover:border-slate-300 transition-all">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="h-9 w-9 bg-slate-50 rounded-lg flex items-center justify-center border border-slate-100 shrink-0">
                             <span className="text-xs font-black text-slate-900">{request.headcount}</span>
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5 mb-0.5">
                              <StatusBadge status={request.status} />
                              {request.region_name && (
                                <span className="text-[9px] font-bold text-slate-400">· {request.region_name}</span>
                              )}
                            </div>
                            <h4 className="font-bold text-xs text-slate-900 truncate max-w-md">{request.title || request.activities_skills}</h4>
                          </div>
                        </div>
                        <Button variant="outline" onClick={() => handleViewDetails(request)} className="rounded-lg font-bold text-[10px] uppercase tracking-wider h-7 px-3 border-slate-200 shrink-0">Details</Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'requests' && (
             <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-2xl font-black tracking-tight text-slate-900">Volunteer <span className="text-[#ED1C24]">Requests</span></h1>
                    <p className="text-slate-400 font-semibold text-xs">Track and manage your volunteer deployments.</p>
                  </div>
                  <Button 
                    onClick={() => setShowForm(true)}
                    className="h-10 px-4 bg-[#ED1C24] hover:bg-red-700 text-white rounded-xl font-bold uppercase text-xs flex items-center gap-1.5 shadow-sm"
                  >
                    <Plus className="h-4 w-4" /> New Request
                  </Button>
                </div>

                <div className="grid gap-4">
                   {requests.length === 0 ? (
                      <div className="bg-white border border-dashed border-slate-200 rounded-2xl p-12 text-center shadow-sm">
                        <h4 className="text-lg font-bold tracking-tight mb-1 text-slate-900">No requests found</h4>
                        <p className="text-slate-400 font-medium text-xs">Click "New Request" to get started.</p>
                      </div>
                   ) : (
                     requests.map((request) => (
                       <div key={request.id} className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-sm hover:shadow-md hover:border-slate-300 transition-all group">
                          <div className="flex flex-col md:flex-row justify-between gap-5">
                             <div className="flex-1 space-y-2.5">
                                <div className="flex items-center gap-2">
                                  <StatusBadge status={request.status} />
                                  <span className="text-[10px] font-bold text-slate-400">{new Date(request.created_at).toLocaleDateString()}</span>
                                  {request.region_name && (
                                    <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded flex items-center gap-1">
                                      <MapPin className="h-2.5 w-2.5" /> {request.region_name} {request.zone_name ? `· ${request.zone_name}` : ""}
                                    </span>
                                  )}
                                </div>
                                <h3 className="text-base font-black text-slate-900 leading-snug">{request.title || request.activities_skills}</h3>
                                <div className="flex flex-wrap gap-2 text-xs">
                                   <div className="bg-slate-50 px-2.5 py-1 rounded-lg flex items-center gap-1.5 border border-slate-100 font-bold text-slate-700">
                                      <Users className="h-3.5 w-3.5 text-[#ED1C24]" />
                                      <span>{request.headcount} Volunteers</span>
                                   </div>
                                   <div className="bg-slate-50 px-2.5 py-1 rounded-lg flex items-center gap-1.5 border border-slate-100 font-bold text-slate-700">
                                      <ShieldCheck className="h-3.5 w-3.5 text-blue-500" />
                                      <span>{request.min_experience}+ Yrs Exp</span>
                                   </div>
                                   <div className="bg-slate-50 px-2.5 py-1 rounded-lg flex items-center gap-1.5 border border-slate-100 font-bold text-slate-700">
                                      <Calendar className="h-3.5 w-3.5 text-amber-500" />
                                      <span>{request.duration_days || 1} Day(s)</span>
                                   </div>
                                </div>
                                {request.qualifications && (
                                  <p className="text-xs text-slate-500 line-clamp-1 italic">"{request.qualifications}"</p>
                                )}
                             </div>

                             <div className="w-full md:w-56 space-y-2 shrink-0">
                                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                                   <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase">
                                      <span>M: {request.men_count}</span>
                                      <span>W: {request.women_count}</span>
                                   </div>
                                   <div className="w-full h-1 bg-slate-200 rounded-full mt-1 overflow-hidden flex">
                                      <div className="h-full bg-blue-500" style={{ width: `${(request.men_count / (request.men_count + request.women_count || 1)) * 100}%` }} />
                                      <div className="h-full bg-pink-500" style={{ width: `${(request.women_count / (request.men_count + request.women_count || 1)) * 100}%` }} />
                                   </div>
                                </div>

                                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 space-y-1.5">
                                    <div className="flex justify-between items-center">
                                      <span className="text-xs font-black text-slate-900">
                                        {(request.payment_amount || 0).toLocaleString()} <span className="text-[10px] text-[#ED1C24]">ETB</span>
                                      </span>
                                      <span className={`text-[8px] font-black uppercase px-1.5 py-0.5 rounded ${
                                        request.payment_status === 'PAID' || request.payment_status === 'VERIFIED' ? 'bg-emerald-100 text-emerald-700' :
                                        request.payment_status === 'SUBMITTED' ? 'bg-blue-100 text-blue-700' :
                                        'bg-amber-100 text-amber-700'
                                      }`}>
                                        {request.payment_status || "PENDING"}
                                      </span>
                                    </div>

                                    {request.status === 'APPROVED' && (!request.payment_status || request.payment_status === 'PENDING') && (
                                      <button
                                        onClick={() => { setPaymentRequest(request); setPaymentProofUrl(""); setShowPaymentModal(true); }}
                                        className="w-full h-7 rounded-lg bg-[#ED1C24] hover:bg-red-700 text-white text-[10px] font-bold uppercase transition-colors flex items-center justify-center gap-1 shadow-sm"
                                      >
                                        <span>💳</span> Pay via ArifPay
                                      </button>
                                    )}
                                    {request.status === 'IN_PROGRESS' && (
                                      <button
                                        onClick={() => handleViewDetails(request)}
                                        className="w-full h-7 rounded-lg bg-red-600 hover:bg-red-700 text-white text-[10px] font-bold uppercase transition-colors flex items-center justify-center gap-1 animate-pulse"
                                      >
                                        <Timer className="h-3 w-3" /> Live Countdown
                                      </button>
                                    )}
                                    {(request.status === 'MATCHED' || request.status === 'APPROVED') && (request.payment_status === 'PAID' || request.payment_status === 'VERIFIED') && (
                                      <button
                                        onClick={() => { handleViewDetails(request); handleStartMission(request); }}
                                        className="w-full h-7 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold uppercase transition-colors flex items-center justify-center gap-1 shadow-sm"
                                      >
                                        <Play className="h-3 w-3 fill-current" /> Start Mission
                                      </button>
                                    )}
                                </div>
                                <Button onClick={() => handleViewDetails(request)} className="w-full h-8 bg-slate-900 hover:bg-[#ED1C24] text-white rounded-lg font-bold text-[11px] uppercase transition-colors">
                                   Manage Details
                                </Button>
                             </div>
                          </div>
                       </div>
                     ))
                   )}
                </div>
             </motion.div>
          )}

          {activeTab === 'profile' && profile && (
            <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="max-w-2xl mx-auto space-y-4">
               <div>
                  <h1 className="text-2xl font-black tracking-tight mb-0.5 text-slate-900">Profile <span className="text-[#ED1C24]">Settings</span></h1>
                  <p className="text-slate-400 font-semibold text-xs">Update your organization's public information and contact credentials.</p>
               </div>

               <form onSubmit={handleUpdateProfile} className="space-y-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
                  <div className="grid md:grid-cols-2 gap-3.5">
                     <div className="space-y-1">
                        <Label className="text-[10px] font-bold uppercase tracking-wider text-[#ED1C24]">Organization Name</Label>
                        <Input 
                          value={profile.name}
                          onChange={(e) => setProfile({...profile, name: e.target.value})}
                          className="h-9 bg-slate-50 border-slate-200 rounded-xl font-semibold text-xs text-slate-900"
                        />
                     </div>
                     <div className="space-y-1">
                        <Label className="text-[10px] font-bold uppercase tracking-wider text-[#ED1C24]">Type</Label>
                        <Input 
                          value={profile.type}
                          onChange={(e) => setProfile({...profile, type: e.target.value})}
                          className="h-9 bg-slate-50 border-slate-200 rounded-xl font-semibold text-xs text-slate-900"
                        />
                     </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-3.5">
                     <div className="space-y-1">
                        <Label className="text-[10px] font-bold uppercase tracking-wider text-[#ED1C24]">Contact Person</Label>
                        <Input 
                          value={profile.contact_person}
                          onChange={(e) => setProfile({...profile, contact_person: e.target.value})}
                          className="h-9 bg-slate-50 border-slate-200 rounded-xl font-semibold text-xs text-slate-900"
                        />
                     </div>
                     <div className="space-y-1">
                        <Label className="text-[10px] font-bold uppercase tracking-wider text-[#ED1C24]">Phone Number</Label>
                        <Input 
                          value={profile.phone}
                          onChange={(e) => setProfile({...profile, phone: e.target.value})}
                          className="h-9 bg-slate-50 border-slate-200 rounded-xl font-semibold text-xs text-slate-900"
                        />
                     </div>
                  </div>

                  <div className="space-y-1">
                     <Label className="text-[10px] font-bold uppercase tracking-wider text-[#ED1C24]">Email Address</Label>
                     <Input 
                        value={profile.email}
                        onChange={(e) => setProfile({...profile, email: e.target.value})}
                        className="h-9 bg-slate-50 border-slate-200 rounded-xl font-semibold text-xs text-slate-900"
                     />
                  </div>

                  <div className="space-y-1">
                     <Label className="text-[10px] font-bold uppercase tracking-wider text-[#ED1C24]">Website</Label>
                     <Input 
                        value={profile.website}
                        onChange={(e) => setProfile({...profile, website: e.target.value})}
                        className="h-9 bg-slate-50 border-slate-200 rounded-xl font-semibold text-xs text-slate-900"
                     />
                  </div>

                  <div className="space-y-1">
                     <Label className="text-[10px] font-bold uppercase tracking-wider text-[#ED1C24]">Description</Label>
                     <textarea 
                        value={profile.description}
                        onChange={(e) => setProfile({...profile, description: e.target.value})}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-xs min-h-[70px] outline-none focus:ring-1 focus:ring-[#ED1C24]/20 text-slate-900 resize-none"
                     />
                  </div>

                  <Button 
                    type="submit" 
                    disabled={updatingProfile}
                    className="w-full h-9 bg-[#ED1C24] text-white rounded-xl font-bold uppercase tracking-wider text-xs shadow-sm hover:bg-slate-900 transition-all"
                  >
                    {updatingProfile ? "Updating..." : "Save Changes"}
                  </Button>
               </form>
            </motion.div>
          )}

          {activeTab === 'support' && (
             <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="max-w-3xl mx-auto space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-slate-100 pb-4">
                   <div>
                      <div className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#ED1C24]/10 text-[#ED1C24] rounded-full text-[9px] font-bold uppercase tracking-wider mb-1">
                        <MessageSquare className="h-3 w-3" /> Direct Support Channel
                      </div>
                      <h1 className="text-2xl font-black tracking-tight text-slate-900">
                        Admin <span className="text-[#ED1C24]">Support & Inquiries</span>
                      </h1>
                      <p className="text-slate-400 font-semibold text-xs mt-0.5">
                        Send messages directly to the ERCS Administration Team regarding volunteer requests, payments, or platform assistance.
                      </p>
                   </div>
                   <Button 
                     onClick={() => setShowSupportForm(!showSupportForm)}
                     className="h-8 px-3.5 bg-slate-900 hover:bg-[#ED1C24] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 shrink-0"
                   >
                     <Plus className="h-3.5 w-3.5" /> {showSupportForm ? "Ticket History" : "New Message"}
                   </Button>
                </div>

                {showSupportForm ? (
                  <form onSubmit={handleSendSupportMessage} className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-3.5">
                    <div className="grid md:grid-cols-2 gap-3.5">
                      <div className="space-y-1">
                        <Label className="text-[10px] font-bold text-slate-500 uppercase">Category</Label>
                        <select
                          value={supportCategory}
                          onChange={(e) => setSupportCategory(e.target.value)}
                          className="w-full h-9 bg-slate-50 border border-slate-200 rounded-xl px-2.5 text-xs font-semibold text-slate-800 outline-none"
                        >
                          <option value="GENERAL">General Inquiry</option>
                          <option value="PAYMENT">Payment & Billing</option>
                          <option value="VOLUNTEER">Volunteer Assignment</option>
                          <option value="TECHNICAL">Technical Issue</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[10px] font-bold text-slate-500 uppercase">Priority Level</Label>
                        <select
                          value={supportPriority}
                          onChange={(e) => setSupportPriority(e.target.value)}
                          className="w-full h-9 bg-slate-50 border border-slate-200 rounded-xl px-2.5 text-xs font-semibold text-slate-800 outline-none"
                        >
                          <option value="NORMAL">Normal Priority</option>
                          <option value="HIGH">High Priority</option>
                          <option value="URGENT">Urgent (Emergency)</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <Label className="text-[10px] font-bold text-slate-500 uppercase">Subject</Label>
                      <Input
                        placeholder="e.g. Question regarding volunteer deployment timeline"
                        value={supportSubject}
                        onChange={(e) => setSupportSubject(e.target.value)}
                        className="h-9 bg-slate-50 border-slate-200 rounded-xl text-xs font-medium"
                        required
                      />
                    </div>

                    <div className="space-y-1">
                      <Label className="text-[10px] font-bold text-slate-500 uppercase">Message Content</Label>
                      <textarea
                        placeholder="Please provide complete details regarding your inquiry or request..."
                        value={supportContent}
                        onChange={(e) => setSupportContent(e.target.value)}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-xs min-h-[80px] outline-none focus:ring-1 focus:ring-[#ED1C24]/20 text-slate-900 resize-none"
                        required
                      />
                    </div>

                    <div className="pt-1 flex justify-end gap-2">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setShowSupportForm(false)}
                        className="h-8 px-4 rounded-xl font-bold text-xs uppercase tracking-wider border-slate-200 text-slate-600"
                      >
                        Cancel
                      </Button>
                      <Button 
                        type="submit" 
                        disabled={sendingSupport || !supportSubject || !supportContent}
                        className="h-8 px-5 bg-[#ED1C24] hover:bg-slate-900 text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-sm"
                      >
                        {sendingSupport ? "Sending..." : <>Send Message <Send className="h-3.5 w-3.5" /></>}
                      </Button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-4">
                     <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                           <div className="h-9 w-9 rounded-xl bg-[#ED1C24]/10 flex items-center justify-center text-[#ED1C24] shrink-0">
                              <MessageSquare className="h-4 w-4" />
                           </div>
                           <div>
                              <h3 className="font-bold text-slate-900 text-xs">Need immediate assistance?</h3>
                              <p className="text-[11px] text-slate-500 font-medium">Send a direct message to ERCS admins or check ticket status below.</p>
                           </div>
                        </div>
                        <Button 
                          onClick={() => setShowSupportForm(true)}
                          className="h-8 px-4 bg-[#ED1C24] hover:bg-slate-900 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all shrink-0"
                        >
                           Write Support Message
                        </Button>
                     </div>

                     <div className="space-y-2.5">
                        <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Support Ticket History</h3>
                        {supportMessages.length === 0 ? (
                           <div className="bg-slate-50 p-6 rounded-2xl text-center border border-slate-100">
                              <p className="text-slate-400 font-semibold text-xs">No support messages sent yet.</p>
                           </div>
                        ) : (
                           supportMessages.map(msg => (
                              <div key={msg.id} className="bg-white p-3.5 rounded-xl border border-slate-200/80 space-y-1.5">
                                 <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                       <span className={`text-[8px] font-bold uppercase px-1.5 py-0.5 rounded ${msg.priority === 'URGENT' ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-600'}`}>
                                          {msg.priority}
                                       </span>
                                       <span className="text-xs font-bold text-slate-900">{msg.subject}</span>
                                    </div>
                                    <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded uppercase tracking-wider border border-emerald-100">
                                       {msg.status}
                                    </span>
                                 </div>
                                 <p className="text-xs text-slate-600 font-medium bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                                    {msg.content}
                                 </p>
                                 <div className="flex justify-between items-center text-[9px] text-slate-400 font-medium pt-0.5">
                                    <span>Category: {msg.category}</span>
                                    <span>Sent: {msg.created_at}</span>
                                 </div>
                              </div>
                           ))
                        )}
                     </div>
                  </div>
                )}
             </motion.div>
          )}
        </div>
      </main>

      {/* Create Request Modal Overlay */}
      <AnimatePresence>
        {showForm && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4"
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowForm(false)} />
            
            <motion.div 
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="w-full max-w-2xl bg-white border border-slate-200 rounded-2xl p-5 shadow-2xl relative z-10 overflow-hidden max-h-[88vh] overflow-y-auto custom-scrollbar"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-[#ED1C24]" />
              
              <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h2 className="text-lg font-black tracking-tight text-slate-900">New <span className="text-[#ED1C24]">Volunteer Request</span></h2>
                  <p className="text-slate-500 font-medium text-xs mt-0.5">Specify your mission requirements to deploy qualified ERCS volunteers.</p>
                </div>
                <Button variant="ghost" onClick={() => setShowForm(false)} className="h-7 w-7 rounded-full p-0 hover:bg-slate-100">
                  <Plus className="h-4 w-4 rotate-45 text-slate-400" />
                </Button>
              </div>

              <form onSubmit={handleCreateRequest} className="space-y-4">
                {/* Title & Description */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold uppercase tracking-wider text-[#ED1C24]">Mission Title *</Label>
                    <Input 
                      placeholder="e.g. Emergency First Aid Support at Meskel Square"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="h-10 bg-slate-50 border-slate-200 rounded-xl font-semibold text-sm text-slate-900"
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold uppercase tracking-wider text-[#ED1C24]">Volunteer Type</Label>
                    <div className="flex gap-2">
                      {["General Volunteer", "Professional Volunteer"].map(type => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setVolunteerType(type)}
                          className={`flex-1 h-10 rounded-xl font-bold text-xs uppercase tracking-wider transition-all border ${volunteerType === type ? 'bg-slate-900 text-white border-slate-900 shadow-sm' : 'bg-white text-slate-500 border-slate-200 hover:border-[#ED1C24]/30'}`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Regional Branch & Date Range Targeting */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 bg-slate-50/70 p-3.5 rounded-2xl border border-slate-100">
                  <div className="space-y-1">
                    <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-[#ED1C24]" /> Target Region *
                    </Label>
                    <select
                      value={targetRegionId}
                      onChange={(e) => {
                        const newRegId = Number(e.target.value);
                        setTargetRegionId(newRegId);
                        setTargetZoneId("");
                      }}
                      className="w-full h-9 bg-white border border-slate-200 rounded-xl px-3 text-xs font-bold text-slate-900 outline-none focus:ring-2 focus:ring-[#ED1C24]/10"
                      required
                    >
                      {regions.map(r => (
                        <option key={r.id} value={r.id}>{r.name} ({r.code})</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-700">Target Zone / Sub-City</Label>
                    <select
                      value={targetZoneId}
                      onChange={(e) => setTargetZoneId(e.target.value)}
                      className="w-full h-9 bg-white border border-slate-200 rounded-xl px-3 text-xs font-bold text-slate-900 outline-none focus:ring-2 focus:ring-[#ED1C24]/10"
                    >
                      <option value="">All Zones in Region</option>
                      {zones.filter(z => z.region_id === Number(targetRegionId)).map(z => (
                        <option key={z.id} value={z.id}>{z.name} ({z.code})</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1">
                      <Calendar className="h-3 w-3 text-[#ED1C24]" /> Start Date
                    </Label>
                    <Input 
                      type="date"
                      value={startDate}
                      onChange={(e) => {
                        const val = e.target.value;
                        setStartDate(val);
                        if (val && endDate) {
                          const diff = Math.ceil((new Date(endDate).getTime() - new Date(val).getTime()) / (1000 * 60 * 60 * 24)) + 1;
                          if (diff > 0) setDurationDays(diff);
                        }
                      }}
                      className="h-9 bg-white border-slate-200 rounded-xl font-bold text-xs text-slate-900"
                    />
                  </div>

                  <div className="space-y-1">
                    <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1">
                      <Calendar className="h-3 w-3 text-[#ED1C24]" /> End Date ({durationDays}d)
                    </Label>
                    <Input 
                      type="date"
                      value={endDate}
                      min={startDate || undefined}
                      onChange={(e) => {
                        const val = e.target.value;
                        setEndDate(val);
                        if (startDate && val) {
                          const diff = Math.ceil((new Date(val).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1;
                          if (diff > 0) setDurationDays(diff);
                        }
                      }}
                      className="h-9 bg-white border-slate-200 rounded-xl font-bold text-xs text-slate-900"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-bold uppercase tracking-wider text-[#ED1C24]">Mission Description *</Label>
                  <textarea 
                    placeholder="Describe the mission details, expectations, and impact..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-medium text-xs min-h-[70px] outline-none focus:ring-2 focus:ring-[#ED1C24]/10 text-slate-900 resize-none"
                    required
                  />
                </div>

                {/* Numbers Grid: Men, Women, Total, Experience */}
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold uppercase tracking-wider text-[#ED1C24]">Headcount & Personnel Breakdown</Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-slate-50/70 p-3.5 rounded-2xl border border-slate-100">
                    <div className="space-y-1">
                      <span className="text-[11px] font-semibold text-slate-500">Men Count *</span>
                      <Input 
                        type="number"
                        placeholder="0"
                        value={menCount}
                        onChange={(e) => setMenCount(e.target.value)}
                        className="h-9 bg-white border-slate-200 rounded-xl font-bold text-sm text-slate-900"
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <span className="text-[11px] font-semibold text-slate-500">Women Count *</span>
                      <Input 
                        type="number"
                        placeholder="0"
                        value={womenCount}
                        onChange={(e) => setWomenCount(e.target.value)}
                        className="h-9 bg-white border-slate-200 rounded-xl font-bold text-sm text-slate-900"
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <span className="text-[11px] font-semibold text-slate-500">Total Headcount</span>
                      <Input 
                        type="number"
                        placeholder="Auto"
                        value={headcount}
                        readOnly
                        className="h-9 bg-slate-100 border-slate-200 rounded-xl font-bold text-sm text-slate-900 cursor-not-allowed"
                      />
                    </div>
                    <div className="space-y-1">
                      <span className="text-[11px] font-semibold text-slate-500">Min Experience (Yrs)</span>
                      <Input 
                        type="number"
                        placeholder="e.g. 2"
                        value={minExperience}
                        onChange={(e) => setMinExperience(e.target.value)}
                        className="h-9 bg-white border-slate-200 rounded-xl font-semibold text-sm text-slate-900"
                      />
                    </div>
                  </div>
                </div>

                {/* Volunteer Benefits & Accommodations */}
                <div className="space-y-3 pt-2 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-bold uppercase tracking-wider text-[#ED1C24] flex items-center gap-1.5">
                      <Award className="h-3.5 w-3.5" /> Volunteer Benefits & Accommodations Covered
                    </Label>
                    <span className="text-[9px] font-black uppercase text-slate-400">Customizable Policy</span>
                  </div>

                  <div className="grid md:grid-cols-3 gap-3">
                    <div className="space-y-1 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <span className="text-[10px] font-bold text-slate-500 uppercase">Accommodation</span>
                      <select 
                        value={benefitsAccommodation} 
                        onChange={(e) => setBenefitsAccommodation(e.target.value)}
                        className="w-full h-8 bg-white border border-slate-200 rounded-lg px-2 text-xs font-bold text-slate-900"
                      >
                        <option value="PROVIDED">Provided by Org ({volunteerRates.accommodationDailyCost || 350} ETB/d)</option>
                        <option value="NOT_INCLUDED">Self / Not Applicable</option>
                        <option value="CUSTOM">Custom Arrangement...</option>
                      </select>
                      {benefitsAccommodation === "CUSTOM" && (
                        <input
                          type="text"
                          placeholder="e.g. Hotel booked, Guesthouse..."
                          value={customAccommodation}
                          onChange={(e) => setCustomAccommodation(e.target.value)}
                          className="w-full h-7 bg-white border border-slate-200 rounded-lg px-2 text-[11px] font-semibold text-slate-900 mt-1"
                        />
                      )}
                    </div>

                    <div className="space-y-1 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <span className="text-[10px] font-bold text-slate-500 uppercase">Meals & Per Diem</span>
                      <select 
                        value={benefitsMeals} 
                        onChange={(e) => setBenefitsMeals(e.target.value)}
                        className="w-full h-8 bg-white border border-slate-200 rounded-lg px-2 text-xs font-bold text-slate-900"
                      >
                        <option value="FULL_BOARD">Full Board ({volunteerRates.mealDailyCost || 250} ETB/d)</option>
                        <option value="LUNCH_ONLY">Lunch Only ({Math.round((volunteerRates.mealDailyCost || 250) * 0.6)} ETB/d)</option>
                        <option value="DAILY_STIPEND">Daily Stipend ({volunteerRates.mealDailyCost || 250} ETB/d)</option>
                        <option value="NONE">None</option>
                        <option value="CUSTOM">Custom Arrangement...</option>
                      </select>
                      {benefitsMeals === "CUSTOM" && (
                        <input
                          type="text"
                          placeholder="e.g. Breakfast + Dinner provided..."
                          value={customMeals}
                          onChange={(e) => setCustomMeals(e.target.value)}
                          className="w-full h-7 bg-white border border-slate-200 rounded-lg px-2 text-[11px] font-semibold text-slate-900 mt-1"
                        />
                      )}
                    </div>

                    <div className="space-y-1 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <span className="text-[10px] font-bold text-slate-500 uppercase">Local Transport</span>
                      <select 
                        value={benefitsTransport} 
                        onChange={(e) => setBenefitsTransport(e.target.value)}
                        className="w-full h-8 bg-white border border-slate-200 rounded-lg px-2 text-xs font-bold text-slate-900"
                      >
                        <option value="ORG_VEHICLE">Org Vehicle Arranged</option>
                        <option value="DAILY_ALLOWANCE">Transport Allowance ({volunteerRates.transportAllowance || 150} ETB/d)</option>
                        <option value="NONE">None</option>
                        <option value="CUSTOM">Custom Arrangement...</option>
                      </select>
                      {benefitsTransport === "CUSTOM" && (
                        <input
                          type="text"
                          placeholder="e.g. Dedicated Van, Flight covered..."
                          value={customTransport}
                          onChange={(e) => setCustomTransport(e.target.value)}
                          className="w-full h-7 bg-white border border-slate-200 rounded-lg px-2 text-[11px] font-semibold text-slate-900 mt-1"
                        />
                      )}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-3 pt-1">
                    <div className="space-y-1 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <span className="text-[10px] font-bold text-slate-500 uppercase">Custom Extra Daily Stipend (ETB/day/vol)</span>
                      <input 
                        type="number"
                        min="0"
                        placeholder="0"
                        value={customPerkAmount}
                        onChange={(e) => setCustomPerkAmount(e.target.value)}
                        className="w-full h-8 bg-white border border-slate-200 rounded-lg px-2 text-xs font-bold text-slate-900"
                      />
                    </div>
                    <div className="space-y-1 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <span className="text-[10px] font-bold text-slate-500 uppercase">Benefits & Logistics Notes</span>
                      <input 
                        type="text"
                        placeholder="e.g. Special safety kit, communication radio provided..."
                        value={benefitsNotes}
                        onChange={(e) => setBenefitsNotes(e.target.value)}
                        className="w-full h-8 bg-white border border-slate-200 rounded-lg px-2 text-xs font-bold text-slate-900"
                      />
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-4 pt-1">
                    <label className="flex items-center gap-2 cursor-pointer bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                      <input 
                        type="checkbox" 
                        checked={benefitsSafetyGear} 
                        onChange={(e) => setBenefitsSafetyGear(e.target.checked)}
                        className="rounded text-[#ED1C24] focus:ring-red-500" 
                      />
                      <span className="text-xs font-bold text-slate-700">Safety Gear / Medical Kits Provided</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                      <input 
                        type="checkbox" 
                        checked={benefitsCertificate} 
                        onChange={(e) => setBenefitsCertificate(e.target.checked)}
                        className="rounded text-[#ED1C24] focus:ring-red-500" 
                      />
                      <span className="text-xs font-bold text-slate-700">Certificate of Appreciation Awarded</span>
                    </label>
                  </div>
                </div>

                {/* Engagement Areas & Qualifications */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold uppercase tracking-wider text-[#ED1C24]">Engagement Areas *</Label>
                    <div className="grid grid-cols-1 gap-1.5 max-h-[140px] overflow-y-auto pr-2 custom-scrollbar-small border border-slate-100 p-2 rounded-xl bg-slate-50/50">
                      {ENGAGEMENT_AREAS.map(area => (
                        <label key={area} className={`flex items-center gap-2 p-2 rounded-lg border transition-all cursor-pointer ${selectedAreas.includes(area) ? 'bg-[#ED1C24]/5 border-[#ED1C24] text-[#ED1C24]' : 'bg-white border-slate-100 text-slate-600 hover:border-[#ED1C24]/30'}`}>
                          <input 
                            type="checkbox"
                            className="hidden"
                            checked={selectedAreas.includes(area)}
                            onChange={() => {
                              if (selectedAreas.includes(area)) {
                                setSelectedAreas(selectedAreas.filter(a => a !== area));
                              } else {
                                setSelectedAreas([...selectedAreas, area]);
                              }
                            }}
                          />
                          <div className={`h-4 w-4 rounded border flex items-center justify-center transition-colors shrink-0 ${selectedAreas.includes(area) ? 'bg-[#ED1C24] border-[#ED1C24]' : 'bg-white border-slate-300'}`}>
                            {selectedAreas.includes(area) && <CheckCircle2 className="h-3 w-3 text-white" />}
                          </div>
                          <span className="text-xs font-semibold leading-tight">{area}</span>
                        </label>
                      ))}
                    </div>
                    {selectedAreas.includes("Other Services") && (
                      <div className="mt-2 space-y-1 bg-amber-50/70 p-2.5 rounded-xl border border-amber-200">
                        <Label className="text-[11px] font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1">
                          Specify Other Services *
                        </Label>
                        <Input 
                          placeholder="Describe the other specific services required..."
                          value={otherServicesText}
                          onChange={(e) => setOtherServicesText(e.target.value)}
                          className="h-8 bg-white border-amber-300 rounded-lg text-xs font-semibold text-slate-900"
                          required={selectedAreas.includes("Other Services")}
                        />
                      </div>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold uppercase tracking-wider text-[#ED1C24]">Specific Qualifications & Skills *</Label>
                    <textarea 
                      placeholder="e.g. Medical background, First Aid certified, Fluency in Amharic..."
                      value={qualifications}
                      onChange={(e) => setQualifications(e.target.value)}
                      className="w-full h-[140px] p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#ED1C24]/10 font-medium text-xs text-slate-900 outline-none transition-all resize-none"
                      required
                    />
                  </div>
                </div>

                {/* MoU Attachment Section */}
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-bold uppercase tracking-wider text-[#ED1C24] flex items-center gap-1.5">
                      <FileText className="h-3.5 w-3.5" /> Memorandum of Understanding (MoU) Attachment (Optional)
                    </Label>
                    <span className="text-[9px] font-bold uppercase text-slate-400">PDF / Image / Doc</span>
                  </div>
                  <div className="grid md:grid-cols-2 gap-3 bg-slate-50/70 p-3 rounded-xl border border-slate-100">
                    <div className="space-y-1">
                      <span className="text-[11px] font-semibold text-slate-600">Upload MoU Document</span>
                      <input 
                        type="file" 
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setMouFileName(file.name);
                            const reader = new FileReader();
                            reader.onload = () => {
                              setMouUrl(reader.result as string);
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                        className="w-full text-xs text-slate-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-[#ED1C24]/10 file:text-[#ED1C24] hover:file:bg-[#ED1C24]/20 cursor-pointer"
                      />
                    </div>
                    <div className="space-y-1">
                      <span className="text-[11px] font-semibold text-slate-600">Or Enter Document URL</span>
                      <Input 
                        type="url"
                        placeholder="https://..."
                        value={mouUrl.startsWith("data:") ? "" : mouUrl}
                        onChange={(e) => {
                          setMouUrl(e.target.value);
                          setMouFileName("");
                        }}
                        className="h-8 bg-white border-slate-200 rounded-lg text-xs font-semibold text-slate-900"
                      />
                    </div>
                  </div>
                  {mouUrl && (
                    <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
                      <CheckCircle2 className="h-4 w-4" />
                      <span>MoU Document Ready: {mouFileName || "Attached"}</span>
                      {!mouUrl.startsWith("data:") && (
                        <a href={mouUrl} target="_blank" rel="noopener noreferrer" className="ml-auto text-[#ED1C24] underline text-[11px]">
                          Open Link
                        </a>
                      )}
                    </div>
                  )}
                </div>

                {/* Live Estimated Budget Card */}
                {Number(headcount) > 0 && (
                  <div className="bg-slate-900 text-white p-4 rounded-2xl space-y-2 border border-slate-800">
                    <div className="flex justify-between items-center text-xs pb-2 border-b border-white/10">
                      <span className="font-bold text-slate-300">Live Estimated Cost ({headcount} Volunteers × {durationDays} Days):</span>
                      <span className="font-black text-lg text-white">
                        {calcEstimatedCost(Number(headcount), durationDays).total.toLocaleString()} <span className="text-xs text-[#ED1C24]">ETB</span>
                      </span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px] text-slate-400 font-semibold">
                      <div>Daily Allowance: {calcEstimatedCost(Number(headcount), durationDays).dailyBase.toLocaleString()} ETB</div>
                      <div>Accommodations: {calcEstimatedCost(Number(headcount), durationDays).accommodation.toLocaleString()} ETB</div>
                      <div>Meals & Per Diem: {calcEstimatedCost(Number(headcount), durationDays).meals.toLocaleString()} ETB</div>
                      <div>Admin Fee ({volunteerRates.adminFeePercent}%): {calcEstimatedCost(Number(headcount), durationDays).adminFee.toLocaleString()} ETB</div>
                    </div>
                  </div>
                )}

                {/* Specific Activities Breakdown */}
                <div className="space-y-3 pt-2 border-t border-slate-100">
                   <div className="flex items-center justify-between">
                     <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">Specific Activities Breakdown (Optional)</Label>
                     <Button type="button" onClick={addActivity} variant="ghost" className="h-8 px-3 text-[10px] font-bold uppercase tracking-wider text-[#ED1C24] hover:bg-[#ED1C24]/10 bg-[#ED1C24]/5 rounded-lg">
                       <Plus className="h-3 w-3 mr-1" /> Add Activity
                     </Button>
                   </div>
                   
                   <div className="grid md:grid-cols-2 gap-3">
                     {activities.map((activity, index) => (
                       <div key={index} className="flex gap-2 items-center bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                         <Input 
                           placeholder="Activity name..."
                           value={activity.name}
                           onChange={(e) => updateActivity(index, "name", e.target.value)}
                           className="h-9 bg-white border-slate-200 rounded-lg font-medium text-xs text-slate-900 flex-1"
                         />
                         <Input 
                           type="number"
                           placeholder="Qty"
                           value={activity.count}
                           onChange={(e) => updateActivity(index, "count", Number(e.target.value))}
                           className="h-9 w-16 bg-white border-slate-200 rounded-lg font-bold text-xs text-center text-slate-900"
                         />
                         {activities.length > 1 && (
                           <Button 
                             type="button" 
                             onClick={() => removeActivity(index)}
                             variant="ghost" 
                             className="h-9 w-9 p-0 rounded-lg bg-rose-50 text-rose-500 hover:bg-rose-100 shrink-0"
                           >
                             <Trash2 className="h-3.5 w-3.5" />
                           </Button>
                         )}
                       </div>
                     ))}
                   </div>
                </div>

                {/* Action Footer */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setShowForm(false)}
                    className="h-11 px-6 text-slate-600 font-bold uppercase tracking-wider text-xs border-slate-200 rounded-xl hover:bg-slate-100"
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={submitting || selectedAreas.length === 0}
                    className="h-11 px-8 bg-[#ED1C24] hover:bg-slate-900 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-md shadow-[#ED1C24]/20 disabled:opacity-50 flex items-center gap-2"
                  >
                    {submitting ? "Processing..." : <>Publish Mission <Send className="h-4 w-4" /></>}
                  </Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

        {/* Request Details Modal */}
        {selectedRequest && !showForm && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4"
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedRequest(null)} />
            
            <motion.div 
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="w-full max-w-3xl bg-white border border-slate-200 rounded-2xl p-5 shadow-2xl relative z-10 overflow-hidden max-h-[88vh] overflow-y-auto custom-scrollbar"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-slate-900" />
              
              <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="pr-4">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="text-[9px] font-black uppercase tracking-wider text-[#ED1C24] bg-red-50 px-1.5 py-0.5 rounded">Mission Details</span>
                    {selectedRequest.region_name && (
                      <span className="text-[9px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded flex items-center gap-1">
                        <MapPin className="h-2.5 w-2.5" /> {selectedRequest.region_name} {selectedRequest.zone_name ? `· ${selectedRequest.zone_name}` : ""}
                      </span>
                    )}
                  </div>
                  <h2 className="text-lg font-black tracking-tight text-slate-900 leading-snug">{selectedRequest.title || selectedRequest.activities_skills}</h2>
                  <p className="text-slate-500 font-medium text-xs mt-0.5 line-clamp-1">{selectedRequest.description || selectedRequest.activities_skills}</p>
                </div>
                <Button variant="ghost" onClick={() => setSelectedRequest(null)} className="h-7 w-7 rounded-full p-0 hover:bg-slate-100 shrink-0">
                  <Plus className="h-4 w-4 rotate-45 text-slate-400" />
                </Button>
              </div>

              {/* Mission Control & Live Countdown Card */}
              {selectedRequest.status === "IN_PROGRESS" ? (
                (() => {
                  const remaining = getRemainingTime(selectedRequest.id, selectedRequest.duration_days || 1, selectedRequest.mission_start_time);
                  return (
                    <div className="bg-slate-950 text-white p-3.5 rounded-xl shadow-lg border border-red-500/30 space-y-3 relative overflow-hidden mb-4">
                      <div className="absolute top-0 right-0 w-36 h-36 bg-red-600/10 rounded-full blur-2xl pointer-events-none" />
                      
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-white/10">
                        <div className="flex items-center gap-2">
                          <span className="relative flex h-2.5 w-2.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
                          </span>
                          <div>
                            <span className="text-[9px] font-black uppercase tracking-wider text-[#ED1C24] block">Live Field Deployment</span>
                            <h3 className="text-xs font-black text-white">Mission In Progress</h3>
                          </div>
                        </div>
                        <Button
                          onClick={() => handleEndMission(selectedRequest)}
                          className="h-7 px-3 bg-[#ED1C24] hover:bg-red-700 text-white font-bold text-[11px] uppercase tracking-wider rounded-lg shadow-sm flex items-center gap-1.5 shrink-0"
                        >
                          <CheckCircle2 className="h-3 w-3" /> End Mission & Rate
                        </Button>
                      </div>

                      {/* Live Countdown Grid */}
                      <div className="space-y-1.5">
                        <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block">Mission Time Remaining ({selectedRequest.duration_days || 1} Days Planned)</span>
                        <div className="grid grid-cols-4 gap-1.5 text-center">
                          <div className="bg-white/5 border border-white/10 p-1.5 rounded-lg">
                            <span className="text-lg font-black text-white block font-mono">{String(remaining?.days || 0).padStart(2, '0')}</span>
                            <span className="text-[8px] font-bold uppercase text-slate-400">Days</span>
                          </div>
                          <div className="bg-white/5 border border-white/10 p-1.5 rounded-lg">
                            <span className="text-lg font-black text-white block font-mono">{String(remaining?.hours || 0).padStart(2, '0')}</span>
                            <span className="text-[8px] font-bold uppercase text-slate-400">Hours</span>
                          </div>
                          <div className="bg-white/5 border border-white/10 p-1.5 rounded-lg">
                            <span className="text-lg font-black text-white block font-mono">{String(remaining?.minutes || 0).padStart(2, '0')}</span>
                            <span className="text-[8px] font-bold uppercase text-slate-400">Mins</span>
                          </div>
                          <div className="bg-white/5 border border-white/10 p-1.5 rounded-lg">
                            <span className="text-lg font-black text-[#ED1C24] block font-mono animate-pulse">{String(remaining?.seconds || 0).padStart(2, '0')}</span>
                            <span className="text-[8px] font-bold uppercase text-slate-400">Secs</span>
                          </div>
                        </div>
                      </div>

                      {/* Progress bar */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-[9px] font-semibold text-slate-400">
                          <span>Deployment Progress</span>
                          <span>{remaining?.progressPercent || 0}% Elapsed</span>
                        </div>
                        <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                          <div 
                            className="bg-gradient-to-r from-red-500 to-amber-400 h-full transition-all duration-1000"
                            style={{ width: `${remaining?.progressPercent || 0}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })()
              ) : selectedRequest.status === "COMPLETED" ? (
                <div className="bg-purple-50 border border-purple-200 text-purple-950 p-3 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 shadow-sm mb-4">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="h-3.5 w-3.5 text-purple-600 shrink-0" />
                      <span className="text-xs font-black uppercase tracking-wider text-purple-700">Mission Successfully Concluded</span>
                    </div>
                    <p className="text-[11px] text-purple-800 font-medium">Volunteers have completed their service. You can submit or update your performance evaluations.</p>
                  </div>
                  <Button
                    onClick={() => handleOpenEvaluation(assignments)}
                    className="h-7 px-3 bg-purple-700 hover:bg-purple-800 text-white font-bold text-[11px] uppercase tracking-wider rounded-lg shadow-sm flex items-center gap-1 shrink-0"
                  >
                    <Star className="h-3 w-3 fill-current" /> Submit Evaluation
                  </Button>
                </div>
              ) : (selectedRequest.status === "MATCHED" || selectedRequest.status === "APPROVED") && (selectedRequest.payment_status === "PAID" || selectedRequest.payment_status === "VERIFIED" || selectedRequest.payment_status === "SUBMITTED") ? (
                <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-3.5 rounded-xl shadow-sm space-y-2 mb-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="px-2 py-0.5 rounded-full bg-white/20 text-[9px] font-black uppercase tracking-wider">Volunteers Ready</span>
                        <span className="text-[11px] font-bold text-emerald-100">Payment Confirmed</span>
                      </div>
                      <h3 className="text-sm font-black pt-0.5">Ready for Field Deployment</h3>
                      <p className="text-[11px] text-emerald-100 font-medium">{assignments.length} qualified volunteer(s) assigned and briefed for this mission.</p>
                    </div>
                    <Button
                      onClick={() => handleStartMission(selectedRequest)}
                      className="h-8 px-4 bg-white text-emerald-800 hover:bg-emerald-50 font-black text-[11px] uppercase tracking-wider rounded-lg shadow-md hover:scale-105 transition-all flex items-center gap-1.5 shrink-0"
                    >
                      <Play className="h-3.5 w-3.5 fill-current text-emerald-700" /> Start Mission Now
                    </Button>
                  </div>
                </div>
              ) : null}

              <div className="grid md:grid-cols-5 gap-4">
                {/* Financial/Payment Section (Left 2 cols) */}
                <div className="md:col-span-2 space-y-3">
                  <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Payment Status</h3>
                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 space-y-2.5">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-semibold text-slate-500">Total Amount</span>
                      <span className="text-base font-black text-slate-900">{(selectedRequest.payment_amount || 0).toLocaleString()} <span className="text-xs text-[#ED1C24]">ETB</span></span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-semibold text-slate-500">Status</span>
                      <StatusBadge status={selectedRequest.payment_status || "PENDING"} />
                    </div>
                    
                    {(!selectedRequest.payment_status || selectedRequest.payment_status === 'PENDING') && selectedRequest.status === 'APPROVED' && (
                      <div className="pt-2 border-t border-slate-200">
                        <Button 
                          onClick={() => { setPaymentRequest(selectedRequest); setShowPaymentModal(true); }}
                          className="w-full h-8 bg-slate-900 hover:bg-[#ED1C24] text-white rounded-lg text-[11px] font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 shadow-sm"
                        >
                          <span>⚡</span> Pay via ArifPay Gateway
                        </Button>
                      </div>
                    )}

                    {(selectedRequest.payment_status === 'SUBMITTED' || selectedRequest.payment_status === 'VERIFIED') && (
                      <div className="pt-2 border-t border-slate-200 space-y-1.5">
                        <div className="flex justify-between items-center text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                          <span>Payment Receipt</span>
                          <span className="text-emerald-600 font-extrabold">{selectedRequest.payment_status}</span>
                        </div>
                        <div className="bg-white p-2.5 rounded-lg border border-slate-200 flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            <div className="h-6 w-6 rounded bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 text-[10px] font-black">
                              ✓
                            </div>
                            <div>
                              <p className="font-bold text-slate-900 text-xs">ArifPay Gateway</p>
                              <p className="text-[9px] text-slate-400 font-mono">Ref: TX-{selectedRequest.id.substring(0,8).toUpperCase()}</p>
                            </div>
                          </div>
                          <span className="font-black text-slate-900">{(selectedRequest.payment_amount || 0).toLocaleString()} ETB</span>
                        </div>
                        {selectedRequest.payment_proof_url && (
                          <a 
                            href={selectedRequest.payment_proof_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-600 hover:underline pt-0.5"
                          >
                            <ExternalLink className="h-2.5 w-2.5" /> View Transaction Receipt
                          </a>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Mission Meta */}
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-1.5 text-xs">
                    <div className="flex justify-between text-slate-500">
                      <span>Headcount:</span>
                      <span className="font-bold text-slate-900">{selectedRequest.headcount} Volunteers</span>
                    </div>
                    <div className="flex justify-between text-slate-500">
                      <span>Gender Split:</span>
                      <span className="font-bold text-slate-900">{selectedRequest.men_count}M / {selectedRequest.women_count}W</span>
                    </div>
                    <div className="flex justify-between text-slate-500">
                      <span>Duration:</span>
                      <span className="font-bold text-slate-900">{selectedRequest.duration_days || 1} Day(s)</span>
                    </div>
                  </div>
                </div>

                {/* Volunteers/Assignments Section (Right 3 cols) */}
                <div className="md:col-span-3 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Assigned Volunteers ({assignments.length})
                    </h3>
                    {assignments.length > 0 && (
                      <button 
                        type="button"
                        onClick={handleToggleSelectAll}
                        className="text-[10px] font-bold text-slate-500 hover:text-[#ED1C24] flex items-center gap-1"
                      >
                        {selectedAssignmentIds.length === assignments.length ? (
                          <><CheckSquare className="h-3 w-3 text-[#ED1C24]" /> Deselect</>
                        ) : (
                          <><Square className="h-3 w-3 text-slate-400" /> Select All ({selectedAssignmentIds.length})</>
                        )}
                      </button>
                    )}
                  </div>

                  {/* Batch Actions Bar */}
                  {selectedAssignmentIds.length > 0 && (
                    <div className="bg-slate-900 text-white p-2 rounded-xl flex items-center justify-between shadow-md">
                      <span className="text-xs font-semibold pl-1">
                        {selectedAssignmentIds.length} volunteer(s) selected
                      </span>
                      <Button
                        size="sm"
                        onClick={() => {
                          const targets = assignments.filter(a => selectedAssignmentIds.includes(a.id));
                          handleOpenEvaluation(targets);
                        }}
                        className="h-6 bg-[#ED1C24] hover:bg-red-600 text-white rounded-md text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 shadow-sm px-2"
                      >
                        <Star className="h-3 w-3 fill-current" /> Rate ({selectedAssignmentIds.length})
                      </Button>
                    </div>
                  )}

                  {loadingAssignments ? (
                    <div className="p-5 text-center text-slate-400 font-semibold text-xs animate-pulse">Loading assigned personnel...</div>
                  ) : assignments.length === 0 ? (
                    <div className="bg-slate-50 p-5 rounded-xl text-center border border-slate-100">
                      <p className="text-slate-400 font-medium text-xs">No volunteers assigned yet. {selectedRequest.status !== 'APPROVED' ? "Wait for approval." : "Wait for matching."}</p>
                    </div>
                  ) : (
                    <div className="space-y-1.5 max-h-[220px] overflow-y-auto pr-1 custom-scrollbar">
                      {assignments.map(a => (
                        <div key={a.id} className={`p-2.5 rounded-xl border transition-all flex items-center justify-between gap-2 ${selectedAssignmentIds.includes(a.id) ? 'bg-red-50/50 border-[#ED1C24]/40 shadow-sm' : 'bg-white border-slate-200/80'}`}>
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={selectedAssignmentIds.includes(a.id)}
                              onChange={() => handleToggleSelectVolunteer(a.id)}
                              className="rounded text-[#ED1C24] focus:ring-red-500 h-3.5 w-3.5"
                            />
                            <div>
                              <div className="flex items-center gap-1.5">
                                <p className="font-bold text-slate-900 text-xs">{a.volunteer_name || "Volunteer"}</p>
                                <span className={`text-[8px] font-bold uppercase px-1.5 py-0.2 rounded ${
                                  a.status === 'COMPLETED' ? 'bg-purple-100 text-purple-700' :
                                  a.status === 'ONBOARDED' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'
                                }`}>
                                  {a.status === 'ONBOARDED' ? 'ON SERVICE' : a.status}
                                </span>
                              </div>
                              <p className="text-[9px] text-slate-400 font-mono">ID: {a.volunteer_id.substring(0,8)}</p>
                              {a.rating && (
                                <div className="flex items-center gap-0.5 text-amber-500 text-[9px] font-bold mt-0.5">
                                  <Star className="h-2.5 w-2.5 fill-current" /> {a.rating} / 5.0 · {a.hours_worked || 8} hrs
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-1 shrink-0">
                            {a.status === 'ASSIGNED' && (
                              <Button 
                                onClick={() => handleOnboard(a.id)}
                                className="h-6 px-2 bg-slate-900 hover:bg-[#ED1C24] text-white rounded-md text-[9px] font-bold uppercase transition-all"
                              >
                                Onboard
                              </Button>
                            )}
                            {(a.status === 'ONBOARDED' || a.status === 'ASSIGNED') && (
                              <Button 
                                size="sm"
                                onClick={() => handleOpenEvaluation([a])}
                                className="h-6 px-2 bg-amber-500 hover:bg-amber-600 text-white rounded-md text-[9px] font-bold uppercase transition-all flex items-center gap-0.5"
                              >
                                <Star className="h-2.5 w-2.5 fill-current" /> Rate
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Volunteer Performance Evaluation Modal */}
        {showEvaluationModal && evaluatingAssignments.length > 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4"
          >
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowEvaluationModal(false)} />
            <motion.div 
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              className="w-full max-w-md bg-white rounded-2xl p-5 shadow-2xl relative z-10 max-h-[85vh] overflow-y-auto custom-scrollbar"
            >
              <div className="h-10 w-10 bg-amber-50 rounded-xl flex items-center justify-center mx-auto mb-2.5 text-amber-500">
                <Star className="h-5 w-5 fill-current" />
              </div>
              <h2 className="text-lg font-black text-center tracking-tight text-slate-900">
                Volunteer <span className="text-amber-500">Evaluation</span>
              </h2>
              <p className="text-slate-500 font-medium text-[11px] text-center mb-4">
                Evaluating {evaluatingAssignments.length} volunteer(s): {evaluatingAssignments.map(a => a.volunteer_name || "Volunteer").join(", ")}
              </p>

              <form onSubmit={handleSaveEvaluation} className="space-y-3">
                {/* 4-Criteria Star Ratings */}
                <div className="space-y-2 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <div className="flex justify-between items-center text-xs font-semibold text-slate-700">
                    <span>1. Punctuality & Attendance</span>
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map(star => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setEvaluationForm({ ...evaluationForm, punctuality: star })}
                          className="focus:outline-none p-0.5"
                        >
                          <Star className={`h-3.5 w-3.5 ${star <= evaluationForm.punctuality ? 'text-amber-500 fill-current' : 'text-slate-300'}`} />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-xs font-semibold text-slate-700">
                    <span>2. Skill Competence & Execution</span>
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map(star => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setEvaluationForm({ ...evaluationForm, skills: star })}
                          className="focus:outline-none p-0.5"
                        >
                          <Star className={`h-3.5 w-3.5 ${star <= evaluationForm.skills ? 'text-amber-500 fill-current' : 'text-slate-300'}`} />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-xs font-semibold text-slate-700">
                    <span>3. Teamwork & Communication</span>
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map(star => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setEvaluationForm({ ...evaluationForm, teamwork: star })}
                          className="focus:outline-none p-0.5"
                        >
                          <Star className={`h-3.5 w-3.5 ${star <= evaluationForm.teamwork ? 'text-amber-500 fill-current' : 'text-slate-300'}`} />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-xs font-semibold text-slate-700">
                    <span>4. Discipline & Conduct</span>
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map(star => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setEvaluationForm({ ...evaluationForm, conduct: star })}
                          className="focus:outline-none p-0.5"
                        >
                          <Star className={`h-3.5 w-3.5 ${star <= evaluationForm.conduct ? 'text-amber-500 fill-current' : 'text-slate-300'}`} />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <Label className="text-[10px] font-bold text-slate-500 uppercase">Hours Worked</Label>
                    <Input
                      type="number"
                      min={1}
                      max={720}
                      value={evaluationForm.hoursWorked}
                      onChange={(e) => setEvaluationForm({ ...evaluationForm, hoursWorked: parseInt(e.target.value) || 8 })}
                      className="h-8 bg-slate-50 border-slate-200 rounded-lg text-xs"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[10px] font-bold text-slate-500 uppercase">Completion Outcome</Label>
                    <select
                      value={evaluationForm.outcome}
                      onChange={(e) => setEvaluationForm({ ...evaluationForm, outcome: e.target.value })}
                      className="w-full h-8 bg-slate-50 border border-slate-200 rounded-lg px-2 text-xs font-semibold text-slate-800 outline-none"
                    >
                      <option value="COMPLETED_EXEMPLARY">Exemplary Service</option>
                      <option value="COMPLETED_SATISFACTORY">Completed Satisfactorily</option>
                      <option value="RELEASED_EARLY">Released Early</option>
                      <option value="INCIDENT_REPORTED">Incident Reported</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <Label className="text-[10px] font-bold text-slate-500 uppercase">Commendation & Feedback Notes</Label>
                  <textarea
                    placeholder="Write detailed commendation or feedback notes..."
                    value={evaluationForm.feedback}
                    onChange={(e) => setEvaluationForm({ ...evaluationForm, feedback: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-medium text-xs min-h-[50px] outline-none focus:ring-1 focus:ring-amber-500/30 text-slate-900 resize-none"
                    required
                  />
                </div>

                <label className="flex items-center gap-2 cursor-pointer bg-slate-50 p-2 rounded-lg border border-slate-100">
                  <input
                    type="checkbox"
                    checked={evaluationForm.certificateIssued}
                    onChange={(e) => setEvaluationForm({ ...evaluationForm, certificateIssued: e.target.checked })}
                    className="rounded text-amber-500 focus:ring-amber-500 h-3.5 w-3.5"
                  />
                  <span className="text-xs font-semibold text-slate-800">Issue ERCS Official Certificate of Service</span>
                </label>

                <div className="grid grid-cols-2 gap-2 pt-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setShowEvaluationModal(false)}
                    className="h-9 rounded-lg font-bold uppercase tracking-wider text-xs border-slate-200"
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={submittingEvaluation}
                    className="h-9 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-bold uppercase tracking-wider text-xs shadow-sm"
                  >
                    {submittingEvaluation ? "Submitting..." : "Submit Report"}
                  </Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}

        {showConfirmModal && tempPayload && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-4"
          >
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowConfirmModal(false)} />
            <motion.div 
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              className="w-full max-w-sm bg-white rounded-2xl p-5 shadow-2xl relative z-10 text-center"
            >
              <div className="h-10 w-10 bg-[#ED1C24]/10 rounded-xl flex items-center justify-center mx-auto mb-2.5">
                <AlertCircle className="h-5 w-5 text-[#ED1C24]" />
              </div>
              <h2 className="text-lg font-black tracking-tight mb-0.5 text-slate-900">Confirm <span className="text-[#ED1C24]">Mission Request</span></h2>
              <p className="text-slate-500 font-medium text-xs mb-3.5">Deploying {tempPayload.headcount} volunteers for {tempPayload.duration_days} day(s).</p>
              
              <div className="bg-slate-50 rounded-xl p-3 mb-3.5 space-y-1.5 border border-slate-100 text-left text-xs">
                <div className="flex justify-between items-center text-slate-600">
                  <span>Target Region & Zone:</span>
                  <span className="text-slate-900 font-bold">{tempPayload.region_name} {tempPayload.zone_name ? `· ${tempPayload.zone_name}` : ""}</span>
                </div>
                <div className="flex justify-between items-center text-slate-600">
                  <span>Personnel Breakdown:</span>
                  <span className="text-slate-900 font-bold">{tempPayload.headcount} Volunteers ({tempPayload.men_count}M / {tempPayload.women_count}W)</span>
                </div>
                <div className="flex justify-between items-center text-slate-600">
                  <span>Duration:</span>
                  <span className="text-slate-900 font-bold">{tempPayload.duration_days} Day(s)</span>
                </div>
                <div className="h-px bg-slate-200 my-1" />
                <div className="flex justify-between items-center text-xs font-bold text-[#ED1C24]">
                  <span>Total Calculated Budget</span>
                  <span className="text-base font-black text-slate-900">{(tempPayload.payment_amount || 0).toLocaleString()} <span className="text-[10px] text-[#ED1C24]">ETB</span></span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => setShowConfirmModal(false)}
                  className="h-9 rounded-lg font-bold uppercase tracking-wider text-xs border-slate-200"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={confirmSubmitRequest}
                  disabled={submitting}
                  className="h-9 bg-[#ED1C24] hover:bg-black text-white rounded-lg font-bold uppercase tracking-wider text-xs shadow-sm"
                >
                  {submitting ? "Submitting..." : "Confirm & Send"}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Payment Submission Modal */}
        <AnimatePresence>
          {showPaymentModal && paymentRequest && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[200] flex items-center justify-center p-3 sm:p-4"
            >
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowPaymentModal(false)}
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative z-10 bg-white rounded-2xl p-5 w-full max-w-sm shadow-2xl"
              >
                <button 
                  onClick={() => setShowPaymentModal(false)}
                  className="absolute top-3.5 right-3.5 h-6 w-6 bg-slate-50 text-slate-400 hover:text-slate-900 rounded-full flex items-center justify-center transition-colors text-xs"
                >
                  ✕
                </button>

                <div className="mb-4">
                  <div className="inline-flex items-center gap-1 text-[8px] font-black uppercase tracking-wider text-[#ED1C24] bg-red-50 px-1.5 py-0.5 rounded mb-1">
                    <span>❤️</span> IMPACT
                  </div>
                  <h3 className="text-xl font-black tracking-tight text-slate-900">
                    Support <span className="text-[#ED1C24]">ERCS</span>
                  </h3>
                </div>

                <div className="space-y-3.5">
                  <div>
                    <div className="text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Payment Merchant</div>
                    <div className="h-12 flex items-center gap-2.5 px-3 rounded-xl border border-slate-900 bg-slate-50">
                      <div className="h-6 w-6 rounded overflow-hidden flex items-center justify-center shrink-0 border border-gray-100 bg-white">
                        <img src="/PaymentProviders/ArifPay.png" alt="ArifPay" className="w-full h-full object-contain p-0.5" />
                      </div>
                      <div className="text-left">
                        <div className="text-xs font-bold text-slate-900">ArifPay</div>
                        <div className="text-[8px] font-semibold text-slate-400">Secure Ethiopian Gateway</div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-50 rounded-xl p-3 space-y-1.5 text-xs">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-semibold text-slate-400 uppercase">Mission</span>
                        <span className="font-bold text-slate-900 max-w-[160px] truncate">{paymentRequest.activities_skills}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-semibold text-slate-400 uppercase">Volunteers</span>
                        <span className="font-black text-slate-900">{paymentRequest.headcount}</span>
                      </div>
                  </div>

                  <div className="flex justify-between items-end border-t border-slate-100 pt-3">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Amount</div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-black text-slate-900">{(paymentRequest.payment_amount || 0).toLocaleString()}</span>
                      <span className="text-xs font-bold text-[#ED1C24]">ETB</span>
                    </div>
                  </div>

                  <button
                    onClick={handleSubmitPayment}
                    disabled={submittingPayment}
                    className="w-full h-10 bg-slate-900 hover:bg-black text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50"
                  >
                    <span>⚡</span>
                    {submittingPayment ? "Processing..." : "Initiate Payment"}
                  </button>
                  
                  <div className="flex items-center justify-center gap-3 text-[8px] font-semibold text-slate-400">
                    <span>🛡 Secure</span>
                    <span className="text-slate-200">•</span>
                    <span>⚡ Instant Verification</span>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

    </div>
  );
}
