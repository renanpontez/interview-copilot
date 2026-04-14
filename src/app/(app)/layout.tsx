import { Header } from "@/components/layout/header";
import { TooltipProvider } from "@/components/ui/tooltip";
import { WelcomeModal } from "@/components/welcome-modal";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <TooltipProvider>
      <Header />
      <WelcomeModal />
      <div className="flex-1">{children}</div>
    </TooltipProvider>
  );
}
