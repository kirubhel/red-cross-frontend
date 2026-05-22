import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-heading",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ethiopian Red Cross Society | ERCS VMMS",
  description: "Official Volunteer & Member Management System for the Ethiopian Red Cross Society (ERCS). Saving Lives, Changing Minds.",
  icons: {
    icon: "/logo.png",
  },
};

import { LanguageProvider } from "@/context/LanguageContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${outfit.variable} antialiased font-sans`}
        suppressHydrationWarning={true}
      >
        <LanguageProvider>
          <Toaster position="top-right" />
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
