import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "../components/header";
import { Toaster } from "@/components/ui/sonner";
import { Footer } from "../components/footer";
import { cookies } from "next/headers"; 

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Фрэйм - магазин фототехники",
  description: "Интернет-магазин фототехники",
};


export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {


  const cookieStore = await cookies();
  const isAuthenticated = !!cookieStore.get("userId")?.value;

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Header isAuthenticated={isAuthenticated} />

        <main className="pt-20">
          {children}
        </main>

        <Footer />
        <Toaster position="bottom-right" richColors />
      </body>
    </html>
  );
}