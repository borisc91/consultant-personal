import type { Metadata } from "next";
import { Inter, Fraunces, Instrument_Serif, JetBrains_Mono } from "next/font/google";
import "../globals.css";
import { findRoute, getSiteStructure } from "@/lib/content";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  style: "normal",
  display: "swap",
  preload: false,
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  title: "Boris | SEO Consultant",
  description: "A world-class senior SEO consultant portfolio.",
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    shortcut: ["/icon.svg"],
  },
};

type Props = Readonly<{
  children: React.ReactNode;
  params: Promise<{ segments?: string[] }>;
}>;

export default async function RootLayout({ children, params }: Props) {
  const { segments } = await params;
  const route = findRoute(segments);
  const lang = route
    ? getSiteStructure().config.localeHtmlLang[route.locale]
    : getSiteStructure().config.localeHtmlLang.en;

  return (
    <html
      lang={lang}
      className={`${inter.variable} ${fraunces.variable} ${instrumentSerif.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body
        suppressHydrationWarning
        className="min-h-full flex flex-col bg-slate-50 text-slate-900 selection:bg-blue-100 font-sans"
      >
        {children}
      </body>
    </html>
  );
}
