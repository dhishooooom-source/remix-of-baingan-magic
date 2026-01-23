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
import UlluAdminDashboard from "./pages/ullu-admin";
import UlluAuth from "./pages/ullu-admin/Auth";
import UlluEditor from "./pages/ullu-admin/Editor";

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

          {/* Ullu Custom CMS Routes */}
          <Route path="/ullu-admin" element={<UlluAdminDashboard />} />
          <Route path="/ullu-admin/auth" element={<UlluAuth />} />
          <Route path="/ullu-admin/new" element={<UlluEditor isNew={true} />} />
          <Route path="/ullu-admin/edit/:slug" element={<UlluEditor />} />

          <Route path="*" element={<AayeinBaingan is404={true} />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
