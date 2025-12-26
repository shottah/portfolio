import type { Metadata, Viewport } from "next";
import { Source_Code_Pro } from "next/font/google";
import "./globals.css";

const sourceCodePro = Source_Code_Pro({
  variable: "--font-source-code",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://matthewabrahim.com"),
  title: "Matthew Abraham",
  description: "FinTech Engineer | Building Payment Infrastructure for Web3 & Mobile Banking",
  authors: [{ name: "Matthew Abraham" }],
  creator: "Matthew Abraham",
  keywords: ["FinTech", "Web3", "Payment Systems", "Software Engineer", "React", "TypeScript"],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#1a1a1a",
};

// Inline script to set theme before hydration (prevents flash)
const themeScript = `
  (function() {
    const stored = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = stored || (prefersDark ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', theme);
  })();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className={`${sourceCodePro.variable} font-mono antialiased`}>
        {children}
      </body>
    </html>
  );
}
