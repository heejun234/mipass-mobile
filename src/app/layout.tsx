import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'iJANUS Na - Mobile',
  description: 'iJANUS Na - Mobile Project',
  icons: {
    icon: '/icons/logo.svg',
  },
};

/** 모바일: CSS 픽셀 기준으로 레이아웃 폭 맞춤, 노치·홈 인디케이터는 safe-area로 처리 */
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang='en'
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className='min-h-full flex flex-col'>
        <div className='flex flex-col flex-1 items-center justify-center'>
          <main className='flex flex-1 w-full flex-col p-6'>
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
