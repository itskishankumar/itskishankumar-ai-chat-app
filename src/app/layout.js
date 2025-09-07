import "./globals.css";

import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

export const metadata = {
  title: "itskishankumar ChatApp",
  description: "Interview assignment for levels.fyi",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <SidebarProvider className="p-4">
          <AppSidebar />
          {children}
        </SidebarProvider>
      </body>
    </html>
  );
}
