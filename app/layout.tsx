import type { Metadata } from "next"; // Re-add Metadata
import { Inter, Patrick_Hand } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { AppInsights } from "@/components/app-insights";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const patrickHand = Patrick_Hand({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-handwriting",
});

export const metadata: Metadata = {
  title: "TeamBoost",
  description: "Boost your team collaboration.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${patrickHand.variable} font-sans antialiased`}
      >
        <AppInsights />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
