import { useState } from "react";
import { Toaster } from "sonner";
import "react-datepicker/dist/react-datepicker.css";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Header from "./components/common/Header";
import Sidebar from "./components/common/Sidebar";
import ProtectedRoute from "./components/common/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import Dashboard from "./pages/dashboard/Dashboard";
import UserManagement from "./pages/user-management/UserManagement";
import ReleaseManagement from "./pages/release-management/ReleaseManagement";
import EditAdvancedRelease from "./pages/release-management/EditAdvancedRelease";
import EditBasicRelease from "./pages/release-management/EditBasicRelease";
import BonusManagement from "./pages/bonus-management/BonusManagement";
import AnalyticsManagement from "./pages/analytics-management/AnalyticsManagement";
import MonthManagement from "./pages/month-management/MonthManagement";
import RoyaltyManagement from "./pages/royalty-management/RoyaltyManagement";
import WalletTransactions from "./pages/wallet-&-transactions/WalletTransactions";
import MCNManagement from "./pages/mcn-management/MCNManagement";
import TeamManagement from "./pages/team-management/TeamManagement";
import SubscriptionPlans from "./pages/subscription-plans/SubscriptionPlans";
import PlaylistPitching from "./pages/playlist-pitching/PlaylistPitching";
import SyncManagement from "./pages/synchronization-(sync)/Synchronization(SYNC)";
import MCNMonthManagement from "./pages/mcn-royality/MCNMonthManagement";
import AdvertisementRequests from "./pages/advertisment-plans/AdvertisementPlans";
import MerchStoreManagement from "./pages/merch-store-management/MerchStoreManagement";
import NotificationPage from "./pages/notifications/NotificaionsPage";
import Newsletter from "./pages/newsletter/Newsletter";
import HelpSupport from "./pages/help-&-support/HelpSupportPage";
import TestimonialManager from "./pages/testimonials/Testimonials";
import TrendingArtistsManager from "./pages/trending-artists/TrendingArtists";
import TrendingLabelsManager from "./pages/trending-labels/TrendingLabels";
import FaqManager from "./pages/faq-management/FAQManagement";
import BlogManagement from "./pages/blog-management/BlogManagement";
import NewsManagement from "./pages/news-management/NewsManagement";
import AdminLogin from "./auth/SignIn";
import KycManagement from "./pages/kyc-management/KYCManagement";
import UnifiedSettingsPage from "./pages/company-settings/CompanySettings";
import MVProductionManagement from "./pages/mv-production/MvProductionManagement";
import AggregatorManagement from "./pages/aggregator-management/AggregatorManagement";
import AcceptInvitation from "./auth/AcceptInvitation";

// Module name constants — must match EModuleAccess in backend
const M = {
  USER_MGMT: "User Management",
  RELEASE_MGMT: "Release Management",
  ANALYTICS: "Analytics",
  ROYALTY: "Royalty Management",
  FINANCIAL: "Financial Reports",
  MCN: "MCN Management",
  TEAM: "Team Management",
  CONTENT: "Content Management",
  SUPPORT: "Support Tickets",
  SYSTEM: "System Settings",
  MERCH: "Merch Management",
  AGGREGATOR: "Aggregator Management",
  NEWS: "News Management",
};

function AppContent() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [theme, setTheme] = useState("dark");
  const location = useLocation();

  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

  const isAuthPage = location.pathname === "/admin/login" || location.pathname === "/admin/accept-invitation";

  if (isAuthPage) {
    return (
      <div className={theme === "dark" ? "bg-[#111A22]" : "bg-white"}>
        <Routes>
          <Route path="/admin/login" element={<AdminLogin theme={theme} />} />
          <Route path="/admin/accept-invitation" element={<AcceptInvitation theme={theme} />} />
        </Routes>
        <Toaster position="top-right" richColors theme={theme === "dark" ? "dark" : "light"} />
      </div>
    );
  }

  const P = ({ module, children }) => (
    <ProtectedRoute requiredModule={module} theme={theme}>
      {children}
    </ProtectedRoute>
  );

  return (
    <div className={`flex h-screen overflow-hidden ${theme === "dark" ? "bg-[#111A22] text-white" : "bg-gray-100 text-black"}`}>
      {sidebarOpen && (
        <button
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-label="Close sidebar"
        />
      )}

      <aside
        className={[
          "fixed inset-y-0 left-0 z-40 transform transition-transform duration-300",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
          "md:static md:translate-x-0 md:transform-none",
          "w-64",
          sidebarOpen ? "md:w-60" : "md:w-16",
          "md:transition-[width] md:duration-300",
          theme === "dark" ? "bg-[#111A22]" : "bg-gray-200"
        ].join(" ")}
      >
        <Sidebar isCollapsed={!sidebarOpen} theme={theme} />
      </aside>

      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <Header
          onToggleSidebar={() => setSidebarOpen((s) => !s)}
          onToggleTheme={toggleTheme}
          theme={theme}
        />

        <main className={`flex-1 p-4 overflow-y-auto min-w-0 ${theme === "dark" ? "bg-[#111A22]" : "bg-white"}`}>
          <Routes>
            <Route path="/" element={<Navigate to="/admin/login" replace />} />
            <Route path="/admin" element={<Navigate to="/admin/login" replace />} />

            {/* Dashboard — always accessible to logged-in admins/team members */}
            <Route path="/admin/dashboard" element={<Dashboard theme={theme} />} />

            {/* User & Release Management */}
            <Route path="/admin/user-management" element={<P module={M.USER_MGMT}><UserManagement theme={theme} /></P>} />
            <Route path="/admin/release-management" element={<P module={M.RELEASE_MGMT}><ReleaseManagement theme={theme} /></P>} />
            <Route path="/admin/release-management/:userId/:userName" element={<P module={M.RELEASE_MGMT}><ReleaseManagement theme={theme} /></P>} />
            <Route path="/admin/release-management/advanced/edit/:id" element={<P module={M.RELEASE_MGMT}><EditAdvancedRelease theme={theme} /></P>} />
            <Route path="/admin/release-management/basic/edit/:id" element={<P module={M.RELEASE_MGMT}><EditBasicRelease theme={theme} /></P>} />
            <Route path="/admin/kyc-management" element={<P module={M.USER_MGMT}><KycManagement theme={theme} /></P>} />
            <Route path="/admin/aggregator-management" element={<P module={M.AGGREGATOR}><AggregatorManagement theme={theme} /></P>} />

            {/* Data & Analytics */}
            <Route path="/admin/analytics-management" element={<P module={M.ANALYTICS}><AnalyticsManagement theme={theme} /></P>} />
            <Route path="/admin/month-management" element={<P module={M.ANALYTICS}><MonthManagement theme={theme} /></P>} />
            <Route path="/admin/bonus-management" element={<P module={M.ROYALTY}><BonusManagement theme={theme} /></P>} />
            <Route path="/admin/royalty-management" element={<P module={M.ROYALTY}><RoyaltyManagement theme={theme} /></P>} />
            <Route path="/admin/mcn-royality" element={<P module={M.MCN}><MCNMonthManagement theme={theme} /></P>} />
            <Route path="/admin/wallet-&-transactions" element={<P module={M.FINANCIAL}><WalletTransactions theme={theme} /></P>} />

            {/* MCN & Business */}
            <Route path="/admin/mcn-management" element={<P module={M.MCN}><MCNManagement theme={theme} /></P>} />
            <Route path="/admin/team-management" element={<P module={M.TEAM}><TeamManagement theme={theme} /></P>} />
            <Route path="/admin/subscription-plans" element={<P module={M.SYSTEM}><SubscriptionPlans theme={theme} /></P>} />

            {/* Marketing */}
            <Route path="/admin/playlist-pitching" element={<P module={M.CONTENT}><PlaylistPitching theme={theme} /></P>} />
            <Route path="/admin/synchronization-(sync)" element={<P module={M.CONTENT}><SyncManagement theme={theme} /></P>} />
            <Route path="/admin/merch-store-management" element={<P module={M.MERCH}><MerchStoreManagement theme={theme} /></P>} />
            <Route path="/admin/mv-production" element={<P module={M.CONTENT}><MVProductionManagement theme={theme} /></P>} />

            {/* Communications */}
            <Route path="/admin/notifications" element={<NotificationPage theme={theme} />} />
            <Route path="/admin/help-&-support" element={<P module={M.SUPPORT}><HelpSupport theme={theme} /></P>} />

            {/* Content Management */}
            <Route path="/admin/testimonials" element={<P module={M.CONTENT}><TestimonialManager theme={theme} /></P>} />
            <Route path="/admin/trending-artists" element={<P module={M.CONTENT}><TrendingArtistsManager theme={theme} /></P>} />
            <Route path="/admin/trending-labels" element={<P module={M.CONTENT}><TrendingLabelsManager theme={theme} /></P>} />
            <Route path="/admin/faq-management" element={<P module={M.CONTENT}><FaqManager theme={theme} /></P>} />
            <Route path="/admin/press-management" element={<P module={M.NEWS}><NewsManagement theme={theme} /></P>} />

            {/* Configuration */}
            <Route path="/admin/company-settings" element={<P module={M.SYSTEM}><UnifiedSettingsPage theme={theme} /></P>} />
          </Routes>
        </main>
      </div>
      <Toaster position="top-right" richColors theme={theme === "dark" ? "dark" : "light"} />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
