import type { Metadata, Viewport } from "next";
import { Noto_Sans_Thai } from "next/font/google";
import "./globals.css";

const notoSansThai = Noto_Sans_Thai({
  subsets: ["thai", "latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Clinic CRM — ระบบบริหารจัดการข้อมูลคลินิก",
  description: "ระบบ CRM สำหรับจัดการข้อมูลคลินิกทันตกรรม ความงาม และเวชกรรม",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Clinic CRM",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
  themeColor: "#060d18",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th" className="h-full">
      <body className={`${notoSansThai.className} min-h-full antialiased`}>
        {children}
      </body>
    </html>
  );
}
