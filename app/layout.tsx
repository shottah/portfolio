import type { Metadata } from "next";
import { Source_Code_Pro } from "next/font/google";
import ThemeToggle from "./components/ThemeToggle";
import "./globals.css";

const sourceCodePro = Source_Code_Pro({
  variable: "--font-source-code",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://matthewabrahim.com'),
  title: "Matthew Abraham",
  description: "Software Engineer",
  authors: [{ name: "Matthew Abraham" }],
  creator: "Matthew Abraham",
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#1a1a1a',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${sourceCodePro.variable} font-mono antialiased`}>
        <ThemeToggle />
        {children}
      </body>
    </html>
  );
}
