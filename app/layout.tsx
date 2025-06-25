import type { Metadata } from "next";
import { Noto_Sans } from "next/font/google";
import CustomCursor from "./components/CustomCursor";
import "./globals.css";

const notoSans = Noto_Sans({
  variable: "--font-noto-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: 'swap',
  preload: true,
  fallback: ['system-ui', 'arial'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://matthewabrahim.com'), // Update with actual URL
  title: {
    default: "Matthew Abraham - Software Architect & Developer",
    template: "%s | Matthew Abraham"
  },
  description: "Lead developer specializing in Front End, Back End, and Mobile development. Software Architect and Problem Solver.",
  keywords: ["Matthew Abraham", "Software Architect", "Developer", "Front End", "Back End", "Mobile", "Portfolio"],
  authors: [{ name: "Matthew Abraham" }],
  creator: "Matthew Abraham",
  openGraph: {
    type: "website",
    locale: "en_US",
    title: "Matthew Abraham - Software Architect & Developer",
    description: "Lead developer specializing in Front End, Back End, and Mobile development.",
    siteName: "Matthew Abraham Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Matthew Abraham - Software Architect & Developer",
    description: "Lead developer specializing in Front End, Back End, and Mobile development.",
    creator: "@matthewabrahim", // Update with actual handle
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#0a0a0a',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${notoSans.variable} font-sans antialiased`}
      >
        <CustomCursor />
        {children}
      </body>
    </html>
  );
}
