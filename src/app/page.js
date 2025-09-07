import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "@/components/ui/sidebar";

export default function Home() {
  return (
    <div className="w-full relative flex justify-center items-center">
      <SidebarTrigger className="absolute top-0 left-0 z-1" />
      <div className="w-full lg:w-1/2">
        <Input placeholder="Ask me anything" />
      </div>
    </div>
  );
}
