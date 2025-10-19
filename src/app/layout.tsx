import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { UnitPreferencesProvider } from '@/contexts/unit-preferences-context';
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
  title: 'Unit Converter',
  description: 'Convert between different units of measurement - length, volume, weight, temperature, and time',
  keywords: [
    'unit converter',
    'measurement converter',
    'length converter',
    'volume converter',
    'weight converter',
    'temperature converter',
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider>
          <UnitPreferencesProvider>{children}</UnitPreferencesProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
