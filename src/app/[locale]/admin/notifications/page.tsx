"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Search,
  Bell,
  Send,
  Mail,
  Map,
  Users,
  Settings,
  X,
  RefreshCcw,
  Smartphone,
  MessageSquare,
  Radio,
  CheckCircle2,
  ChevronRight,
  Info,
} from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";
import { cn } from "@/lib/utils";
import { DesktopPushToggle } from "@/components/notifications/DesktopPushToggle";

type Notification = {
  id: string;
  name: string;
  message: string;
  channel: "SMS" | "EMAIL" | "PUSH";
  created_at: string;
  recipients_count: number;
};

const REGIONS = [
  "Addis Ababa",
  "Amhara",
  "Oromia",
  "Tigray",
  "Somali",
  "Sidama",
  "Afar",
  "Dire Dawa",
  "Central Ethiopia",
  "South Ethiopia",
];

const TEMPLATES = [
  { id: "renew", name: "Membership Renewal", code: "MembershipRenewal", active: true },
  { id: "expire_warn", name: "Expiration Warning", code: "MembershipExpirationWarning", active: true },
  { id: "reject", name: "ID Card Rejected", code: "IdCardRejected", active: true },
  { id: "birthday", name: "Birthday Wish", code: "BirthdayWish", active: true },
  { id: "expired", name: "Membership Expired", code: "MembershipExpired", active: true },
  { id: "register", name: "Member Registration", code: "MemberRegistration", active: true },
  { id: "approve", name: "ID Card Approved", code: "IdCardApproved", active: true },
];

const VARIABLES = [
  { tag: "{{memberName}}", desc: "Member Full Name" },
  { tag: "{{memberId}}", desc: "Membership ID" },
  { tag: "{{phoneNumber}}", desc: "Phone Number" },
  { tag: "{{expiredDate}}", desc: "Expiry Date" },
  { tag: "{{loginUrl}}", desc: "Login URL" },
];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [search, setSearch] = useState("");
  const [channelFilter, setChannelFilter] = useState<string>("ALL");
  const [loading, setLoading] = useState(true);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState(TEMPLATES[0]);
  const [initialBroadcastData, setInitialBroadcastData] = useState<{
    channel?: "PUSH" | "SMS" | "EMAIL";
    region?: string;
    title?: string;
    targetType?: string;
  }>({});

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await api.get("/notifications?page=1&page_size=50");
      setNotifications(res.data.campaigns || []);
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
      // Fallback sample data
      setNotifications([
        { id: "1", name: "Urgent Meeting", message: "Meeting tomorrow for coordinators", channel: "SMS", created_at: "2024-05-12 10:00:00", recipients_count: 142 },
        { id: "2", name: "App Update & Push Alert", message: "Welcome to ERCS digital membership portal.", channel: "PUSH", created_at: "2024-05-10 14:30:00", recipients_count: 1250 },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenBroadcast = (preset?: { channel?: "PUSH" | "SMS" | "EMAIL"; region?: string; title?: string; targetType?: string }) => {
    setInitialBroadcastData(preset || { channel: "PUSH" });
    setShowBroadcastModal(true);
  };

  const filteredNotifications = useMemo(() => {
    return notifications.filter((n) => {
      const matchesSearch =
        n.name.toLowerCase().includes(search.toLowerCase()) ||
        n.message.toLowerCase().includes(search.toLowerCase()) ||
        n.id.toLowerCase().includes(search.toLowerCase());
      const matchesChannel = channelFilter === "ALL" || n.channel === channelFilter;
      return matchesSearch && matchesChannel;
    });
  }, [notifications, search, channelFilter]);

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-2 py-0.5 bg-red-100 text-[#ED1C24] rounded-full text-[9px] font-black uppercase tracking-widest leading-none">
            <Radio className="h-3 w-3 animate-pulse" /> Live Communication
          </div>
          <h1 className="text-3xl font-black text-black tracking-tighter">Notification Center</h1>
          <p className="text-gray-500 font-medium text-sm">Broadcast urgent messages via Push (FCM), SMS, and Email channels.</p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={() => setShowTemplates(true)}
            variant="outline"
            className="rounded-xl h-10 px-5 font-black shadow-sm flex items-center gap-2 border-gray-200 text-black hover:bg-gray-50"
          >
            <Settings className="h-4 w-4 text-gray-500" /> Templates
          </Button>
          <Button
            onClick={() => handleOpenBroadcast({ channel: "PUSH" })}
            className="bg-[#ED1C24] hover:bg-black text-white rounded-xl h-10 px-6 font-black shadow-lg shadow-red-500/20 transition-all flex items-center gap-2"
          >
            <Send className="h-4 w-4" /> New Broadcast
          </Button>
        </div>
      </div>

      {/* Filters and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search broadcasts by title, ID, or content..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-10 pl-10 bg-white text-black border border-gray-200 rounded-xl font-bold text-sm focus:ring-2 focus:ring-[#ED1C24]/10 transition-all shadow-sm"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {["ALL", "PUSH", "SMS", "EMAIL"].map((ch) => (
            <button
              key={ch}
              onClick={() => setChannelFilter(ch)}
              className={cn(
                "px-3 py-1.5 rounded-xl text-xs font-black transition-all",
                channelFilter === ch
                  ? "bg-black text-white shadow-sm"
                  : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
              )}
            >
              {ch === "ALL" ? "All Channels" : ch}
            </button>
          ))}
          <Button
            onClick={fetchNotifications}
            variant="outline"
            size="icon"
            className="h-9 w-9 rounded-xl border-gray-200"
            title="Refresh history"
          >
            <RefreshCcw className={cn("h-4 w-4 text-gray-600", loading && "animate-spin")} />
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Quick Send Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-black text-white rounded-3xl p-6 shadow-xl relative overflow-hidden group border border-gray-800">
            <div className="absolute top-0 right-0 p-4 opacity-5 font-black text-7xl select-none">FCM</div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-red-500/20 text-[#ED1C24] flex items-center justify-center font-bold">
                  <Smartphone className="h-4 w-4" />
                </div>
                <h3 className="text-lg font-black tracking-tight">Push Broadcast</h3>
              </div>
              <DesktopPushToggle compact />
            </div>
            <p className="text-gray-400 font-bold text-xs mb-4 leading-relaxed">
              Reach all mobile app & desktop PWA subscribers instantaneously using Firebase Cloud Messaging.
            </p>
            <div className="flex flex-col gap-2">
              <Button
                onClick={() =>
                  handleOpenBroadcast({
                    channel: "PUSH",
                    title: "Emergency Alert",
                    targetType: "ALL",
                  })
                }
                className="bg-[#ED1C24] hover:bg-white hover:text-black text-white h-10 rounded-xl transition-all font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 shadow-md shadow-red-500/20"
              >
                <Radio className="h-3.5 w-3.5" /> Blast All App Users
              </Button>
              <Button
                onClick={() =>
                  handleOpenBroadcast({
                    channel: "PUSH",
                    title: "Administrative Notice",
                    targetType: "TOPIC",
                  })
                }
                variant="outline"
                className="border-gray-800 text-gray-300 hover:text-white hover:bg-gray-800 h-10 rounded-xl transition-all font-black uppercase text-[10px] tracking-widest"
              >
                Custom Topic Broadcast
              </Button>
            </div>
          </div>

          {/* Regional Targeting Quick Select */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-black flex items-center gap-2">
                <Map className="h-4 w-4 text-[#ED1C24]" /> Regional Targeting
              </h3>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Click to Target</span>
            </div>
            <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1 custom-scrollbar">
              {REGIONS.map((region) => (
                <button
                  key={region}
                  onClick={() =>
                    handleOpenBroadcast({
                      channel: "PUSH",
                      region: region,
                      targetType: "REGION",
                      title: `Notice for ${region} Branch`,
                    })
                  }
                  className="w-full flex items-center justify-between p-2.5 bg-gray-50 hover:bg-red-50/50 hover:border-red-200 transition-all rounded-xl border border-gray-100 text-left group"
                >
                  <span className="font-bold text-xs text-gray-700 group-hover:text-black uppercase tracking-tight">
                    {region}
                  </span>
                  <span className="text-[10px] font-black text-[#ED1C24] flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                    Send <ChevronRight className="h-3 w-3" />
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* History Table */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="h-4 w-4 text-[#ED1C24]" />
                <h2 className="font-black text-sm uppercase tracking-wider text-black">Broadcast History</h2>
              </div>
              <span className="text-xs font-bold text-gray-400">{filteredNotifications.length} Campaigns</span>
            </div>

            <Table>
              <TableHeader className="bg-gray-50/50">
                <TableRow className="hover:bg-transparent border-gray-100">
                  <TableHead className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-gray-500">
                    Campaign
                  </TableHead>
                  <TableHead className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-gray-500">
                    Channel
                  </TableHead>
                  <TableHead className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-gray-500 text-right">
                    Date
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={3} className="h-40 text-center text-xs font-bold text-gray-400">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <RefreshCcw className="h-5 w-5 animate-spin text-[#ED1C24]" />
                        <span>Loading notification history...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredNotifications.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="h-40 text-center text-xs font-bold text-gray-400">
                      No broadcast campaigns found. Click &quot;New Broadcast&quot; to send your first message.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredNotifications.map((n) => (
                    <TableRow
                      key={n.id}
                      onClick={() => setSelectedNotification(n)}
                      className="hover:bg-gray-50/80 transition-colors border-gray-50 cursor-pointer group"
                    >
                      <TableCell className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-black text-black text-sm leading-tight uppercase tracking-tight group-hover:text-[#ED1C24] transition-colors">
                            {n.name}
                          </span>
                          <span className="text-gray-500 font-medium text-xs line-clamp-1 mt-0.5">{n.message}</span>
                          <span className="text-gray-400 font-bold text-[9px] uppercase tracking-widest flex items-center gap-1 mt-1">
                            <Users className="h-3 w-3" /> {n.recipients_count} Estimated Recipients
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        <span
                          className={cn(
                            "px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest inline-flex items-center gap-1",
                            n.channel === "SMS"
                              ? "bg-amber-50 text-amber-700 border border-amber-200"
                              : n.channel === "EMAIL"
                              ? "bg-blue-50 text-blue-700 border border-blue-200"
                              : "bg-red-50 text-[#ED1C24] border border-red-200"
                          )}
                        >
                          {n.channel === "PUSH" && <Smartphone className="h-3 w-3" />}
                          {n.channel === "SMS" && <MessageSquare className="h-3 w-3" />}
                          {n.channel === "EMAIL" && <Mail className="h-3 w-3" />}
                          {n.channel}
                        </span>
                      </TableCell>
                      <TableCell className="px-6 py-4 text-right font-bold text-gray-400 text-xs">
                        {n.created_at}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      {/* Broadcast Creation Modal */}
      {showBroadcastModal && (
        <BroadcastModal
          initialData={initialBroadcastData}
          onClose={() => setShowBroadcastModal(false)}
          onSuccess={() => {
            setShowBroadcastModal(false);
            fetchNotifications();
            toast.success("Broadcast dispatched successfully!");
          }}
        />
      )}

      {/* Campaign Details Modal */}
      {selectedNotification && (
        <NotificationDetailsModal
          notification={selectedNotification}
          onClose={() => setSelectedNotification(null)}
        />
      )}

      {/* Templates Modal */}
      {showTemplates && (
        <TemplatesModal
          templates={TEMPLATES}
          selectedTemplate={selectedTemplate}
          onSelect={setSelectedTemplate}
          onClose={() => setShowTemplates(false)}
        />
      )}
    </div>
  );
}

// Subcomponent: Broadcast Creation Modal
function BroadcastModal({
  initialData,
  onClose,
  onSuccess,
}: {
  initialData?: {
    channel?: "PUSH" | "SMS" | "EMAIL";
    region?: string;
    title?: string;
    targetType?: string;
  };
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [channel, setChannel] = useState<"PUSH" | "SMS" | "EMAIL">(initialData?.channel || "PUSH");
  const [title, setTitle] = useState(initialData?.title || "");
  const [message, setMessage] = useState("");
  const [targetAudience, setTargetAudience] = useState<string>(
    initialData?.targetType || (initialData?.region ? "REGION" : "ALL")
  );
  const [selectedRegion, setSelectedRegion] = useState<string>(initialData?.region || "Addis Ababa");
  const [topicName, setTopicName] = useState<string>("all_users");
  const [singleRecipient, setSingleRecipient] = useState<string>("");
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) {
      toast.error("Please fill in both title and message.");
      return;
    }

    if (targetAudience === "SINGLE" && !singleRecipient.trim()) {
      toast.error("Please enter a recipient phone number or ID.");
      return;
    }

    setSending(true);
    try {
      const payload: Record<string, string> = {
        name: title.trim(),
        title: title.trim(),
        message: message.trim(),
        channel: channel,
        target_type: targetAudience,
      };

      if (targetAudience === "REGION") {
        payload.region = selectedRegion;
        payload.target_value = selectedRegion;
      } else if (targetAudience === "TOPIC") {
        payload.target_value = topicName.trim() || "all_users";
      } else if (targetAudience === "SINGLE") {
        payload.target_value = singleRecipient.trim();
        payload.region = singleRecipient.trim();
      }

      await api.post("/notifications", payload);
      toast.success(targetAudience === "SINGLE" ? `SMS notification sent to ${singleRecipient}` : "Broadcast dispatched successfully!");
      onSuccess();
    } catch (err: unknown) {
      console.error("Failed to send broadcast:", err);
      const errorMsg = err instanceof Error ? err.message : "Failed to dispatch notification.";
      toast.error(errorMsg);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/50 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden border border-gray-100 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-[#ED1C24] text-white flex items-center justify-center font-bold">
              <Send className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-base font-black text-black tracking-tight">New Broadcast Notification</h2>
              <p className="text-[11px] font-bold text-gray-400">Push to Firebase FCM, SMS, or Email</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-400 hover:text-black">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* Channel Selector */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Broadcast Channel</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setChannel("PUSH")}
                className={cn(
                  "p-3 rounded-2xl border text-left transition-all flex flex-col gap-1",
                  channel === "PUSH"
                    ? "border-[#ED1C24] bg-red-50/50 text-[#ED1C24] shadow-sm ring-2 ring-[#ED1C24]/10"
                    : "border-gray-200 hover:bg-gray-50 text-gray-700"
                )}
              >
                <Smartphone className="h-4 w-4" />
                <span className="text-xs font-black">Push (FCM)</span>
                <span className="text-[9px] text-gray-400 font-bold">Mobile App</span>
              </button>

              <button
                type="button"
                onClick={() => setChannel("SMS")}
                className={cn(
                  "p-3 rounded-2xl border text-left transition-all flex flex-col gap-1",
                  channel === "SMS"
                    ? "border-amber-500 bg-amber-50/50 text-amber-800 shadow-sm ring-2 ring-amber-500/10"
                    : "border-gray-200 hover:bg-gray-50 text-gray-700"
                )}
              >
                <MessageSquare className="h-4 w-4" />
                <span className="text-xs font-black">SMS Text</span>
                <span className="text-[9px] text-gray-400 font-bold">Ethio Telecom</span>
              </button>

              <button
                type="button"
                onClick={() => setChannel("EMAIL")}
                className={cn(
                  "p-3 rounded-2xl border text-left transition-all flex flex-col gap-1",
                  channel === "EMAIL"
                    ? "border-blue-500 bg-blue-50/50 text-blue-800 shadow-sm ring-2 ring-blue-500/10"
                    : "border-gray-200 hover:bg-gray-50 text-gray-700"
                )}
              >
                <Mail className="h-4 w-4" />
                <span className="text-xs font-black">Email</span>
                <span className="text-[9px] text-gray-400 font-bold">SMTP Dispatch</span>
              </button>
            </div>
          </div>

          {/* Target Audience */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Target Audience</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: "ALL", label: "All Users", desc: "Global broadcast" },
                { id: "REGION", label: "By Region", desc: "Regional filter" },
                { id: "TOPIC", label: "By Topic", desc: "Custom topic" },
                { id: "SINGLE", label: "Single User", desc: "Direct recipient" },
              ].map((t) => (
                <button
                  type="button"
                  key={t.id}
                  onClick={() => setTargetAudience(t.id)}
                  className={cn(
                    "p-2.5 rounded-xl border text-xs font-black transition-all text-center",
                    targetAudience === t.id
                      ? "bg-black text-white border-black"
                      : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100"
                  )}
                >
                  <div>{t.label}</div>
                  <div className="text-[9px] font-medium opacity-75">{t.desc}</div>
                </button>
              ))}
            </div>

            {targetAudience === "SINGLE" && (
              <div className="pt-2 space-y-1">
                <Input
                  placeholder="e.g. +251911223344 or 0911223344 (Phone number or Member ID)"
                  value={singleRecipient}
                  onChange={(e) => setSingleRecipient(e.target.value)}
                  className="h-10 bg-gray-50 border border-gray-200 rounded-xl font-bold text-xs text-black"
                  required
                />
                <p className="text-[10px] text-gray-400 font-bold ml-1">SMS will be delivered directly to this recipient's mobile number.</p>
              </div>
            )}

            {targetAudience === "REGION" && (
              <div className="pt-2">
                <select
                  value={selectedRegion}
                  onChange={(e) => setSelectedRegion(e.target.value)}
                  className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-xl font-bold text-xs text-black focus:ring-2 focus:ring-[#ED1C24]/20"
                >
                  {REGIONS.map((r) => (
                    <option key={r} value={r}>
                      {r} Region
                    </option>
                  ))}
                </select>
              </div>
            )}

            {targetAudience === "TOPIC" && (
              <div className="pt-2">
                <Input
                  placeholder="e.g. emergency_alerts, coordinators, volunteers"
                  value={topicName}
                  onChange={(e) => setTopicName(e.target.value)}
                  className="h-10 bg-gray-50 border border-gray-200 rounded-xl font-bold text-xs"
                />
              </div>
            )}
          </div>

          {/* Broadcast Title */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">
              Broadcast Title / Subject
            </label>
            <Input
              placeholder="e.g. Emergency Flood Warning / Volunteer Call"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="h-11 bg-gray-50 border border-gray-200 rounded-xl font-bold text-sm text-black focus:ring-2 focus:ring-[#ED1C24]/10"
              required
            />
          </div>

          {/* Message Content */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Message Body</label>
              <span className="text-[10px] font-bold text-gray-400">{message.length} characters</span>
            </div>
            <textarea
              rows={4}
              placeholder="Write your push notification or broadcast message here..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-2xl font-medium text-sm text-black focus:ring-2 focus:ring-[#ED1C24]/10 outline-none transition-all resize-none"
              required
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <Button type="button" variant="outline" onClick={onClose} className="rounded-xl font-black text-xs h-10 px-5">
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={sending}
              className="bg-[#ED1C24] hover:bg-black text-white rounded-xl font-black text-xs h-10 px-6 shadow-lg shadow-red-500/20 flex items-center gap-2"
            >
              {sending ? (
                <>
                  <RefreshCcw className="h-4 w-4 animate-spin" /> Dispatching...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" /> Send Broadcast Now
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Subcomponent: Campaign Details Modal
function NotificationDetailsModal({
  notification,
  onClose,
}: {
  notification: Notification;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Info className="h-4 w-4 text-[#ED1C24]" />
            <h2 className="text-sm font-black text-black">Campaign Details</h2>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-200 rounded-full transition-colors text-gray-400 hover:text-black">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <div className="text-[10px] font-black uppercase tracking-widest text-gray-400">Campaign Title</div>
            <div className="text-base font-black text-black uppercase tracking-tight mt-0.5">{notification.name}</div>
          </div>

          <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-100">
            <div>
              <div className="text-[9px] font-black uppercase tracking-widest text-gray-400">Channel</div>
              <div className="font-bold text-xs text-black mt-0.5">{notification.channel}</div>
            </div>
            <div>
              <div className="text-[9px] font-black uppercase tracking-widest text-gray-400">Date Dispatched</div>
              <div className="font-bold text-xs text-gray-600 mt-0.5">{notification.created_at}</div>
            </div>
            <div>
              <div className="text-[9px] font-black uppercase tracking-widest text-gray-400">Recipients</div>
              <div className="font-bold text-xs text-[#ED1C24] mt-0.5">{notification.recipients_count} Recipients</div>
            </div>
            <div>
              <div className="text-[9px] font-black uppercase tracking-widest text-gray-400">Status</div>
              <div className="font-bold text-xs text-green-600 mt-0.5 flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3" /> Dispatched
              </div>
            </div>
          </div>

          <div>
            <div className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Message Content</div>
            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 text-sm font-medium text-gray-800 leading-relaxed whitespace-pre-wrap">
              {notification.message}
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <Button onClick={onClose} className="rounded-xl font-black text-xs h-10 px-6 bg-black text-white hover:bg-gray-800">
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Subcomponent: Templates Modal
function TemplatesModal({
  templates,
  selectedTemplate,
  onSelect,
  onClose,
}: {
  templates: typeof TEMPLATES;
  selectedTemplate: (typeof TEMPLATES)[0];
  onSelect: (t: (typeof TEMPLATES)[0]) => void;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/40 backdrop-blur-sm">
      <div className="bg-gray-50 w-full max-w-6xl h-[90vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="bg-white px-6 py-4 border-b border-gray-100 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 text-sm">
            <span className="font-black text-black">Notification Templates</span>
            <span className="text-gray-300">/</span>
            <span className="font-bold text-gray-500">Membership</span>
            <span className="text-gray-300">/</span>
            <span className="font-bold text-gray-400">Message Management</span>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-black">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden p-6 gap-6">
          {/* Sidebar */}
          <div className="w-72 bg-white rounded-2xl border border-gray-100 flex flex-col overflow-hidden shrink-0 shadow-sm">
            <div className="p-4 border-b border-gray-50 font-black text-xs uppercase tracking-widest flex items-center gap-2 text-black">
              <Bell className="h-3.5 w-3.5" /> Notification Types
            </div>
            <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
              {templates.map((t) => (
                <button
                  key={t.code}
                  onClick={() => onSelect(t)}
                  className={cn(
                    "w-full flex items-center justify-between p-3 rounded-xl transition-all text-left",
                    selectedTemplate.code === t.code
                      ? "bg-red-50/50 border-l-4 border-[#ED1C24] shadow-sm"
                      : "hover:bg-gray-50 border-l-4 border-transparent"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "h-8 w-8 rounded-lg flex items-center justify-center font-bold text-xs",
                        selectedTemplate.code === t.code ? "bg-red-100 text-[#ED1C24]" : "bg-gray-100 text-gray-400"
                      )}
                    >
                      {t.name.charAt(0)}
                    </div>
                    <div>
                      <div className={cn("text-xs font-black", selectedTemplate.code === t.code ? "text-[#ED1C24]" : "text-black")}>
                        {t.name}
                      </div>
                      <div className="text-[9px] font-bold text-gray-400 uppercase">{t.code}</div>
                    </div>
                  </div>
                  {t.active && <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-[8px] font-black uppercase">Active</span>}
                </button>
              ))}
            </div>
          </div>

          {/* Main Editor Preview */}
          <div className="flex-1 bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col overflow-hidden">
            <div className="p-6 border-b border-gray-50 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-red-50 text-[#ED1C24] flex items-center justify-center">
                  <RefreshCcw className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-xl font-black">{selectedTemplate.name}</h2>
                  <p className="text-xs font-bold text-gray-400">{selectedTemplate.code}</p>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-8 flex gap-8 custom-scrollbar">
              <div className="flex-1 space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 flex items-center gap-2">
                    <Mail className="h-3 w-3" /> Email Subject (EN)
                  </label>
                  <div className="w-full bg-gray-50 border border-gray-100 rounded-xl p-4 text-sm font-bold text-black border-dashed">
                    Membership Renewed
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 flex items-center gap-2">
                    <MessageSquare className="h-3 w-3" /> Message Template (EN)
                  </label>
                  <div className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-6 text-sm font-medium text-black border-dashed leading-relaxed space-y-4">
                    <p>Congratulations {`{{memberName}}`}, your ERCS Membership has been successfully renewed!</p>
                    <p>
                      We have received your payment. Thank you for continuing to be a valued member.
                      <br />
                      Your renewed Membership ID is {`{{memberId}}`}, valid until {`{{expiredDate}}`}.
                    </p>
                  </div>
                </div>
              </div>

              {/* Variables Sidebar */}
              <div className="w-64 shrink-0 space-y-4">
                <div className="text-[10px] font-black uppercase tracking-widest text-gray-500 flex items-center gap-2">
                  Available Variables
                </div>
                <div className="space-y-2">
                  {VARIABLES.map((v) => (
                    <div key={v.tag} className="bg-gray-50 rounded-lg p-3 border border-gray-100 flex items-center justify-between group cursor-pointer hover:border-gray-200">
                      <span className="text-[10px] font-black text-green-600 font-mono bg-green-50 px-1.5 py-0.5 rounded">
                        {v.tag}
                      </span>
                      <span className="text-[9px] font-bold text-gray-400">{v.desc}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
