import React, { useState, useRef, useEffect } from 'react'
import { SidebarTrigger } from './ui/sidebar'
import { Bell, Moon, Music, Sun, LogOut, Settings, User } from 'lucide-react'
import { Button } from './ui/button'
import { useTheme } from '@/contextapi/TheamContext'
import { useAuthStore } from '@/store/authStore'
import { Link, useNavigate } from 'react-router-dom'
import { logoutUser } from '@/services/auth.services'

const AppHeader = () => {
  const { theme, toggleTheme } = useTheme()
  const { user, clearAuth } = useAuthStore()
  const navigate = useNavigate()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false)
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
      navigate('/signin')
    }
  }

  // profile photo is stored at user.profile.photo
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
          <Button variant="ghost" size="sm" onClick={toggleTheme}>
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            <span className="ml-2 hidden sm:inline">{theme === 'dark' ? 'Light' : 'Dark'}</span>
          </Button>

          <Button variant="ghost" size="sm">
            <Bell className="w-4 h-4" />
          </Button>

          {/* Profile Avatar with Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(prev => !prev)}
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
                  <p className="text-sm font-medium truncate">{user?.firstName} {user?.lastName}</p>
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
