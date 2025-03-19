import "./globals.css";

export const metadata = {
  title: "Supabase by example",
  description: "Supabase by example showcasing it's auth features.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
