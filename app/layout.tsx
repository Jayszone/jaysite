import type { Metadata, Viewport } from "next";
import "@fontsource-variable/eb-garamond";
import "@fontsource-variable/eb-garamond/wght-italic.css";
import "@fontsource-variable/inter";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ClickTheme from "@/components/ClickTheme";
import { getSite } from "@/lib/content";
import { themeCss } from "@/lib/themes";

const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(base),
  title: { default: "Jay Naik, AI Product Builder", template: "%s · Jay Naik" },
  description: "Personal site of Jay Naik: AI product builder, engineer and MBA student. Work, curiosities and writing.",
  openGraph: { type: "website", siteName: "Jay Naik", title: "Jay Naik", description: "Work, curiosities and writing." },
  twitter: { card: "summary_large_image" },
};
export const viewport: Viewport = { themeColor: "#fbfbf9" };

const themeScript = "try{var t=localStorage.getItem('theme');if(t)document.documentElement.dataset.theme=t}catch(e){}";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const site = getSite();
  return (
    <html lang="en" suppressHydrationWarning>
      <head><style dangerouslySetInnerHTML={{ __html: themeCss() }} /><script dangerouslySetInnerHTML={{ __html: themeScript }} /></head>
      <body>
        <a href="#main" className="skip">Skip to content</a>
        <Header />
        <main id="main" className="page">{children}</main>
        <ClickTheme />
        <Footer name={site.name} timezone={site.timezone} place={site.place} />
      </body>
    </html>
  );
}
