import React, { useState, useRef, useEffect, useCallback } from 'react'
import { SidebarTrigger } from './ui/sidebar'
import { Bell, Moon, Music, Sun, LogOut, Settings, User, CheckCheck, Check } from 'lucide-react'
import { Button } from './ui/button'
import { useTheme } from '@/contextapi/TheamContext'
import { useAuthStore } from '@/store/authStore'
import { Link, useNavigate } from 'react-router-dom'
import { logoutUser } from '@/services/auth.services'
import {
  getNotifications,
  getNotificationCount,
  markNotificationRead,
  markAllNotificationsRead,
} from '@/services/api.services'

const POLL_INTERVAL_MS = 60 * 60 * 1000 // 1 hour

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  return `${days}d ago`
}

const AppHeader = () => {
  const { theme, toggleTheme } = useTheme()
  const { user, clearAuth } = useAuthStore()
  const navigate = useNavigate()

  // Profile dropdown
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)

  // Notification states
  const [unreadCount, setUnreadCount] = useState(0)
  const [notifOpen, setNotifOpen] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [notifLoading, setNotifLoading] = useState(false)
  const notifRef = useRef(null)

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false)
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = async () => {
    try {
      await logoutUser()
    } catch (e) {
      // Even if API fails, clear local auth
    } finally {
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      clearAuth()
      window.location.href = '/signin'
    }
  }

  // Fetch unread count only (used for polling)
  const fetchUnreadCount = useCallback(async () => {
    try {
      const data = await getNotificationCount()
      setUnreadCount(data?.data?.unreadCount ?? 0)
    } catch {
      // silently fail
    }
  }, [])

  // Fetch full list + count (used on bell click)
  const fetchNotifications = useCallback(async () => {
    setNotifLoading(true)
    try {
      const [countData, listData] = await Promise.all([
        getNotificationCount(),
        getNotifications({ page: 1, limit: 10 }),
      ])
      setUnreadCount(countData?.data?.unreadCount ?? 0)
      setNotifications(listData?.data?.notifications ?? [])
    } catch {
      // silently fail
    } finally {
      setNotifLoading(false)
    }
  }, [])

  // On mount: fetch count once + set 1-hour polling
  useEffect(() => {
    fetchUnreadCount()
    const intervalId = setInterval(fetchUnreadCount, POLL_INTERVAL_MS)
    return () => clearInterval(intervalId)
  }, [fetchUnreadCount])

  // Bell click: toggle dropdown + fetch instantly when opening
  const handleBellClick = () => {
    const opening = !notifOpen
    setNotifOpen(opening)
    if (opening) {
      fetchNotifications()
    }
  }

  // Mark single notification as read
  const handleMarkRead = async (notif) => {
    if (notif.isRead) return
    try {
      await markNotificationRead(notif.notificationId)
      setNotifications((prev) =>
        prev.map((n) =>
          n.notificationId === notif.notificationId ? { ...n, isRead: true } : n
        )
      )
      setUnreadCount((prev) => Math.max(0, prev - 1))
    } catch {
      // ignore
    }
  }

  // Mark all as read
  const handleMarkAllRead = async () => {
    try {
      await markAllNotificationsRead()
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
      setUnreadCount(0)
    } catch {
      // ignore
    }
  }

  // Badge label
  const badgeLabel = unreadCount > 9 ? '9+' : unreadCount > 0 ? String(unreadCount) : null

  const profilePhoto = user?.profile?.photo

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40">
      <div className="flex h-16 items-center justify-between px-6">
        <div className="flex items-center space-x-4">
          <SidebarTrigger />
          <div className="hidden md:flex items-center space-x-4">
            <div className="h-6 w-px bg-border" />
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-purple-600 rounded-md flex items-center justify-center">
                <Music className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-bold">Maheshwari Visuals</span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {/* Theme toggle */}
          <Button variant="ghost" size="sm" onClick={toggleTheme}>
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            <span className="ml-2 hidden sm:inline">{theme === 'dark' ? 'Light' : 'Dark'}</span>
          </Button>

          {/* Bell Icon + Notification Dropdown */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={handleBellClick}
              className={`relative p-2 rounded-lg transition-colors ${
                notifOpen
                  ? 'bg-muted text-foreground'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              <Bell className="w-4 h-4" />
              {/* Badge */}
              {badgeLabel && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center rounded-full text-[10px] font-bold text-white bg-red-500 px-1 leading-none">
                  {badgeLabel}
                </span>
              )}
            </button>

            {/* Notification Dropdown */}
            {notifOpen && (
              <div className="absolute right-0 top-full mt-2 w-80 rounded-xl shadow-2xl border border-border bg-background z-[200] overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                  <span className="font-semibold text-sm">Notifications</span>
                  {unreadCount > 0 && (
                    <button
                      onClick={handleMarkAllRead}
                      className="flex items-center gap-1 text-xs text-purple-500 hover:text-purple-400 transition-colors"
                    >
                      <CheckCheck className="w-3.5 h-3.5" />
                      Mark all read
                    </button>
                  )}
                </div>

                {/* List */}
                <div className="max-h-80 overflow-y-auto">
                  {notifLoading ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="w-5 h-5 rounded-full border-2 border-purple-500 border-t-transparent animate-spin" />
                    </div>
                  ) : notifications.length === 0 ? (
                    <div className="text-center py-12 text-sm text-muted-foreground">
                      🔔 No notifications yet
                    </div>
                  ) : (
                    notifications.map((notif) => (
                      <button
                        key={notif.notificationId}
                        onClick={() => handleMarkRead(notif)}
                        className={`w-full text-left px-4 py-3 border-b border-border/50 transition-colors last:border-0 ${
                          !notif.isRead
                            ? 'bg-purple-500/10 hover:bg-purple-500/20'
                            : 'hover:bg-muted/50'
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          {/* Unread dot */}
                          <span
                            className={`mt-1.5 w-2 h-2 rounded-full flex-shrink-0 ${
                              !notif.isRead ? 'bg-purple-500' : 'bg-transparent'
                            }`}
                          />
                          <div className="flex-1 min-w-0">
                            <p
                              className={`text-sm font-medium truncate ${
                                notif.isRead ? 'text-muted-foreground' : 'text-foreground'
                              }`}
                            >
                              {notif.title}
                            </p>
                            <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                              {notif.message}
                            </p>
                            <p className="text-[10px] text-muted-foreground/60 mt-1">
                              {timeAgo(notif.createdAt)}
                            </p>
                          </div>
                          {notif.isRead && (
                            <Check className="w-3 h-3 text-muted-foreground flex-shrink-0 mt-1" />
                          )}
                        </div>
                      </button>
                    ))
                  )}
                </div>

                {/* Footer */}
                <div className="border-t border-border">
                  <Link
                    to="/app/notifications"
                    onClick={() => setNotifOpen(false)}
                    className="block w-full py-2.5 text-xs font-medium text-center text-purple-500 hover:text-purple-400 hover:bg-muted/50 transition-colors"
                  >
                    View all notifications →
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Profile Avatar with Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen((prev) => !prev)}
              className="w-9 h-9 bg-purple-600 rounded-full flex items-center justify-center overflow-hidden cursor-pointer ring-2 ring-transparent hover:ring-purple-400 transition-all"
            >
              {profilePhoto ? (
                <img
                  src={profilePhoto}
                  alt={user?.firstName || 'User'}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-white text-sm font-medium">
                  {`${user?.firstName?.[0] || ''}${user?.lastName?.[0] || ''}`.toUpperCase()}
                </span>
              )}
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-52 rounded-xl border border-border bg-background shadow-lg z-50 overflow-hidden">
                {/* User Info */}
                <div className="px-4 py-3 border-b border-border">
                  <p className="text-sm font-medium truncate">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">{user?.emailAddress}</p>
                </div>
                {/* Menu Items */}
                <div className="py-1">
                  <Link
                    to="/app/settings"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-muted/50 transition-colors"
                  >
                    <Settings className="w-4 h-4" />
                    Settings
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-500 hover:bg-red-500/10 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default AppHeader
