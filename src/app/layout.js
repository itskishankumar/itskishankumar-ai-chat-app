import "./globals.css";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"


export const metadata = {
  title: "itskishankumar ChatApp",
  description: "Interview assignment for levels.fyi",
};

export default function RootLayout({ children }) {
  return (
      <html lang='en'>
      <body>
      <SidebarProvider>
          <AppSidebar/>
          <SidebarTrigger/>
          {children}
      </SidebarProvider>
      </body>
</html>
);
}


