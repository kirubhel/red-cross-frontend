import { Facebook, Globe, Instagram, Linkedin, Mail, MessageCircle, Youtube, Video, Send, Images} from "lucide-react";

const TwitterX = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M4 4l11.733 16h4.267l-11.733 -16z" />
    <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" />
  </svg>
);


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
  twitter: TwitterX,
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