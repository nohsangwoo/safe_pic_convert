import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Script from 'next/script'

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
  title: "Multi-Format Image Converter | Free Online Tool",
  description: "Convert images between WebP, PNG, JPEG, BMP, GIF, and TIFF formats for free. Privacy-focused online tool with no server uploads for safe and fast conversions.",
  keywords: [
    // 한국어 키워드
    "이미지 포맷 변환, WebP 변환, PNG 변환, JPEG 변환, BMP 변환, GIF 변환, TIFF 변환, 온라인 이미지 변환, 개인정보 보호, 서버리스 변환, 무료 이미지 도구",
    // 영어 키워드
    "image format converter, convert to WebP, convert to PNG, convert to JPEG, convert to BMP, convert to GIF, convert to TIFF, online image conversion, privacy-focused, serverless conversion, free image tool",
    // 중국어 키워드
    "图像格式转换器, 转换为WebP, 转换为PNG, 转换为JPEG, 转换为BMP, 转换为GIF, 转换为TIFF, 在线图像转换, 隐私保护, 无服务器转换, 免费图像工具",
    // 일본어 키워드
    "画像フォーマット変換, WebPに変換, PNGに変換, JPEGに変換, BMPに変換, GIFに変換, TIFFに変換, オンライン画像変換, プライバシー保護, サーバーレス変換, 無料画像ツール",
    // 러시아어 키워드
    "конвертер форматов изображений, конвертировать в WebP, конвертировать в PNG, конвертировать в JPEG, конвертировать в BMP, конвертировать в GIF, конвертировать в TIFF, онлайн конвертация изображений, защита конфиденциальности, бессерверное преобразование, бесплатный инструмент для изображений"
  ].join(", "),
  openGraph: {
    title: "Multi-Format Image Converter - Supporting WebP, PNG, JPEG, BMP, GIF, TIFF",
    description: "Free online image conversion tool focused on privacy. Safely convert between WebP, PNG, JPEG, BMP, GIF, and TIFF formats without server uploads.",
    images: [
      {
        url: "https://imgconv.ludgi.ai/logo.webp",
        width: 1200,
        height: 630,
        alt: "Multi-Format Image Converter",
      },
    ],
    locale: "en_US",
    alternateLocale: ["ko_KR", "zh_CN", "ja_JP", "ru_RU"],
  },
  twitter: {
    title: "Multi-Format Image Converter - Supporting WebP, PNG, JPEG, BMP, GIF, TIFF",
    description: "Free online image conversion tool focused on privacy. Safely convert between WebP, PNG, JPEG, BMP, GIF, and TIFF formats without server uploads.",
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
      <head>
        <meta name="google-adsense-account" content={pubId} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${pubId}`}
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
        {/* Google Funding Choices 스크립트 */}
        <Script
          id="google-funding-choices"
          strategy="afterInteractive"
          src={`https://fundingchoicesmessages.google.com/i/${pubId}?ers=1`}
        />
        {/* Google FC Present 스크립트 */}
        <Script
          id="google-fc-present"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function() {function signalGooglefcPresent() {if (!window.frames['googlefcPresent']) {if (document.body) {const iframe = document.createElement('iframe'); iframe.style = 'width: 0; height: 0; border: none; z-index: -1000; left: -1000px; top: -1000px;'; iframe.style.display = 'none'; iframe.name = 'googlefcPresent'; document.body.appendChild(iframe);} else {setTimeout(signalGooglefcPresent, 0);}}}signalGooglefcPresent();})();`
          }}
        />
      </body>
    </html>
  );
}
