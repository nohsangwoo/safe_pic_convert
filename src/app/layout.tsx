import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});


export const metadata: Metadata = {
  title: "PrivaConvert | Secure Client-Side Image Conversion",
  description: "Convert images privately and securely in your browser. No server uploads, full privacy.",
  keywords: [
    // 영어 키워드
    "client-side image conversion, private image processing, browser-based image tools, secure file conversion, no-upload image converter, privacy-focused image editing, local image transformation, browser image processing, confidential image handling, offline image converter",
    // 한국어 키워드
    "클라이언트 측 이미지 변환, 개인정보 보호 이미지 처리, 브라우저 기반 이미지 도구, 안전한 파일 변환, 업로드 없는 이미지 변환기, 프라이버시 중심 이미지 편집, 로컬 이미지 변환, 브라우저 이미지 처리, 기밀 이미지 처리, 오프라인 이미지 변환기",
    // 기타 언어 키워드 (간략화)
    "conversion d'images côté client, 客户端图像转换, クライアントサイド画像変換, преобразование изображений на стороне клиента"
  ].join(", "),
  openGraph: {
    title: "PrivaConvert - Secure Client-Side Image Conversion",
    description: "Transform your images privately in-browser. No uploads, full control.",
    // ... 기존 설정 ...
  },
  twitter: {
    title: "PrivaConvert - Secure Client-Side Image Conversion",
    description: "Transform your images privately in-browser. No uploads, full control.",
    // ... 기존 설정 ...
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  // verification: {
  //   google: "추후_추가할_구글_인증_코드",
  //   yandex: "추후_추가할_얀덱스_인증_코드",
  // },
  // ... 기존의 alternates 설정 ...
};

const pubId = "ca-pub-5823741955283998"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
