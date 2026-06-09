import { Facebook, Globe, Instagram, Linkedin, Mail, MessageCircle, Twitter, Youtube, Video, Send, Images} from "lucide-react";

export type FooterSocialIcon =
  | "facebook"
  | "twitter"
  | "instagram"
  | "linkedin"
  | "youtube"
  | "globe"
  | "message"
  | "mail"
  | "Video"   // Added
  | "telegram" // Added
  | "Images";

export interface FooterSocialLink {
  label: string;
  url: string;
  icon: FooterSocialIcon;
}

export interface FooterRouteLink {
  label: string;
  href: string;
}

export const footerSocialIconMap = {
  facebook: Facebook,
  twitter: Twitter,
  instagram: Instagram,
  linkedin: Linkedin,
  youtube: Youtube,
  globe: Globe,
  message: MessageCircle,
  mail: Mail,
  Video: Video,
  telegram: Send,
  Images: Images,
} as const;

export const footerSocialIconOptions: Array<{ value: FooterSocialIcon; label: string }> = [
  { value: "facebook", label: "Facebook" },
  { value: "twitter", label: "Twitter / X" },
  { value: "instagram", label: "Instagram" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "youtube", label: "YouTube" },
  { value: "globe", label: "Website" },
  { value: "message", label: "Message" },
  { value: "mail", label: "Email" },
  { value: "Video", label: "Video" },
  { value: "telegram", label: "Telegram" },
  { value: "Images", label: "Images" },
];

export const defaultFooterSocialLinks: FooterSocialLink[] = [
  { label: "Facebook", url: "https://facebook.com", icon: "facebook" },
  { label: "Twitter / X", url: "https://twitter.com", icon: "twitter" },
  { label: "Instagram", url: "https://instagram.com", icon: "instagram" },
  { label: "LinkedIn", url: "https://linkedin.com", icon: "linkedin" },
];

export const defaultFooterMissionLinks: FooterRouteLink[] = [
  { label: "Emergency Response", href: "/#services" },
  { label: "Health & Wellness", href: "/#impact" },
  { label: "Clean Water (WASH)", href: "/#services" },
  { label: "Community Growth", href: "/history" },
  { label: "Blood Donation", href: "/donate" },
];

export const defaultFooterInvolvedLinks: FooterRouteLink[] = [
  { label: "Join as Volunteer", href: "/join/volunteer" },
  { label: "Become a Member", href: "/join/member" },
  { label: "Donate Now", href: "/donate" },
  { label: "News & Updates", href: "/news" },
  { label: "Contact Us", href: "/#contact" },
];