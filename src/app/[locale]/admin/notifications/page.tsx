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
import { REGIONS as REGION_LIST } from "@/lib/constants";
import { DesktopPushToggle } from "@/components/notifications/DesktopPushToggle";

import { PageHeader } from "@/components/admin/page-ui";

const REGIONS = REGION_LIST.map((r) => r.name);

const CHANNELS = {
  PUSH: { label: "Push", icon: Smartphone, chip: "bg-red-50 text-[#B5121B] border-red-200" },
  SMS: { label: "SMS", icon: MessageSquare, chip: "bg-amber-50 text-amber-800 border-amber-200" },
  EMAIL: { label: "Email", icon: Mail, chip: "bg-blue-50 text-blue-800 border-blue-200" },
} as const;

function formatWhen(raw: string) {
  if (!raw) return "Date not recorded";
  const d = new Date(raw.includes("T") ? raw : raw.replace(" ", "T"));
  if (isNaN(d.getTime())) return raw;
  return d.toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" });
}
type Notification = {
  id: string;
  name: string;
  message: string;
  channel: "SMS" | "EMAIL" | "PUSH";
  created_at: string;
  recipients_count: number;
};

const TEMPLATES = [
  { 
    id: "renew", 
    name: "Membership Renewal", 
    code: "MembershipRenewal", 
    active: true,
    subject: "ERCS Membership Renewed Successfully",
    body: "Congratulations {{memberName}}, your ERCS Membership has been successfully renewed!\n\nWe have received your annual contribution payment. Thank you for standing with the Ethiopian Red Cross Society.\n\nYour renewed Membership ID is {{memberId}}, valid until {{expiredDate}}."
  },
  { 
    id: "expire_warn", 
    name: "Expiration Warning", 
    code: "MembershipExpirationWarning", 
    active: true,
    subject: "Urgent: Your ERCS Membership Expires Soon",
    body: "Dear {{memberName}},\n\nThis is a friendly reminder that your ERCS membership will expire on {{expiredDate}}.\n\nPlease renew your dues today to continue supporting humanitarian missions across Ethiopia: {{loginUrl}}"
  },
  { 
    id: "reject", 
    name: "ID Card Rejected", 
    code: "IdCardRejected", 
    active: true,
    subject: "Action Required: ERCS Digital ID Card Photo Update",
    body: "Dear {{memberName}},\n\nYour submitted ID card photo could not be approved due to photo quality or verification guidelines. Please log in and upload a clear portrait photo: {{loginUrl}}"
  },
  { 
    id: "birthday", 
    name: "Birthday Wish", 
    code: "BirthdayWish", 
    active: true,
    subject: "Happy Birthday from Ethiopian Red Cross Society!",
    body: "Warmest birthday wishes, {{memberName}}! Thank you for being a committed member of the Ethiopian Red Cross Society family. We celebrate you today!"
  },
  { 
    id: "expired", 
    name: "Membership Expired", 
    code: "MembershipExpired", 
    active: true,
    subject: "Your ERCS Membership Has Expired",
    body: "Dear {{memberName}},\n\nYour ERCS membership expired on {{expiredDate}}. Renew your membership now to maintain your active humanitarian standing: {{loginUrl}}"
  },
  { 
    id: "register", 
    name: "Member Registration", 
    code: "MemberRegistration", 
    active: true,
    subject: "Welcome to the Ethiopian Red Cross Society!",
    body: "Welcome to ERCS, {{memberName}}!\n\nYour registration has been received and your temporary Member ID is {{memberId}}. Please complete your profile at {{loginUrl}}."
  },
  { 
    id: "approve", 
    name: "ID Card Approved", 
    code: "IdCardApproved", 
    active: true,
    subject: "Your ERCS Digital ID Card is Ready!",
    body: "Congratulations {{memberName}}! Your ERCS official membership ID card has been verified and issued. View and download your card here: {{loginUrl}}"
  },
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
  const [loadFailed, setLoadFailed] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState(TEMPLATES[0]);
  const [initialBroadcastData, setInitialBroadcastData] = useState<{
    channel?: "PUSH" | "SMS" | "EMAIL";
    region?: string;
    title?: string;
    message?: string;
    targetType?: string;
  }>({});

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    setLoading(true);
    setLoadFailed(false);
    try {
      const res = await api.get("/notifications?page=1&page_size=100");
      setNotifications(res.data.campaigns || []);
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
      setNotifications([]);
      setLoadFailed(true);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenBroadcast = (preset?: { channel?: "PUSH" | "SMS" | "EMAIL"; region?: string; title?: string; message?: string; targetType?: string }) => {
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
      <PageHeader
        title="Notifications"
        description="Send push, SMS and email messages to members and volunteers, and review what has already gone out."
        actions={
          <>
            <DesktopPushToggle compact />
            <Button onClick={() => setShowTemplates(true)} variant="outline" className="h-10 gap-2 rounded-xl border-gray-200 px-4 text-xs font-bold text-gray-800 hover:bg-gray-50">
              <Settings className="h-4 w-4 text-gray-500" /> Message templates
            </Button>
            <Button onClick={() => handleOpenBroadcast({ channel: "PUSH" })} className="h-10 gap-2 rounded-xl bg-[#ED1C24] px-5 text-xs font-bold text-white hover:bg-black">
              <Send className="h-4 w-4" /> New broadcast
            </Button>
          </>
        }
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search by title or message"
            aria-label="Search broadcasts"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-10 rounded-xl border border-gray-200 bg-white pl-10 text-sm text-gray-900"
          />
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 rounded-xl bg-gray-100 p-1" role="group" aria-label="Filter by channel">
            {["ALL", "PUSH", "SMS", "EMAIL"].map((ch) => (
              <button
                key={ch}
                onClick={() => setChannelFilter(ch)}
                aria-pressed={channelFilter === ch}
                className={cn(
                  "rounded-lg px-3 py-1.5 text-xs font-bold transition-colors",
                  channelFilter === ch ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"
                )}
              >
                {ch === "ALL" ? "All" : CHANNELS[ch as keyof typeof CHANNELS].label}
              </button>
            ))}
          </div>
          <Button onClick={fetchNotifications} variant="outline" size="icon" className="h-10 w-10 rounded-xl border-gray-200" title="Refresh" aria-label="Refresh broadcast history">
            <RefreshCcw className={cn("h-4 w-4 text-gray-600", loading && "animate-spin")} />
          </Button>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
          <h2 className="text-base font-bold text-gray-900">Sent broadcasts</h2>
          <span className="text-xs text-gray-500">
            {filteredNotifications.length} {filteredNotifications.length === 1 ? "broadcast" : "broadcasts"}
          </span>
        </div>
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Broadcast</TableHead>
              <TableHead>Channel</TableHead>
              <TableHead className="text-right">Recipients</TableHead>
              <TableHead className="text-right">Sent</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} className="h-40 text-center text-sm text-gray-500">
                  <RefreshCcw className="mx-auto mb-2 h-5 w-5 animate-spin text-[#ED1C24]" /> Loading broadcasts…
                </TableCell>
              </TableRow>
            ) : loadFailed ? (
              <TableRow>
                <TableCell colSpan={4} className="h-40 text-center text-sm text-gray-600">
                  Could not load broadcast history.{" "}
                  <button onClick={fetchNotifications} className="font-bold text-[#B5121B] hover:underline">
                    Try again
                  </button>
                </TableCell>
              </TableRow>
            ) : filteredNotifications.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-40 text-center text-sm text-gray-500">
                  {notifications.length === 0 ? "Nothing has been sent yet. Choose New broadcast to send the first message." : "No broadcasts match your search."}
                </TableCell>
              </TableRow>
            ) : (
              filteredNotifications.map((n) => {
                const ch = CHANNELS[n.channel] ?? CHANNELS.PUSH;
                return (
                  <TableRow key={n.id} onClick={() => setSelectedNotification(n)} className="cursor-pointer">
                    <TableCell className="max-w-[28rem]">
                      <p className="truncate text-sm font-bold text-gray-900">{n.name}</p>
                      <p className="mt-0.5 line-clamp-1 text-xs text-gray-500">{n.message}</p>
                    </TableCell>
                    <TableCell>
                      <span className={cn("inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[11px] font-bold", ch.chip)}>
                        <ch.icon className="h-3 w-3" /> {ch.label}
                      </span>
                    </TableCell>
                    <TableCell className="text-right text-sm tabular-nums text-gray-700">{Number(n.recipients_count || 0).toLocaleString()}</TableCell>
                    <TableCell className="text-right text-xs text-gray-500">{formatWhen(n.created_at)}</TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Broadcast Creation Modal */}
      {showBroadcastModal && (
        <BroadcastModal
          initialData={initialBroadcastData}
          onClose={() => setShowBroadcastModal(false)}
          onSuccess={() => {
            setShowBroadcastModal(false);
            fetchNotifications();
            toast.success("Broadcast sent.");
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
          onUse={(title, message) => {
            setShowTemplates(false);
            handleOpenBroadcast({ channel: "PUSH", title, message, targetType: "ALL" });
          }}
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
    message?: string;
    targetType?: string;
  };
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [channel, setChannel] = useState<"PUSH" | "SMS" | "EMAIL">(initialData?.channel || "PUSH");
  const [title, setTitle] = useState(initialData?.title || "");
  const [message, setMessage] = useState(initialData?.message || "");
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

    if (/\{\{[^}]+\}\}/.test(`${title} ${message}`)) {
      toast.error("Replace placeholders like {{memberName}} with real text. Broadcasts do not fill them in.");
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
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden border border-gray-100 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-[#ED1C24] text-white flex items-center justify-center font-bold">
              <Send className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-base font-bold tracking-tight text-gray-900">New Broadcast Notification</h2>
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
            <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Broadcast Channel</label>
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
            <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Target Audience</label>
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
            <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
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
              <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Message Body</label>
              <span className="text-xs text-gray-500">
                {message.length} characters{channel === "SMS" ? `, ${Math.max(1, Math.ceil(message.length / 160))} SMS` : ""}
              </span>
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

          <p className="rounded-xl bg-gray-50 px-3 py-2.5 text-xs text-gray-700" aria-live="polite">
            This will send {channel === "PUSH" ? "a push notification" : channel === "SMS" ? "an SMS" : "an email"} to{" "}
            <strong>
              {targetAudience === "ALL"
                ? "everyone"
                : targetAudience === "REGION"
                ? `members and volunteers in ${selectedRegion}`
                : targetAudience === "TOPIC"
                ? `the "${topicName.trim() || "all_users"}" topic`
                : singleRecipient.trim() || "one recipient"}
            </strong>
            . It cannot be recalled once sent.
          </p>

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
                  <Send className="h-4 w-4" /> Send now
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
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Info className="h-4 w-4 text-[#ED1C24]" />
            <h2 className="text-sm font-black text-black">Broadcast details</h2>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-200 rounded-full transition-colors text-gray-400 hover:text-black">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Title</div>
            <div className="text-base font-black text-black uppercase tracking-tight mt-0.5">{notification.name}</div>
          </div>

          <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-100">
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Channel</div>
              <div className="font-bold text-xs text-black mt-0.5">{notification.channel}</div>
            </div>
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Sent</div>
              <div className="font-bold text-xs text-gray-600 mt-0.5">{formatWhen(notification.created_at)}</div>
            </div>
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Recipients</div>
              <div className="font-bold text-xs text-[#ED1C24] mt-0.5">{Number(notification.recipients_count || 0).toLocaleString()} (estimated)</div>
            </div>
          </div>

          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1">Message Content</div>
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
  onUse,
}: {
  templates: typeof TEMPLATES;
  selectedTemplate: (typeof TEMPLATES)[0];
  onSelect: (t: (typeof TEMPLATES)[0]) => void;
  onClose: () => void;
  onUse: (title: string, message: string) => void;
}) {
  const [subject, setSubject] = useState(selectedTemplate.subject || "Membership Renewed");
  const [body, setBody] = useState(selectedTemplate.body || "");
  const handleInsertVariable = (tag: string) => {
    setBody(prev => prev + " " + tag);
    toast.info(`Appended ${tag} to template body`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/40 backdrop-blur-sm">
      <div className="bg-gray-50 w-full max-w-6xl h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="bg-white px-6 py-4 border-b border-gray-100 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 text-sm">
            <span className="font-black text-black">Message templates</span>
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
              <Button
                onClick={() => onUse(subject, body)}
                className="bg-[#ED1C24] hover:bg-black text-white font-black text-xs px-5 h-9 rounded-xl shadow-md shadow-red-500/10 flex items-center gap-2"
              >
                Use in a broadcast
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 flex gap-8 custom-scrollbar">
              <div className="flex-1 space-y-6">
                <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500 flex items-center gap-2">
                    <Mail className="h-3 w-3" /> Email Subject (EN)
                  </label>
                  <Input
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-xl p-3 text-sm font-bold text-black focus:ring-2 focus:ring-red-500"
                    placeholder="Enter email subject template..."
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500 flex items-center gap-2">
                    <MessageSquare className="h-3 w-3" /> Message Template (EN)
                  </label>
                  <textarea
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    rows={8}
                    className="w-full bg-white border border-gray-200 rounded-2xl p-4 text-sm font-medium text-black focus:ring-2 focus:ring-red-500 leading-relaxed custom-scrollbar outline-none"
                    placeholder="Enter SMS or email template content with {{variables}}..."
                  />
                  <p className="text-xs text-gray-500">These are the automatic messages members receive. Changes here are not saved. They only prepare a one-off broadcast, and {"{{placeholders}}"} must be replaced with real text before sending.</p>
                </div>
              </div>

              {/* Variables Sidebar */}
              <div className="w-64 shrink-0 space-y-4">
                <div className="text-[11px] font-bold uppercase tracking-wider text-gray-500 flex items-center gap-2">
                  Placeholders used
                </div>
                <div className="space-y-2">
                  {VARIABLES.map((v) => (
                    <div 
                      key={v.tag} 
                      onClick={() => handleInsertVariable(v.tag)}
                      className="bg-gray-50 rounded-lg p-3 border border-gray-100 flex items-center justify-between group cursor-pointer hover:border-red-300 hover:bg-red-50/40 transition-all"
                      title="Click to insert variable"
                    >
                      <span className="text-[10px] font-black text-green-600 font-mono bg-green-50 px-1.5 py-0.5 rounded group-hover:bg-red-100 group-hover:text-red-700">
                        {v.tag}
                      </span>
                      <span className="text-[9px] font-bold text-gray-400 group-hover:text-gray-700">{v.desc}</span>
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
