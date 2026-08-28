import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "../globals.css";
import { Toaster } from "@/components/ui/sonner";
import { OfflineSyncListener } from "@/components/OfflineSyncListener";

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
  manifest: "/manifest.json",
  icons: {
    icon: "/logo.png",
  },
};

import { LanguageProvider } from "@/context/LanguageContext";
import {NextIntlClientProvider} from 'next-intl';
import {getMessages} from 'next-intl/server';

export default async function RootLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{locale: string}>;
}>) {
  const { locale } = await params;
  const messages = await getMessages();
  return (
    <html lang={locale}>
      <body
        className={`${inter.variable} ${outfit.variable} antialiased font-sans`}
        suppressHydrationWarning={true}
      >
        <NextIntlClientProvider messages={messages}>
          <LanguageProvider>
            <OfflineSyncListener />
            <Toaster position="top-right" />
            {children}
          </LanguageProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
