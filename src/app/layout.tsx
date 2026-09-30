import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Suspense } from "react";
import { ApplicationNavigation } from "../components/application-navigation";
export const metadata: Metadata = {
    title: "MARKET AI · Simulated research",
    description: "Evidence-backed financial research in a fictional college-project universe.",
};
const inter = Inter({ subsets: ["latin"], display: "swap", variable: "--font-inter" });
export const viewport: Viewport = { width: "device-width", initialScale: 1, viewportFit: "cover" };
export default function RootLayout({ children }: LayoutProps<"/">) {
    return (<html lang="en">
      <body className={inter.variable}><Suspense><ApplicationNavigation/></Suspense>{children}</body>
    </html>);
}
