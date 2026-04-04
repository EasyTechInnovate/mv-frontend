import React from 'react'
import {  
  Music, Home, User, Calendar, Upload, Grid3x3, Users, BarChart3, DollarSign, 
  Wallet, Megaphone, Video, Wrench, Store, Bot, HelpCircle, Settings,
  BotMessageSquare, LogOut, Bell ,FileText, RefreshCw, ListMusic
} from 'lucide-react';
import { 
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, 
  SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarFooter
} from '@/components/ui/sidebar';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { logoutUser } from '@/services/auth.services';

const AppSidebar = () => {
  const sidebarSections = [
    {
      title: "MAIN",
      items: [
        { icon: Home, label: "Dashboard", url: "/app" },
        { icon: Bell, label: "Notifications", url: "/app/notifications" },
        { icon: User, label: "Profile", url: "/app/profile" },
        { icon: Calendar, label: "My Plan", url: "/app/plan" },
        { icon: Upload, label: "Upload Release", url: "/app/upload-release" },
        { icon: Grid3x3, label: "Catalog", url: "/app/catalog" }
      ]
    },
    {
      title: "BUSINESS", 
      items: [
        { icon: Users, label: "Join MCN", url: "/app/youtube-mcn" },
        { icon: BarChart3, label: "Analytics", url: "/app/analytics" },
        { icon: DollarSign, label: "Royalties", url: "/app/royalties" },
        { icon: Wallet, label: "Finance & Wallet", url: "/app/finance-and-wallet" }
      ]
    },
    {
      title: "MARKETING",
      items: [
        { icon: RefreshCw, label: "Sync", url: "/app/sync" },
        { icon: ListMusic, label: "Playlist Pitching", url: "/app/playlist-pitching" },
        // { icon: Megaphone, label: "Advertisement", url: "/app/advertisement" },
        { icon: Video, label: "MV Production", url: "/app/mv-production" },
        { icon: Wrench, label: "Fan Links Builder", url: "/app/fan-link" },
        { icon: Store, label: "Merch Store", url: "/app/merch" }
      ]
    },
    {
      title: "TOOLS",
      items: [
        // { icon: Bot, label: "AI Mastering", url: "/app/ai-mastering" },
        { icon: BotMessageSquare, label: "Mahi AI", url: "/app/mahi-ai" },
        { icon: HelpCircle, label: "Help & Support", url: "/app/help" },
        { icon: FileText, label: "Legal", url: "/app/settings?tab=legal" },
        { icon: Settings, label: "Settings", url: "/app/settings" }
      ]
    }
  ];

  const location = useLocation();
  const navigate = useNavigate();
  const { clearAuth } = useAuthStore();

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (e) {
      // Still clear auth even if API fails
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      clearAuth();
      window.location.href = '/signin';
    }
  };

  return (
    <Sidebar className="border-r">
      <SidebarHeader className="p-4">
        <div className="flex items-top space-x-3">
          <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
            <Music className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-semibold leading-none">Maheshwari</h1>
            <h1 className="text-lg font-semibold">Visuals</h1>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2">
        {sidebarSections.map((section) => (
          <SidebarGroup key={section.title}>
            <SidebarGroupLabel className="text-xs font-semibold uppercase tracking-wider text-muted-foreground px-2">
              {section.title}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.url;
                  return (
                    <SidebarMenuItem key={item.label}>
                      <SidebarMenuButton 
                        asChild 
                        className={`w-full ${isActive ? "bg-muted/90" : ""}`}
                      >
                        <Link to={item.url} className="flex items-center gap-3 px-3 py-2 rounded-lg">
                          <Icon className="w-4 h-4" />
                          <span>{item.label}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      {/* Logout button pinned at the bottom */}
      <SidebarFooter className="px-2 pb-4">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-red-500 hover:bg-red-500/10 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </SidebarFooter>
    </Sidebar>
  )
}

export default AppSidebar;
