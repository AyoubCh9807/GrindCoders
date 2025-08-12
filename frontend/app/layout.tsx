import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ProblemsProvider } from "./contexts/ProblemsProvider";
import { Navbar } from "@/components/Navbar";
import { Toaster } from "react-hot-toast";
import { Footer } from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GrindCoder",
  description: "Grind coding at peace",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ProblemsProvider>
          <Navbar />
          {children}
          <Toaster
            toastOptions={{
              duration: 4000,
              position: "bottom-left",
              style: {
                background: "#333",
                color: "#fff",
              },
              iconTheme: {
                primary: "green",
                secondary: "#fff",
              },
            }}
          />
        </ProblemsProvider>
        <Footer />
      </body>
    </html>
  );
}
