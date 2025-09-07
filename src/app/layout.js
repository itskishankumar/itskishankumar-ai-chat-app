import "./globals.css";

import { SidebarProvider } from "@/components/ui/sidebar";
import { UseSidebar } from "@/components/useSidebar";

export const metadata = {
  title: "itskishankumar ChatApp",
  description: "Interview assignment for levels.fyi",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <SidebarProvider>
          <UseSidebar />
          {children}
        </SidebarProvider>
      </body>
    </html>
  );
}
