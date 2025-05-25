import { Metadata } from 'next';
import Providers from './providers';

export const metadata: Metadata = {
  title: 'Web Admin Panel',
  description: 'A cloud-based web admin panel with data scraping capabilities',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
} 