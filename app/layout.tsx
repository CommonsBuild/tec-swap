import Providers from "@/app/providers";
import type { Metadata } from "next";
import { Bai_Jamjuree, Chakra_Petch, Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const bayJamjuree = Bai_Jamjuree({
  subsets: ["latin"],
  variable: "--font-bay-jamjuree",
  weight: ["200", "300", "400", "500", "600", "700"],
});

const chackra = Chakra_Petch({
  subsets: ["latin"],
  variable: "--font-chakra-petch",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "TEC Swap",
  description:
    "Mint and burn $TEC while supporting the ecosystem with every swap.",
  icons: {
    icon: [
      { rel: "icon", url: "/favicon.ico", sizes: "any" },
      {
        rel: "icon",
        url: "/favicon-32x32.png",
        sizes: "32x32",
        type: "image/png",
      },
      {
        rel: "icon",
        url: "/favicon-16x16.png",
        sizes: "16x16",
        type: "image/png",
      },
    ],
    apple: "/apple-touch-icon.png",
    other: [{ rel: "manifest", url: "/site.webmanifest" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${bayJamjuree.variable} ${chackra.variable} antialiased`}
      >
        <Providers>
          {children}
          <SpeedInsights />
          <Analytics />
        </Providers>
        <Toaster />
      </body>
    </html>
  );
}
