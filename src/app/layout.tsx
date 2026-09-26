import type { Metadata } from "next";
import { Cormorant_Garamond, Outfit, Noto_Sans_Tamil } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/luxury/theme-provider";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const tamil = Noto_Sans_Tamil({
  variable: "--font-tamil",
  subsets: ["tamil"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Rameez Jewellerz | ரமீஸ் ஜுவெல்லர்ஸ் — Luxury Gold, Silver & Diamond Jewellery, Valliyur, Tirunelveli",
  description:
    "Rameez Jewellerz (ரமீஸ் ஜுவெல்லர்ஸ்) — Premium 916 Hallmark Gold, Silver, Rose Gold & Diamond Jewellery in Valliyur, Tirunelveli. Since 1991. Customized jewellery, bridal & temple collections. ஒளிரும் அழகு, நிலைக்கும் மதிப்பு.",
  keywords: [
    "Gold Jewellery Valliyur",
    "Gold Jewellery Tirunelveli",
    "916 Hallmark Gold",
    "Silver Jewellery",
    "Rose Gold Jewellery",
    "Wedding Jewellery",
    "Customized Jewellery",
    "Rameez Jewellerz",
    "Temple Jewellery",
    "Diamond Jewellery Tirunelveli",
    "Bridal Jewellery Valliyur",
  ],
  authors: [{ name: "Rameez Jewellerz" }],
  icons: {
    icon: '/rz-logo.png',
    shortcut: '/rz-logo.png',
    apple: '/rz-logo.png',
  },
  openGraph: {
    title: "Rameez Jewellerz — Luxury Jewellery since 1991",
    description: "Premium Gold, Silver & Rose Gold Jewellery crafted with trust, purity and timeless elegance. Valliyur, Tirunelveli.",
    siteName: "Rameez Jewellerz",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Rameez Jewellerz — Luxury Jewellery",
    description: "Premium Gold, Silver & Rose Gold Jewellery. Since 1991. Valliyur, Tirunelveli.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <body
        className={`${cormorant.variable} ${outfit.variable} ${tamil.variable} antialiased bg-background text-foreground`}
      >
        <ThemeProvider>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
