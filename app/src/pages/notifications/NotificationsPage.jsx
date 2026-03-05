import React, { useState, useEffect, useCallback } from 'react'
import { Bell, CheckCheck, Check, Loader2, RefreshCw } from 'lucide-react'
import {
  getNotifications,
  getNotificationCount,
  markNotificationRead,
  markAllNotificationsRead,
} from '@/services/api.services'

const CATEGORY_ICONS = {
  royalty_update: '💰',
  bonus_royalty_update: '🎁',
  mcn_update: '📺',
  analytics_update: '📊',
  catalog_live: '🎵',
  catalog_takedown: '🔴',
  custom: '📢',
}

const CATEGORY_LABELS = {
  royalty_update: 'Royalty Update',
  bonus_royalty_update: 'Bonus Royalty',
  mcn_update: 'MCN Update',
  analytics_update: 'Analytics',
  catalog_live: 'Catalog Live',
  catalog_takedown: 'Takedown',
  custom: 'Announcement',
}

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  if (days < 7) return `${days}d ago`
  return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([])
  const [pagination, setPagination] = useState(null)
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [unreadCount, setUnreadCount] = useState(0)
  const [markingAll, setMarkingAll] = useState(false)

  const fetchData = useCallback(async (page = 1) => {
    setLoading(true)
    try {
      const [countData, listData] = await Promise.all([
        getNotificationCount(),
        getNotifications({ page, limit: 20 }),
      ])
      setUnreadCount(countData?.data?.unreadCount ?? 0)
      setNotifications(listData?.data?.notifications ?? [])
      setPagination(listData?.data?.pagination ?? null)
    } catch {
      // ignore
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData(currentPage)
  }, [currentPage])

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

  const handleMarkAllRead = async () => {
    setMarkingAll(true)
    try {
      await markAllNotificationsRead()
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
      setUnreadCount(0)
    } catch {
      // ignore
    } finally {
      setMarkingAll(false)
    }
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Bell className="w-6 h-6 text-purple-500" />
            Notifications
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'All caught up!'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => fetchData(currentPage)}
            className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground"
            title="Refresh"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              disabled={markingAll}
              className="flex items-center gap-1.5 px-3 py-2 text-sm bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition disabled:opacity-60"
            >
              {markingAll ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <CheckCheck className="w-3.5 h-3.5" />
              )}
              Mark all read
            </button>
          )}
        </div>
      </div>

      {/* Notifications List */}
      {loading ? (
        <div className="flex justify-center py-24">
          <Loader2 className="w-6 h-6 animate-spin text-purple-500" />
        </div>
      ) : notifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
            <Bell className="w-7 h-7 text-muted-foreground" />
          </div>
          <h3 className="font-semibold text-lg mb-1">No notifications yet</h3>
          <p className="text-sm text-muted-foreground">
            You'll get notified about royalties, releases, and important updates here.
          </p>
        </div>
      ) : (
        <div className="space-y-1">
          {notifications.map((notif) => (
            <button
              key={notif.notificationId}
              onClick={() => handleMarkRead(notif)}
              className={`w-full text-left rounded-xl p-4 transition-colors border ${
                !notif.isRead
                  ? 'bg-purple-500/10 border-purple-500/20 hover:bg-purple-500/15'
                  : 'bg-background border-border hover:bg-muted/50'
              }`}
            >
              <div className="flex items-start gap-3">
                {/* Category icon circle */}
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-lg ${
                    !notif.isRead ? 'bg-purple-500/20' : 'bg-muted'
                  }`}
                >
                  {CATEGORY_ICONS[notif.category] || '🔔'}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p
                      className={`text-sm font-semibold leading-tight ${
                        notif.isRead ? 'text-muted-foreground' : 'text-foreground'
                      }`}
                    >
                      {notif.title}
                    </p>
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      {!notif.isRead && (
                        <span className="w-2 h-2 rounded-full bg-purple-500 mt-1" />
                      )}
                      {notif.isRead && (
                        <Check className="w-3.5 h-3.5 text-muted-foreground mt-0.5" />
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                    {notif.message}
                  </p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="text-[10px] bg-muted text-muted-foreground px-1.5 py-0.5 rounded-md">
                      {CATEGORY_LABELS[notif.category] || notif.category}
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      {timeAgo(notif.createdAt)}
                    </span>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
          <p className="text-xs text-muted-foreground">
            Page {pagination.currentPage} of {pagination.totalPages} ({pagination.totalItems} total)
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={pagination.currentPage === 1}
              className="px-3 py-1.5 text-xs rounded-lg disabled:opacity-40 bg-purple-600 hover:bg-purple-700 text-white transition"
            >
              ← Prev
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.min(pagination.totalPages, p + 1))}
              disabled={pagination.currentPage === pagination.totalPages}
              className="px-3 py-1.5 text-xs rounded-lg disabled:opacity-40 bg-purple-600 hover:bg-purple-700 text-white transition"
            >
              Next →
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default NotificationsPage
