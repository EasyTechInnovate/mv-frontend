"use client";
import { Link } from "react-router-dom";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Users, Activity, Rocket, IdCard, DollarSign, ChartColumnIncreasing, CalendarDays, Wallet , ShoppingBag , CreditCard ,Megaphone , BookOpen, Globe, Database , Bell, Headset, FileText, Package, Newspaper, Settings    } from "lucide-react";

export default function Sidebar({ isCollapsed = false, theme }) {
  const isDark = theme === "dark";

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
          {[
            {
              value: "user-release",
              label: (
                <span className="flex items-center gap-2">
                  <Users className="w-5 h-5" /> USER & RELEASE MANAGEMENT
                </span>
              ),
              links: [
                { label: "User Management", icon: <Users className="w-4 h-4" /> },
                { label: "Release Management", icon: <Rocket className="w-4 h-4" /> },
                { label: "KYC Management", icon: <IdCard className="w-4 h-4" /> },
                { label: "Aggregator Management", icon: <Users className="w-4 h-4" /> },
              ],
            },
            {
              value: "analytics",
              label:(
                <span className="flex items-center gap-2">
                  <ChartColumnIncreasing className="w-5 h-5" /> DATA & ANALYTICS
                </span>
              ),
              links: [
                { label: "Month Management", icon: <CalendarDays className="w-4 h-4" /> },
                { label: "Analytics Management", icon: <ChartColumnIncreasing className="w-4 h-4" /> },
                { label: "Bonus Management", icon: <DollarSign className="w-4 h-4" /> },
                { label: "Royalty Management", icon: <DollarSign className="w-4 h-4" /> },
                { label: "MCN Royality", icon: <CalendarDays className="w-4 h-4" /> },
                { label: "Wallet & Transactions", icon: <Wallet className="w-4 h-4" /> },
              ],
            },
            {
              value: "mcn",
              label: (
                <span className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5" /> MCN & BUSINESS
                </span>
              ),
              links: [
                { label: "MCN Management", icon: <ShoppingBag className="w-4 h-4" /> },
                { label: "Team Management", icon: <Users className="w-4 h-4" /> },
                { label: "Subscription Plans", icon: <CreditCard className="w-4 h-4" /> },
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
                { label: "Playlist Pitching", icon: <BookOpen className="w-4 h-4" /> },
                { label: "MV Production", icon: <Activity className="w-4 h-4" /> },
                { label: "Advertisement Plans", icon: <Globe className="w-4 h-4" /> },
                { label: "Synchronization (SYNC)", icon: <Database className="w-4 h-4" /> },
                { label: "Merch Store Management", icon: <ShoppingBag className="w-4 h-4" /> },
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
                { label: "Notifications", icon: <Bell className="w-4 h-4" /> },
                { label: "Newsletter", icon: <Bell className="w-4 h-4" /> },
                { label: "Help & Support", icon: <Headset className="w-4 h-4" /> },
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
                { label: "Testimonials", icon: <FileText className="w-4 h-4" /> },
                { label: "Trending Artists", icon: <Users className="w-4 h-4" /> },
                { label: "Trending Labels", icon: <Package className="w-4 h-4" /> },
                { label: "FAQ Management", icon: <FileText className="w-4 h-4" /> },
                { label: "Blog Management", icon: <BookOpen className="w-4 h-4" /> },
                { label: "News Management", icon: <Newspaper  className="w-4 h-4" /> },
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
                { label: "Company Settings", icon: <Globe  className="w-4 h-4" /> },
                ],
            },
          ].map((section) => (
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
                {section.links.map((link, i) => {
                  const isObject = typeof link === "object";
                  const linkLabel = isObject ? link.label : link;
                  const linkIcon = isObject ? link.icon : null;

                  return (
                    <Link
                      key={i}
                      to={`admin/${linkLabel.toLowerCase().replace(/\s+/g, "-")}`}
                      className={`flex items-center gap-2 px-2 py-1 rounded-md transition ${
                        isDark
                          ? "hover:bg-gray-800 text-gray-300"
                          : "hover:bg-gray-200 text-gray-800"
                      }`}
                    >
                      {linkIcon}
                      <span>{linkLabel}</span>
                    </Link>
                  );
                })}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}
    </div>
  );
}
 