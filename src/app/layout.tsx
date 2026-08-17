import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Inter, JetBrains_Mono, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
});

export const metadata: Metadata = {
  title: "Nexus AI — One AI. Unlimited Creation.",
  description: "The autonomous unified AI platform for websites, portfolios, conversational AI, ATS resume scoring, and enterprise document RAG.",
  openGraph: {
    title: "Nexus AI — One AI. Unlimited Creation.",
    description: "Generate websites, deploy portfolios, optimize resumes, and query knowledge bases in one workspace.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: '#00F0FF',
          colorBackground: '#131722',
          colorInputBackground: '#0A0D14',
          colorInputText: '#F9FAFB',
          colorText: '#F9FAFB',
          colorTextSecondary: '#9CA3AF',
          colorTextOnPrimary: '#08090C',
          colorDanger: '#EF4444',
          colorSuccess: '#10B981',
          colorWarning: '#F59E0B',
          borderRadius: '0.75rem',
          fontFamily: 'Plus Jakarta Sans, Inter, sans-serif',
        },
        elements: {
          card: 'bg-[#131722] border border-[#1E2433] text-white shadow-2xl',
          headerTitle: 'text-white font-bold',
          headerSubtitle: 'text-gray-400',
          formButtonPrimary: 'bg-gradient-to-r from-cyan-400 to-blue-500 text-black hover:from-cyan-300 hover:to-blue-400 font-bold',
          formFieldInput: 'bg-[#0A0D14] border-[#1E2433] text-white focus:border-cyan-400 placeholder:text-gray-500',
          footerActionLink: 'text-cyan-400 hover:text-cyan-300',
          dividerLine: 'border-gray-700',
          socialButtonsBlockButton: 'bg-[#0A0D14] border-[#1E2433] text-white hover:bg-[#131722] hover:border-cyan-400',
          socialButtonsBlockButtonText: 'text-white',
          formFieldLabel: 'text-gray-300',
          formFieldHintText: 'text-gray-500',
          identityPreviewText: 'text-white',
          identityPreviewTextSecondary: 'text-gray-400',
        },
      }}
    >
      <html lang="en" className="dark">
        <body
          className={`${inter.variable} ${plusJakarta.variable} ${jetbrainsMono.variable} font-sans bg-[#08090C] text-[#F9FAFB] min-h-screen antialiased selection:bg-cyan-500 selection:text-black`}
        >
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
