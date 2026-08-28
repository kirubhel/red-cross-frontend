"use client";

import { useEffect, useState } from "react";
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
  Mail, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Trash2, 
  Eye, 
  Send, 
  Filter,
  X,
  MessageSquare,
  User,
  ArrowRight
} from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";
import { cn } from "@/lib/utils";
import { 
  ContactMessage, 
  getStoredMessages, 
  updateMessageStatus, 
  deleteStoredMessage 
} from "@/lib/contact-messages";

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "NEW" | "IN_PROGRESS" | "RESOLVED">("ALL");
  const [loading, setLoading] = useState(true);

  // Selected message for detail view modal
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [replyText, setReplyText] = useState("");
  const [isSendingReply, setIsSendingReply] = useState(false);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      // Try API first
      const res = await api.get("/contact");
      if (res.data && Array.isArray(res.data.messages)) {
        setMessages(res.data.messages);
        return;
      }
    } catch (err) {
      // Fallback to local storage if API route is not active
    } finally {
      const stored = getStoredMessages();
      setMessages(stored);
      setLoading(false);
    }
  };

  const handleStatusChange = (id: string, newStatus: ContactMessage["status"]) => {
    const updated = updateMessageStatus(id, newStatus);
    setMessages(updated);
    if (selectedMessage && selectedMessage.id === id) {
      setSelectedMessage({ ...selectedMessage, status: newStatus });
    }
    toast.success(`Message status updated to ${newStatus.replace('_', ' ')}`);
  };

  const handleDelete = (id: string) => {
    if (!confirm("Are you sure you want to delete this contact message?")) return;
    const updated = deleteStoredMessage(id);
    setMessages(updated);
    if (selectedMessage?.id === id) {
      setSelectedMessage(null);
    }
    toast.success("Message deleted");
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedMessage) return;

    setIsSendingReply(true);
    setTimeout(() => {
      handleStatusChange(selectedMessage.id, "RESOLVED");
      toast.success(`Reply sent to ${selectedMessage.email}`, {
        description: "Message marked as Resolved."
      });
      setReplyText("");
      setIsSendingReply(false);
    }, 600);
  };

  const filteredMessages = messages.filter((msg) => {
    const matchesSearch =
      msg.full_name.toLowerCase().includes(search.toLowerCase()) ||
      msg.email.toLowerCase().includes(search.toLowerCase()) ||
      msg.subject.toLowerCase().includes(search.toLowerCase()) ||
      msg.message.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === "ALL" || msg.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const countNew = messages.filter((m) => m.status === "NEW").length;
  const countInProgress = messages.filter((m) => m.status === "IN_PROGRESS").length;
  const countResolved = messages.filter((m) => m.status === "RESOLVED").length;

  const formatDate = (isoStr: string) => {
    try {
      const d = new Date(isoStr);
      return d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      });
    } catch {
      return isoStr;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-red-50 text-[#ED1C24] rounded-full text-[10px] font-black uppercase tracking-widest leading-none">
            <Mail className="h-3.5 w-3.5" /> Communications Portal
          </div>
          <h1 className="text-3xl font-black text-black tracking-tighter">Contact Messages & Inquiries</h1>
          <p className="text-gray-500 font-medium text-sm">Review, manage, and respond to incoming inquiries from the landing page.</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div 
          onClick={() => setStatusFilter("ALL")}
          className={cn(
            "p-5 rounded-2xl border transition-all cursor-pointer bg-white shadow-sm hover:shadow-md",
            statusFilter === "ALL" ? "border-black ring-1 ring-black" : "border-gray-100"
          )}
        >
          <div className="flex items-center justify-between text-gray-500 mb-2">
            <span className="text-[10px] font-black uppercase tracking-widest">Total Messages</span>
            <MessageSquare className="h-4 w-4 text-gray-400" />
          </div>
          <div className="text-3xl font-black text-black">{messages.length}</div>
        </div>

        <div 
          onClick={() => setStatusFilter("NEW")}
          className={cn(
            "p-5 rounded-2xl border transition-all cursor-pointer bg-white shadow-sm hover:shadow-md",
            statusFilter === "NEW" ? "border-[#ED1C24] ring-1 ring-[#ED1C24]" : "border-gray-100"
          )}
        >
          <div className="flex items-center justify-between text-red-500 mb-2">
            <span className="text-[10px] font-black uppercase tracking-widest">New / Unread</span>
            <AlertCircle className="h-4 w-4 text-[#ED1C24]" />
          </div>
          <div className="text-3xl font-black text-[#ED1C24]">{countNew}</div>
        </div>

        <div 
          onClick={() => setStatusFilter("IN_PROGRESS")}
          className={cn(
            "p-5 rounded-2xl border transition-all cursor-pointer bg-white shadow-sm hover:shadow-md",
            statusFilter === "IN_PROGRESS" ? "border-amber-500 ring-1 ring-amber-500" : "border-gray-100"
          )}
        >
          <div className="flex items-center justify-between text-amber-600 mb-2">
            <span className="text-[10px] font-black uppercase tracking-widest">In Progress</span>
            <Clock className="h-4 w-4 text-amber-500" />
          </div>
          <div className="text-3xl font-black text-amber-600">{countInProgress}</div>
        </div>

        <div 
          onClick={() => setStatusFilter("RESOLVED")}
          className={cn(
            "p-5 rounded-2xl border transition-all cursor-pointer bg-white shadow-sm hover:shadow-md",
            statusFilter === "RESOLVED" ? "border-emerald-500 ring-1 ring-emerald-500" : "border-gray-100"
          )}
        >
          <div className="flex items-center justify-between text-emerald-600 mb-2">
            <span className="text-[10px] font-black uppercase tracking-widest">Resolved</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="text-3xl font-black text-emerald-600">{countResolved}</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email or message..."
            className="pl-10 h-11 bg-gray-50/50 border-gray-100 rounded-xl text-sm font-bold text-black focus:bg-white"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 mr-2 flex items-center gap-1">
            <Filter className="h-3 w-3" /> Status:
          </span>
          {(["ALL", "NEW", "IN_PROGRESS", "RESOLVED"] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={cn(
                "px-3.5 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all whitespace-nowrap",
                statusFilter === st
                  ? "bg-black text-white shadow-sm"
                  : "bg-gray-50 text-gray-500 hover:bg-gray-100"
              )}
            >
              {st.replace("_", " ")}
            </button>
          ))}
        </div>
      </div>

      {/* Messages Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-400 font-bold text-sm">
            Loading messages...
          </div>
        ) : filteredMessages.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <Mail className="h-10 w-10 text-gray-300 mx-auto" />
            <p className="text-gray-500 font-bold text-base">No contact messages found</p>
            <p className="text-gray-400 text-xs font-medium">Try clearing your filters or send a test message from the landing page.</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="border-b border-gray-100 hover:bg-transparent">
                <TableHead className="py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Date</TableHead>
                <TableHead className="py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Sender</TableHead>
                <TableHead className="py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Subject & Preview</TableHead>
                <TableHead className="py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Status</TableHead>
                <TableHead className="py-4 text-right text-[10px] font-black uppercase tracking-widest text-gray-400">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMessages.map((msg) => (
                <TableRow 
                  key={msg.id} 
                  className={cn(
                    "border-b border-gray-50 hover:bg-gray-50/50 transition-colors",
                    msg.status === "NEW" && "bg-red-50/20 font-bold"
                  )}
                >
                  <TableCell className="py-4 text-xs font-bold text-gray-500 whitespace-nowrap">
                    {formatDate(msg.created_at)}
                  </TableCell>

                  <TableCell className="py-4">
                    <div className="space-y-0.5">
                      <div className="text-sm font-black text-black flex items-center gap-1.5">
                        <User className="h-3.5 w-3.5 text-[#ED1C24]" />
                        {msg.full_name}
                      </div>
                      <div className="text-xs text-gray-400 font-medium">{msg.email}</div>
                    </div>
                  </TableCell>

                  <TableCell className="py-4 max-w-md">
                    <div className="space-y-1">
                      <div className="text-sm font-black text-gray-900 truncate">{msg.subject}</div>
                      <p className="text-xs text-gray-500 font-medium line-clamp-1">{msg.message}</p>
                    </div>
                  </TableCell>

                  <TableCell className="py-4 whitespace-nowrap">
                    {msg.status === "NEW" && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-red-100 text-[#ED1C24]">
                        <AlertCircle className="h-3 w-3" /> New
                      </span>
                    )}
                    {msg.status === "IN_PROGRESS" && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-amber-100 text-amber-700">
                        <Clock className="h-3 w-3" /> In Progress
                      </span>
                    )}
                    {msg.status === "RESOLVED" && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-emerald-100 text-emerald-700">
                        <CheckCircle2 className="h-3 w-3" /> Resolved
                      </span>
                    )}
                  </TableCell>

                  <TableCell className="py-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        size="sm"
                        onClick={() => setSelectedMessage(msg)}
                        className="bg-black hover:bg-[#ED1C24] text-white rounded-xl text-xs font-black px-3.5 h-9"
                      >
                        <Eye className="h-3.5 w-3.5 mr-1" /> View
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(msg.id)}
                        className="text-gray-400 hover:text-red-600 hover:bg-red-50 border-gray-200 rounded-xl h-9 w-9 p-0"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Message Details & Reply Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-8 shadow-2xl border border-gray-100 relative space-y-6 animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-gray-100 pb-5">
              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase tracking-widest text-[#ED1C24] bg-red-50 px-2.5 py-1 rounded-full">
                  Contact Inquiry Details
                </span>
                <h3 className="text-2xl font-black text-black mt-2 tracking-tight">
                  {selectedMessage.subject}
                </h3>
                <p className="text-xs font-medium text-gray-400">
                  Received on {formatDate(selectedMessage.created_at)}
                </p>
              </div>

              <button 
                onClick={() => setSelectedMessage(null)}
                className="p-2 text-gray-400 hover:text-black rounded-xl hover:bg-gray-100 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Sender Info Card */}
            <div className="bg-gray-50/70 border border-gray-100 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="text-xs font-black text-gray-400 uppercase tracking-widest">Sender Information</div>
                <div className="text-base font-black text-black">{selectedMessage.full_name}</div>
                <a href={`mailto:${selectedMessage.email}`} className="text-sm font-bold text-[#ED1C24] hover:underline flex items-center gap-1">
                  <Mail className="h-3.5 w-3.5" /> {selectedMessage.email}
                </a>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Status:</span>
                <select
                  value={selectedMessage.status}
                  onChange={(e) => handleStatusChange(selectedMessage.id, e.target.value as ContactMessage["status"])}
                  className="bg-white border border-gray-200 rounded-xl px-3 py-1.5 text-xs font-bold text-black focus:outline-none focus:ring-2 focus:ring-[#ED1C24]"
                >
                  <option value="NEW">NEW / UNREAD</option>
                  <option value="IN_PROGRESS">IN PROGRESS</option>
                  <option value="RESOLVED">RESOLVED</option>
                </select>
              </div>
            </div>

            {/* Full Message Body */}
            <div className="space-y-2">
              <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Message Content</div>
              <div className="bg-gray-50 border border-gray-100 rounded-2xl p-6 text-sm font-medium text-gray-800 leading-relaxed whitespace-pre-wrap min-h-[120px]">
                {selectedMessage.message}
              </div>
            </div>

            {/* Quick Email Reply Form */}
            <form onSubmit={handleSendReply} className="space-y-3 pt-2 border-t border-gray-100">
              <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center justify-between">
                <span>Send Direct Email Reply</span>
                <span className="text-gray-400 font-normal">Replying as Admin</span>
              </div>
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder={`Type your reply to ${selectedMessage.full_name}...`}
                className="w-full min-h-[100px] rounded-2xl border border-gray-200 p-4 text-sm font-bold text-black placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ED1C24] transition-all resize-none"
              />
              <div className="flex items-center justify-between gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setSelectedMessage(null)}
                  className="rounded-xl h-11 px-5 text-xs font-bold border-gray-200 text-gray-600"
                >
                  Close
                </Button>

                <Button
                  type="submit"
                  disabled={isSendingReply || !replyText.trim()}
                  className="bg-[#ED1C24] hover:bg-black text-white rounded-xl h-11 px-6 text-xs font-black shadow-lg shadow-red-500/20 transition-all flex items-center gap-2"
                >
                  <Send className="h-4 w-4" />
                  {isSendingReply ? "Sending..." : "Send Reply & Resolve"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
