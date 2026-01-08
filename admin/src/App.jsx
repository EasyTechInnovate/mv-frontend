import { useState } from "react";
import { Toaster } from "sonner";
import "react-datepicker/dist/react-datepicker.css";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Header from "./components/common/Header";
import Sidebar from "./components/common/Sidebar";
import Dashboard from "./pages/dashboard/Dashboard";
import UserManagement from "./pages/user-management/UserManagement";
import ReleaseManagement from "./pages/release-management/ReleaseManagement";
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
import UnifiedSettingsPage from "./pages/company-settings/CompanySettings"
import MVProductionManagement from "./pages/mv-production/MvProductionManagement";
import AggregatorManagement from "./pages/aggregator-management/AggregatorManagement";
function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [theme, setTheme] = useState("dark");
  const location = useLocation();

  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");


  const isLoginPage = location.pathname === "/admin/login";


  if (isLoginPage) {
    return (
      <div>
        <AdminLogin theme={theme} />
      </div>
    );
  }


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

        <main className={`flex-1 p-4  overflow-y-auto min-w-0 ${theme === "dark" ? "bg-[#111A22]" : "bg-white"}`}>
          <Routes>
            <Route path="/" element={<Navigate to="/admin/login" replace />} />
            <Route path="/admin" element={<Navigate to="/admin/login" replace />} />
            <Route path="/admin/dashboard" element={<Dashboard theme={theme} />} />
            <Route path="/admin/user-management" element={<UserManagement theme={theme} />} />
            <Route path="/admin/release-management" element={<ReleaseManagement theme={theme} />} />
            <Route path="/admin/release-management/:userId/:userName" element={<ReleaseManagement theme={theme} />} />
            <Route path="/admin/bonus-management" element={<BonusManagement theme={theme} />} />
            <Route path="/admin/kyc-management" element={<KycManagement theme={theme} />} />
            <Route path="/admin/aggregator-management" element={<AggregatorManagement theme={theme} />} />
            <Route path="/admin/analytics-management" element={<AnalyticsManagement theme={theme} />} />
            <Route path="/admin/month-management" element={<MonthManagement theme={theme} />} />
            <Route path="/admin/royalty-management" element={<RoyaltyManagement theme={theme} />} />
            <Route path="/admin/wallet-&-transactions" element={<WalletTransactions theme={theme} />} />
            <Route path="/admin/mcn-management" element={<MCNManagement theme={theme} />} />
            <Route path="/admin/mcn-royality" element={<MCNMonthManagement theme={theme} />} />
            <Route path="/admin/team-management" element={<TeamManagement theme={theme} />} />
            <Route path="/admin/subscription-plans" element={<SubscriptionPlans theme={theme} />} />
            <Route path="/admin/playlist-pitching" element={<PlaylistPitching theme={theme} />} />
            <Route path="/admin/advertisement-plans" element={<AdvertisementRequests theme={theme} />} />
            <Route path="/admin/synchronization-(sync)" element={<SyncManagement theme={theme} />} />
            <Route path="/admin/merch-store-management" element={<MerchStoreManagement theme={theme} />} />
            <Route path="/admin/notifications" element={<NotificationPage theme={theme} />} />
            <Route path="/admin/newsletter" element={<Newsletter theme={theme} />} />
            <Route path="/admin/help-&-support" element={<HelpSupport theme={theme} />} />
            <Route path="/admin/testimonials" element={<TestimonialManager theme={theme} />} />
            <Route path="/admin/trending-artists" element={<TrendingArtistsManager theme={theme} />} />
            <Route path="/admin/trending-labels" element={<TrendingLabelsManager theme={theme} />} />
            <Route path="/admin/faq-management" element={<FaqManager theme={theme} />} />
            <Route path="/admin/blog-management" element={<BlogManagement theme={theme} />} />
            <Route path="/admin/news-management" element={<NewsManagement theme={theme} />} />
            <Route path="/admin/company-settings" element={<UnifiedSettingsPage theme={theme} />} />
            <Route path="/admin/mv-production" element={<MVProductionManagement theme={theme} />} />
          </Routes>
        </main>
      </div>
      <Toaster position="top-right" richColors theme={theme === "dark" ? "dark" : "light"} />
    </div>
  );
}

export default App;
