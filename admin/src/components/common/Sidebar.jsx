"use client";
import { Link } from "react-router-dom";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Users, Activity, Rocket, IdCard, DollarSign, ChartColumnIncreasing, CalendarDays, Wallet, ShoppingBag, CreditCard, Megaphone, BookOpen, Globe, Database, Bell, Headset, FileText, Package, Newspaper, Settings } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

// Module name constants — must match EModuleAccess values
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
};

export default function Sidebar({ isCollapsed = false, theme }) {
  const isDark = theme === "dark";
  const { isAdmin, hasAccess } = useAuth();

  const sections = [
    {
      value: "user-release",
      label: (
        <span className="flex items-center gap-2">
          <Users className="w-5 h-5" /> USER &amp; RELEASE MANAGEMENT
        </span>
      ),
      links: [
        { label: "User Management", icon: <Users className="w-4 h-4" />, module: M.USER_MGMT },
        { label: "Release Management", icon: <Rocket className="w-4 h-4" />, module: M.RELEASE_MGMT },
        { label: "KYC Management", icon: <IdCard className="w-4 h-4" />, module: M.USER_MGMT },
        { label: "Aggregator Management", icon: <Users className="w-4 h-4" />, module: M.AGGREGATOR },
      ],
    },
    {
      value: "analytics",
      label: (
        <span className="flex items-center gap-2">
          <ChartColumnIncreasing className="w-5 h-5" /> DATA &amp; ANALYTICS
        </span>
      ),
      links: [
        { label: "Month Management", icon: <CalendarDays className="w-4 h-4" />, module: M.ANALYTICS },
        { label: "Analytics Management", icon: <ChartColumnIncreasing className="w-4 h-4" />, module: M.ANALYTICS },
        { label: "Bonus Management", icon: <DollarSign className="w-4 h-4" />, module: M.ROYALTY },
        { label: "Royalty Management", icon: <DollarSign className="w-4 h-4" />, module: M.ROYALTY },
        { label: "MCN Royality", icon: <CalendarDays className="w-4 h-4" />, module: M.MCN },
        { label: "Wallet & Transactions", icon: <Wallet className="w-4 h-4" />, module: M.FINANCIAL },
      ],
    },
    {
      value: "mcn",
      label: (
        <span className="flex items-center gap-2">
          <ShoppingBag className="w-5 h-5" /> MCN &amp; BUSINESS
        </span>
      ),
      links: [
        { label: "MCN Management", icon: <ShoppingBag className="w-4 h-4" />, module: M.MCN },
        { label: "Team Management", icon: <Users className="w-4 h-4" />, module: M.TEAM },
        { label: "Subscription Plans", icon: <CreditCard className="w-4 h-4" />, module: M.SYSTEM },
      ],
    },
    {
      value: "marketing",
      label: (
        <span className="flex items-center gap-2">
          <Megaphone className="w-5 h-5" /> MARKETING
        </span>
      ),
      links: [
        { label: "Playlist Pitching", icon: <BookOpen className="w-4 h-4" />, module: M.CONTENT },
        { label: "MV Production", icon: <Activity className="w-4 h-4" />, module: M.CONTENT },
        { label: "Synchronization (SYNC)", icon: <Database className="w-4 h-4" />, module: M.CONTENT },
        { label: "Merch Store Management", icon: <ShoppingBag className="w-4 h-4" />, module: M.MERCH },
      ],
    },
    {
      value: "communications",
      label: (
        <span className="flex items-center gap-2">
          <Bell className="w-5 h-5" /> COMMUNICATIONS
        </span>
      ),
      links: [
        { label: "Notifications", icon: <Bell className="w-4 h-4" />, module: null },
        { label: "Help & Support", icon: <Headset className="w-4 h-4" />, module: M.SUPPORT },
      ],
    },
    {
      value: "content",
      label: (
        <span className="flex items-center gap-2">
          <FileText className="w-5 h-5" /> CONTENT MANAGEMENT
        </span>
      ),
      links: [
        { label: "Testimonials", icon: <FileText className="w-4 h-4" />, module: M.CONTENT },
        { label: "Trending Artists", icon: <Users className="w-4 h-4" />, module: M.CONTENT },
        { label: "Trending Labels", icon: <Package className="w-4 h-4" />, module: M.CONTENT },
        { label: "FAQ Management", icon: <FileText className="w-4 h-4" />, module: M.CONTENT },
      ],
    },
    {
      value: "config",
      label: (
        <span className="flex items-center gap-2">
          <Settings className="w-5 h-5" /> CONFIGURATION
        </span>
      ),
      links: [
        { label: "Company Settings", icon: <Globe className="w-4 h-4" />, module: M.SYSTEM },
      ],
    },
  ];

  return (
    <div
      className={[
        "h-screen overflow-y-auto overflow-x-hidden pb-20 flex flex-col p-3 text-sm transition-all duration-300 custom-scrollbar",
        isDark
          ? "bg-[#111A22] text-gray-300 border-r border-gray-800"
          : "bg-white text-[#111A22] border-r border-gray-300",
      ].join(" ")}
    >
      <div className="mb-4 pb-2">
        {!isCollapsed && (
          <>
            <h1
              className={`text-base font-bold ${
                isDark ? "text-white" : "text-[#111A22]"
              }`}
            >
              Admin Panel
            </h1>
            <p
              className={`text-xs ${
                isDark ? "text-gray-400" : "text-gray-500"
              } hidden sm:block`}
            >
              Master Control Dashboard
            </p>
          </>
        )}
      </div>

      {!isCollapsed && (
        <div className="mb-4">
          <Link
            to="/admin/dashboard"
            className={`flex items-center gap-2 w-full px-2 py-2 rounded-lg transition ${
              isDark
                ? "hover:bg-[#334155] text-gray-300"
                : "hover:bg-gray-200 text-[#111A22]"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 3h7v7H3V3zm0 11h7v7H3v-7zm11-11h7v7h-7V3zm0 11h7v7h-7v-7z"
              />
            </svg>
            <span
              className={`font-medium text-sm ${
                isDark ? "text-gray-100" : "text-[#111A22]"
              }`}
            >
              Dashboard
            </span>
          </Link>
        </div>
      )}

      {!isCollapsed && (
        <Accordion
          type="multiple"
          defaultValue={[
            "user-release",
            "analytics",
            "mcn",
            "marketing",
            "communications",
            "content",
            "config",
          ]}
          className="space-y-2"
        >
          {sections.map((section) => {
            // Filter links based on module access
            const visibleLinks = section.links.filter(
              (link) => !link.module || isAdmin || hasAccess(link.module)
            );

            // Hide entire section if no links are visible
            if (visibleLinks.length === 0) return null;

            return (
              <AccordionItem key={section.value} value={section.value}>
                <AccordionTrigger
                  className={`text-[11px] font-semibold tracking-wide py-1 transition ${
                    isDark
                      ? "text-gray-400 hover:text-white"
                      : "text-gray-600 hover:text-[#111A22]"
                  }`}
                >
                  {section.label}
                </AccordionTrigger>
                <AccordionContent className="space-y-1 mt-1 pl-2">
                  {visibleLinks.map((link, i) => (
                    <Link
                      key={i}
                      to={`/admin/${link.label.toLowerCase().replace(/\s+/g, "-")}`}
                      className={`flex items-center gap-2 px-2 py-1 rounded-md transition ${
                        isDark
                          ? "hover:bg-gray-800 text-gray-300"
                          : "hover:bg-gray-200 text-gray-800"
                      }`}
                    >
                      {link.icon}
                      <span>{link.label}</span>
                    </Link>
                  ))}
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      )}
    </div>
  );
}