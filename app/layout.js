import Footer from "@/components/layout/footer";
import "./globals.css";
import { Providers } from "./providers";
import { Roboto_Mono } from "next/font/google";

const robotoMonoBold = Roboto_Mono({
  weight: '600',
  subsets: ['latin'],
  variable: '--font-roboto-mono-bold',
});

export const metadata = {
  title: "BAG Dapp - TON",
  description: "BAG Dapp on TON blockchain",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${robotoMonoBold.className} dark`}>
      <body className="text-white min-h-[97vh] navbarBackground">
        <Providers>
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}