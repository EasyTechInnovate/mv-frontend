import React, { useEffect } from 'react'
import { Route, Routes, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useQuery } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'

import { queryClient } from './lib/queryClient'
import { useAuthStore } from './store/authStore'
import { getUserProfile } from './services/auth.services'

import Index from './pages/Index'
import Dashboard from './pages/dashboard/Dashboard'
import UploadRelease from './pages/uploadRelease/UploadRelease'
import CatalogPage from './pages/catalog/Catalog'
import Analytics from './pages/analytics/Analytics'
import FinanceWallet from './pages/financeAndWallet/FinanceWallet'
import WithdrawFund from './pages/financeAndWallet/WithdrawFund'
import YouTubeMCN from './pages/youtubeMCN/YoutubeMCN'
import YouTubeMCNRequest from './pages/youtubeMCN/YoutubeMCNRequest'
import MVProduction from './pages/mvProduction/MVProduction'
import MVMarketing from './pages/mvMarketing/MVMarketing'
import Advertisement from './pages/advertisement/Advertisement'
import MerchStore from './pages/merchStore/MerchStore'
import HelpSupport from './pages/helpSupport/HelpSupport'
import SettingsPage from './pages/setting/Setting'
import BasicReleaseBuilder from './pages/uploadRelease/Basic'
import AdvancedReleaseBuilder from './pages/uploadRelease/Advance'
import EditBasicReleaseBuilder from './pages/uploadRelease/EditBasicRelease'
import EditAdvancedReleaseBuilder from './pages/uploadRelease/EditAdvancedRelease'
import Profile from './pages/profile/Profile'
import Plan from './pages/plan/Plan'
import MahiAI from './pages/mahiAI/MahiAI'
import FanLinksBuilder from './pages/fanLink/FanLink'
import Royalties from './pages/royalties/Royalties'

const AuthProvider = ({ children }) => {
  const { setUser, setAuthenticated, setLoading, clearAuth } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const { isLoading, data, isError } = useQuery({
    queryKey: ['userProfile'],
    queryFn: getUserProfile,
    enabled: !!localStorage.getItem('accessToken'), 
    retry: 1,
  });

  // Handle success
  useEffect(() => {
    if (data?.data?.user) {
      setUser(data.data.user);
      setAuthenticated(true);
    }
  }, [data, setUser, setAuthenticated]);

  // Handle error
  useEffect(() => {
    if (isError) {
      clearAuth();
    }
  }, [isError, clearAuth]);

  useEffect(() => {
    const publicPaths = ['/signin', '/signup']; // Add any other public paths
    if (!localStorage.getItem('accessToken') && !publicPaths.includes(location.pathname)) {
      setLoading(false);
      setAuthenticated(false);
      navigate('/signin');
    }
  }, [setLoading, setAuthenticated, navigate, location.pathname]);

  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '18px',
        color: '#666'
      }}>
        Loading...
      </div>
    );
  }

  return children;
};

// Protected routes wrapper
const ProtectedRoutes = () => {
  const { isAuthenticated, isLoading , user } = useAuthStore();
  if (!isAuthenticated && !isLoading && user.role !== 'user' ) {
    // Redirect to login if not authenticated
    return <Navigate to="/signin" replace />;
  }

  return (
    <Routes>
      <Route path='/app' element={<Index />}>
          <Route index element={<Dashboard />} />
          <Route path='profile' element={<Profile />} />
          <Route path='plan' element={<Plan />} />
          <Route path='upload-release' element={<UploadRelease />} />
          <Route path='upload-release/basic-release-builder' element={<BasicReleaseBuilder />} />
          <Route path='upload-release/advanced-release-builder' element={<AdvancedReleaseBuilder />} />
          <Route path='edit-release/basic/:id' element={<EditBasicReleaseBuilder />} />
          <Route path='edit-release/advanced/:id' element={<EditAdvancedReleaseBuilder />} />
          <Route path='catalog' element={<CatalogPage />} />
          <Route path='analytics' element={<Analytics />} />
          <Route path='royalties' element={<Royalties />} />
          <Route path='finance-and-wallet' element={<FinanceWallet />} />
          <Route path='finance-and-wallet/withdraw-fund' element={<WithdrawFund />} />
          <Route path='youtube-mcn' element={<YouTubeMCN />} />
          <Route path='youtube-mcn/new-request' element={<YouTubeMCNRequest />} />
          <Route path='mv-production' element={<MVProduction />} />
          <Route path='mv-marketing' element={<MVMarketing />} />
          <Route path='advertisement' element={<Advertisement />} />
          <Route path='merch' element={<MerchStore />} />
          <Route path='mahi-ai' element={<MahiAI />} />
          <Route path='help' element={<HelpSupport />} />
          <Route path='fan-link' element={<FanLinksBuilder />} />
          <Route path='settings' element={<SettingsPage />} />
        </Route>
    </Routes>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ProtectedRoutes />
      </AuthProvider>
      <Toaster
        position="top-center"
        reverseOrder={false}
        gutter={8}
        // toastOptions={{
        //   // Default options
        //   duration: 3000,
        //   style: {
        //     background: '#333',
        //     color: '#fff',
        //     fontSize: '14px',
        //     padding: '8px 16px',
        //     borderRadius: '8px',
        //     maxWidth: '400px',
        //   },
        //   // Success
        //   success: {
        //     duration: 3000,
        //     iconTheme: {
        //       primary: '#10b981',
        //       secondary: '#fff',
        //     },
        //   },
        //   // Error
        //   error: {
        //     duration: 4000,
        //     iconTheme: {
        //       primary: '#ef4444',
        //       secondary: '#fff',
        //     },
        //   },
        //   // Loading
        //   loading: {
        //     iconTheme: {
        //       primary: '#3b82f6',
        //       secondary: '#fff',
        //     },
        //   },
        // }}
      />
      {/* <ReactQueryDevtools initialIsOpen={false} />   */}
    </QueryClientProvider>
  )
}

export default App