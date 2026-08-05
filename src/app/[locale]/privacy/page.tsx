import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | ERCS Member Portal",
  description: "Privacy Policy for the Ethiopian Red Cross Society Member Portal.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gray-950 text-white py-16 px-6">
        <div className="container mx-auto max-w-3xl">
          <Link href="/" className="text-[#ED1C24] text-xs font-black uppercase tracking-widest hover:underline">
            ← Back to Home
          </Link>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter mt-4">Privacy Policy</h1>
          <p className="text-gray-400 mt-3 font-medium">
            ERCS – Ethiopian Red Cross Society Member Portal · Last updated: June 9, 2026
          </p>
          <p className="text-gray-400 text-sm mt-4 leading-relaxed max-w-2xl">
            This Privacy Policy describes how <strong className="text-white">DAFTech Computer</strong> (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) collects, uses, and protects your personal information when you use the ERCS mobile application (the &quot;App&quot;). By registering or using the App, you agree to the practices described here.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto max-w-3xl px-6 py-16 space-y-10">

        <Section title="1. Who This Policy Applies To">
          <p>The App serves three types of users, each with a different registration flow:</p>
          <ul>
            <li><strong>Members</strong> – Individuals registering for an Ethiopian Red Cross Society membership.</li>
            <li><strong>Volunteers</strong> – Individuals registering to volunteer with ERCS programs.</li>
            <li><strong>Organizations</strong> – NGOs, corporations, government bodies, and other institutions partnering with ERCS.</li>
          </ul>
        </Section>

        <Section title="2. Information We Collect">
          <SubSection title="2.1 Personal Identity Data">
            <ul>
              <li>First name, father&apos;s name, grandfather&apos;s name</li>
              <li>Gender</li>
              <li>National ID number <Badge>optional</Badge></li>
            </ul>
          </SubSection>
          <SubSection title="2.2 Contact Data">
            <ul>
              <li>Email address</li>
              <li>Phone number (with country dial code)</li>
            </ul>
          </SubSection>
          <SubSection title="2.3 Administrative Location">
            <p>We collect your selected region, zone, and woreda (district) within Ethiopia&apos;s administrative hierarchy, or your country and international address if you are a non-Ethiopian volunteer. We do not collect GPS coordinates or real-time location.</p>
          </SubSection>
          <SubSection title="2.4 Membership & Volunteer Data">
            <ul>
              <li>Membership type and plan (Individual, Corporate, etc.)</li>
              <li>Volunteer engagement areas (e.g. First Aid, Ambulance Service, Emergency Response)</li>
              <li>Key skills and primary interests <Badge>optional</Badge></li>
              <li>Biography / personal bio <Badge>optional</Badge></li>
            </ul>
          </SubSection>
          <SubSection title="2.5 Organization Data">
            <ul>
              <li>Organization name and type (NGO, Government, Healthcare, Educational, etc.)</li>
              <li>Contact person&apos;s full name, email, and phone number</li>
              <li>Organization description <Badge>optional</Badge></li>
            </ul>
          </SubSection>
          <SubSection title="2.6 Profile Photo">
            <p>If you choose to upload a photo, it is compressed (JPEG, max 1200×1200 px) and stored on our secure server. Uploading a photo is optional.</p>
          </SubSection>
          <SubSection title="2.7 Payment & Donation Data">
            <ul>
              <li>Donation amount, purpose, and selected payment method</li>
              <li>Membership fee payment records</li>
              <li>Transaction reference IDs returned by payment gateways</li>
            </ul>
            <p className="mt-2">We do not store card numbers, bank account numbers, or raw payment credentials. All sensitive payment processing is handled by our third-party payment partners (see Section 5).</p>
          </SubSection>
          <SubSection title="2.8 Authentication Tokens">
            <p>When you log in, we store a JWT authentication token on your device using platform-native encrypted storage (Android Keystore / iOS Keychain). This token is used to authenticate your requests to our servers and is never shared with third parties.</p>
          </SubSection>
          <SubSection title="2.9 App Usage & Notification Data">
            <ul>
              <li>IDs of notifications you have already seen (stored locally to prevent duplicates)</li>
              <li>Your selected app language (Amharic or English)</li>
              <li>Network connectivity status (online/offline) — used locally only</li>
            </ul>
            <p className="mt-2">We do not collect analytics, crash reports, device identifiers (IMEI, advertising ID), or any behavioral tracking data.</p>
          </SubSection>
        </Section>

        <Section title="3. How We Use Your Information">
          <ul>
            <li>Create and manage your ERCS membership or volunteer account.</li>
            <li>Process membership fee payments and charitable donations.</li>
            <li>Issue and display your ERCS digital membership card and QR code.</li>
            <li>Verify your membership when your ID is scanned by ERCS officials.</li>
            <li>Send in-app notifications about your registration status, payment confirmations, and ERCS news.</li>
            <li>Display news, programs, and emergency updates from ERCS.</li>
            <li>Allow you to view and update your own profile information.</li>
            <li>Support offline access by caching your profile data securely on-device.</li>
          </ul>
        </Section>

        <Section title="4. Data Storage & Security">
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left p-3 border border-gray-200 font-black text-black">Data Type</th>
                  <th className="text-left p-3 border border-gray-200 font-black text-black">Where Stored</th>
                  <th className="text-left p-3 border border-gray-200 font-black text-black">Encrypted?</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Auth token, user ID, role", "On-device (Android Keystore / iOS Keychain)", "Yes — platform-native encryption"],
                  ["Full profile cache", "On-device encrypted storage", "Yes — platform-native encryption"],
                  ["Seen notification IDs, language", "On-device SharedPreferences", "No — non-sensitive preference data only"],
                  ["All personal profile data", "ERCS backend server", "Yes — TLS in transit, encrypted at rest"],
                  ["Profile photos", "ERCS object storage (MinIO)", "TLS in transit"],
                  ["Donation records", "ERCS backend server", "Yes — TLS in transit, encrypted at rest"],
                ].map(([type, where, enc], i) => (
                  <tr key={i}>
                    <td className="p-3 border border-gray-200">{type}</td>
                    <td className="p-3 border border-gray-200">{where}</td>
                    <td className="p-3 border border-gray-200">{enc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3">All communication between the App and our servers uses HTTPS/TLS encryption. Passwords are hashed before storage and never stored in plain text.</p>
        </Section>

        <Section title="5. Third-Party Services">
          <p>The App integrates the following third-party payment services. When you initiate a payment, relevant transaction information is shared with the provider handling your transaction:</p>
          <div className="overflow-x-auto mt-3">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left p-3 border border-gray-200 font-black text-black">Service</th>
                  <th className="text-left p-3 border border-gray-200 font-black text-black">Purpose</th>
                  <th className="text-left p-3 border border-gray-200 font-black text-black">Data Shared</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["ArifPay", "Mobile money payments (TELEBIRR, CBEBirr, MPESA, EBIRR, AWASH BIRR)", "Amount, description, email, phone number"],
                ].map(([svc, purpose, data], i) => (
                  <tr key={i}>
                    <td className="p-3 border border-gray-200 font-bold">{svc}</td>
                    <td className="p-3 border border-gray-200">{purpose}</td>
                    <td className="p-3 border border-gray-200">{data}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3">Each provider is governed by their own privacy policy. We recommend reviewing their policies before making a payment. Our server holds the API secret keys; they are never exposed to the App.</p>
        </Section>

        <Section title="6. App Permissions">
          <ul>
            <li><strong>Internet</strong> — required to connect to ERCS servers.</li>
            <li><strong>Post Notifications</strong> — to send you updates about your membership and ERCS news (Android 13+, requires your consent).</li>
            <li><strong>Receive Boot Completed</strong> — to restart the background notification checker after your device reboots.</li>
            <li><strong>Camera / Photo Library</strong> — only accessed if you choose to upload a profile photo. Not accessed otherwise.</li>
          </ul>
          <p className="mt-2">We do not request location, contacts, microphone, or any other permissions.</p>
        </Section>

        <Section title="7. Who We Share Data With">
          <ul>
            <li><strong>Ethiopian Red Cross Society (ERCS)</strong> — your registration and membership data is shared with ERCS to process your membership application, issue your ERCS ID, and manage volunteer assignments.</li>
            <li><strong>Payment processors</strong> — limited transaction data as described in Section 5.</li>
            <li><strong>Legal authorities</strong> — we may disclose information if required by Ethiopian law or to protect the safety of users.</li>
          </ul>
          <p className="mt-2">We do not sell, rent, or trade your personal data to any third party for commercial purposes.</p>
        </Section>

        <Section title="8. Data Retention">
          <p>We retain your account and membership data for as long as your account is active, plus any period required by applicable law. If you request account deletion, we will remove your personal data from our systems within 30 days, except where retention is required by law.</p>
        </Section>

        <Section title="9. Your Rights">
          <p>You have the right to:</p>
          <ul>
            <li><strong>Access</strong> — request a copy of the personal data we hold about you.</li>
            <li><strong>Correction</strong> — update your profile directly in the App at any time, or contact us for corrections we cannot process in-app.</li>
            <li><strong>Deletion</strong> — request deletion of your account and associated personal data.</li>
            <li><strong>Portability</strong> — request your data in a common machine-readable format.</li>
          </ul>
          <p className="mt-2">
            To exercise any of these rights, contact us at{" "}
            <a href="mailto:daftechcomputerengineering@gmail.com" className="text-[#ED1C24] underline">
              daftechcomputerengineering@gmail.com
            </a>. We will respond within 30 days.
          </p>
        </Section>

        <Section title="10. Children's Privacy">
          <p>The App is not directed at children under the age of 13. We do not knowingly collect personal data from children. If we become aware that a child under 13 has registered, we will delete their account promptly.</p>
        </Section>

        <Section title="11. Changes to This Policy">
          <p>We may update this Privacy Policy from time to time. Material changes will be announced through an in-app notification. The date at the top of this page reflects the most recent revision. Continued use of the App after changes take effect constitutes acceptance of the updated policy.</p>
        </Section>

        <Section title="12. Contact Us">
          <p><strong>DAFTech Computer</strong></p>
          <p>Developer of the ERCS Member Portal App</p>
          <p className="mt-1">
            Email:{" "}
            <a href="mailto:daftechcomputerengineering@gmail.com" className="text-[#ED1C24] underline">
              daftechcomputerengineering@gmail.com
            </a>
          </p>
        </Section>
      </div>

      {/* Footer */}
      <div className="bg-gray-50 border-t border-gray-100 py-8 px-6 text-center text-xs text-gray-400 font-medium">
        ERCS – Ethiopian Red Cross Society Member Portal · Developed by DAFTech Computer · © 2026 All rights reserved.
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border-b border-gray-100 pb-10 last:border-0">
      <h2 className="text-xl font-black text-black mb-4">{title}</h2>
      <div className="text-gray-600 space-y-2 leading-relaxed [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-1.5 [&_strong]:text-black">
        {children}
      </div>
    </div>
  );
}

function SubSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-4">
      <h3 className="font-bold text-black mb-2">{title}</h3>
      <div className="space-y-1">{children}</div>
    </div>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="ml-1 text-xs text-gray-400 font-normal">{children}</span>
  );
}
