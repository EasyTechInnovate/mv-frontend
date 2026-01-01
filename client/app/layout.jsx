import { Poppins } from "next/font/google";
import "./globals.css";

import { Toaster } from "sonner";
import { Toaster as HotToaster } from "react-hot-toast";
import { MediaQueryProvider } from "@/contexts/MediaQueryContext";
import { CompanyInfoProvider } from "@/contexts/CompanyInfoContext";

const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});



export const metadata = {
  title: "Maheshwari Visuals",
  description: "Natural skincare products for healthy, glowing skin",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${poppins.className} antialiased`}
      >
        <CompanyInfoProvider>
          <MediaQueryProvider>
            {children}

            {/* Sonner Toaster - existing */}
            <Toaster
              position="top-right"
              richColors
              expand={true}
              duration={4000}
              closeButton
            />

            {/* React Hot Toast - for API notifications */}
            <HotToaster
              position="top-center"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#1F2937',
                  color: '#fff',
                  border: '1px solid #374151',
                },
                success: {
                  iconTheme: {
                    primary: '#10B981',
                    secondary: '#fff',
                  },
                },
                error: {
                  iconTheme: {
                    primary: '#EF4444',
                    secondary: '#fff',
                  },
                },
              }}
            />
          </MediaQueryProvider>
        </CompanyInfoProvider>
      </body>
    </html>
  );
}
