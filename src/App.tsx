import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import AayeinBaingan from "./pages/AayeinBaingan";
import UlluFeed from "./pages/ullu";
import UlluPravachan from "./pages/ullu/[slug]";
import AdminShell from "./pages/AdminShell";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/aayein-baigan" element={<AayeinBaingan />} />
          <Route path="/admin" element={<AdminShell />} />
          <Route path="/ullu" element={<UlluFeed />} />
          <Route path="/ullu/:slug" element={<UlluPravachan />} />
          <Route path="*" element={<AayeinBaingan is404={true} />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
