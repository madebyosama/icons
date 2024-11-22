import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';

const font = localFont({
  src: './font.woff2',
});

export const metadata: Metadata = {
  title: 'Icons',
  description: 'Simple website to copy svg icons.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className={font.className}>{children}</body>
    </html>
  );
}
