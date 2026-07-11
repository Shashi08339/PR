import { Providers } from "./providers";
import "./globals.css";

export const metadata = {
  title: "PR Lens 2.0",
  description: "Premium AI Code Review Engine OS",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#09090B] text-[#FAFAFA] antialiased">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}