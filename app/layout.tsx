import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'GivePump — meme fees to real fundraisers',
  description: 'A transparent memecoin fee router that turns Pump.fun fee streams into verified GoFundMe donations.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
