export type ContactMessage = {
  id: string;
  full_name: string;
  email: string;
  subject: string;
  message: string;
  status: "NEW" | "IN_PROGRESS" | "RESOLVED";
  created_at: string;
};

const STORAGE_KEY = "ercs_contact_messages";

export const getStoredMessages = (): ContactMessage[] => {
  if (typeof window === "undefined") return getDefaultMessages();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const defaults = getDefaultMessages();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaults));
      return defaults;
    }
    return JSON.parse(raw);
  } catch (e) {
    return getDefaultMessages();
  }
};

export const saveContactMessage = (msg: Omit<ContactMessage, "id" | "status" | "created_at">): ContactMessage => {
  const current = getStoredMessages();
  const newMessage: ContactMessage = {
    ...msg,
    id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    status: "NEW",
    created_at: new Date().toISOString(),
  };
  const updated = [newMessage, ...current];
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  }
  return newMessage;
};

export const updateMessageStatus = (id: string, status: ContactMessage["status"]): ContactMessage[] => {
  const current = getStoredMessages();
  const updated = current.map((m) => (m.id === id ? { ...m, status } : m));
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  }
  return updated;
};

export const deleteStoredMessage = (id: string): ContactMessage[] => {
  const current = getStoredMessages();
  const updated = current.filter((m) => m.id !== id);
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  }
  return updated;
};

function getDefaultMessages(): ContactMessage[] {
  return [
    {
      id: "msg-1",
      full_name: "Tadesse Alemu",
      email: "tadesse.alemu@example.com",
      subject: "Inquiry about First Aid Training",
      message: "Hello, I would like to register a group of 15 staff members for your certified First Aid and CPR course next month. Could you please send details on group rates and schedules?",
      status: "NEW",
      created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
    },
    {
      id: "msg-2",
      full_name: "Bethlehem Worku",
      email: "b.worku@ethiohealth.org",
      subject: "Partnership Proposal for Health Campaign",
      message: "Greetings ERCS team. EthioHealth NGO is planning a blood donation and health screening campaign in Hawassa. We would love to collaborate with ERCS regional branch volunteers.",
      status: "IN_PROGRESS",
      created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
    },
    {
      id: "msg-3",
      full_name: "Solomon Kassa",
      email: "solomon.kassa@gmail.com",
      subject: "Volunteer Certificate Verification",
      message: "I completed 120 volunteer hours in 2023 at the Adama branch. Can someone verify my certificate for my graduate university application?",
      status: "RESOLVED",
      created_at: new Date(Date.now() - 3600000 * 72).toISOString(),
    }
  ];
}
