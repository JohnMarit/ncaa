import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { AdminDataProvider } from "@/contexts/AdminDataContext";
import Index from "./pages/Index";
import About from "./pages/About";
import Leadership from "./pages/Leadership";
import Governance from "./pages/Governance";
import Contact from "./pages/Contact";
import Events from "./pages/Events";
import Membership from "./pages/Membership";
import MembershipPayment from "./pages/MembershipPayment";
import Scholarship from "./pages/Scholarship";
import ScholarshipApplication from "./pages/ScholarshipApplication";
import ScholarStory from "./pages/ScholarStory";
import Elections from "./pages/Elections";
import UpcomingEvents from "./pages/UpcomingEvents";
import PastEvents from "./pages/PastEvents";
import EventDetail from "./pages/EventDetail";
import MemberPortal from "./pages/MemberPortal";
import Payments from "./pages/Payments";
import Directory from "./pages/Directory";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import Donate from "./pages/Donate";
import DonationPayment from "./pages/DonationPayment";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";

import AdminDashboard from "./pages/admin/Dashboard";
import AdminMembers from "./pages/admin/Members";
import AdminEvents from "./pages/admin/Events";
import AdminElections from "./pages/admin/Elections";
import AdminLeadership from "./pages/admin/Leadership";
import AdminDocuments from "./pages/admin/Documents";
import AdminPayments from "./pages/admin/Payments";
import AdminSettings from "./pages/admin/Settings";
import AdminScholarships from "./pages/admin/Scholarships";
import AdminTestimonials from "./pages/admin/Testimonials";
import AdminMentors from "./pages/admin/Mentors";
import AdminPartners from "./pages/admin/Partners";
import AdminMessages from "./pages/admin/Messages";
import AdminNotifications from "./pages/admin/Notifications";
import { AdminRoute } from "./components/admin/AdminRoute";
import NotFound from "./pages/NotFound";
import { ScrollToTop } from "./components/ScrollToTop";
import WhatsAppChat from "./components/WhatsAppChat";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <AdminDataProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <ScrollToTop />
            <WhatsAppChat />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/about" element={<About />} />
              <Route path="/leadership" element={<Leadership />} />
              <Route path="/governance" element={<Governance />} />
              <Route path="/membership" element={<Membership />} />
              <Route path="/membership/payment" element={<MembershipPayment />} />
              <Route path="/scholarship" element={<Scholarship />} />
              <Route path="/scholarship/apply" element={<ScholarshipApplication />} />
              <Route path="/scholarship/apply/:scholarshipId" element={<ScholarshipApplication />} />
              <Route path="/scholarship/scholar/:scholarId" element={<ScholarStory />} />
              <Route path="/elections" element={<Elections />} />
              <Route path="/events" element={<Events />} />
              <Route path="/events/upcoming" element={<UpcomingEvents />} />
              <Route path="/events/past" element={<PastEvents />} />
              <Route path="/events/event/:id" element={<EventDetail />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/portal" element={<MemberPortal />} />
              <Route path="/payments" element={<Payments />} />
              <Route path="/directory" element={<Directory />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/terms" element={<TermsOfService />} />
              <Route path="/donate" element={<Donate />} />
              <Route path="/donate/payment" element={<DonationPayment />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />

              {/* Admin Routes - Only accessible through /admin */}
              <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
              <Route path="/admin/members" element={<AdminRoute><AdminMembers /></AdminRoute>} />
              <Route path="/admin/messages" element={<AdminRoute><AdminMessages /></AdminRoute>} />
              <Route path="/admin/events" element={<AdminRoute><AdminEvents /></AdminRoute>} />
              <Route path="/admin/scholarships" element={<AdminRoute><AdminScholarships /></AdminRoute>} />
              <Route path="/admin/testimonials" element={<AdminRoute><AdminTestimonials /></AdminRoute>} />
              <Route path="/admin/mentors" element={<AdminRoute><AdminMentors /></AdminRoute>} />
              <Route path="/admin/partners" element={<AdminRoute><AdminPartners /></AdminRoute>} />
              <Route path="/admin/elections" element={<AdminRoute><AdminElections /></AdminRoute>} />
              <Route path="/admin/leadership" element={<AdminRoute><AdminLeadership /></AdminRoute>} />
              <Route path="/admin/documents" element={<AdminRoute><AdminDocuments /></AdminRoute>} />
              <Route path="/admin/payments" element={<AdminRoute><AdminPayments /></AdminRoute>} />
              <Route path="/admin/notifications" element={<AdminRoute><AdminNotifications /></AdminRoute>} />
              <Route path="/admin/settings" element={<AdminRoute><AdminSettings /></AdminRoute>} />
              {/* Catch-all 404 route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AdminDataProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
