import type { Metadata } from "next";
import { Arvo, Inter } from "next/font/google";
import { GTM_ID } from '@/utils/analytics';
import "./globals.css";

// Fuente para títulos y encabezados
const arvo = Arvo({
  variable: "--font-arvo",
  weight: ["400", "700"],
  subsets: ["latin"],
});

// Fuente para textos de interfaz, botones y formularios
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AONL 2027 Inspiring Leaders",
  description: "Celebrate 2027 Inspiring Leaders with a personalized badge.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${arvo.variable} ${inter.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{
          __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','${GTM_ID}');`
        }} />
      </head>
      <body className="font-sans antialiased bg-[#f4f7f8] text-gray-900">
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        {children}
      </body>
    </html>
  );
}