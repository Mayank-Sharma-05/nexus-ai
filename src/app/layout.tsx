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
        elements: {
          card: "bg-[#131722] border border-[#1E2433] text-white shadow-2xl",
          headerTitle: "text-white font-bold",
          headerSubtitle: "text-gray-400",
          formButtonPrimary: "bg-cyan-400 text-black hover:bg-cyan-300 font-bold",
          formFieldInput: "bg-[#0A0D14] border-[#1E2433] text-white focus:border-cyan-400",
          footerActionLink: "text-cyan-400 hover:text-cyan-300",
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
