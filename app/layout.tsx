
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CommissionEdge | Know Your Value. Shine Brighter.",
  description: "Professional solar commission calculator platform. Compare your current earnings, explore team leadership opportunities, and discover your true potential in solar sales.",
  keywords: "solar commission calculator, solar sales calculator, solar team leader calculator, solar recruiting income, solar careers, commission comparison",
  authors: [{ name: "Beacon Solar Solutions" }],
  viewport: "width=device-width, initial-scale=1",
  robots: "index, follow",
  openGraph: {
    title: "CommissionEdge | Solar Commission Calculator",
    description: "Know Your Value. Shine Brighter. Professional solar commission calculations.",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "CommissionEdge | Solar Commission Calculator", 
    description: "Know Your Value. Shine Brighter. Professional solar commission calculations."
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange={false}
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
