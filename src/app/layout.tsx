import './globals.css';

export const metadata = {
  title: 'Vehicle Document Manager',
  description: 'Manage your vehicle documents and get expiry notifications',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}