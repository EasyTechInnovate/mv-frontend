import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { ArrowRight, BarChart3, Building2, DollarSign, IndianRupee, Megaphone, Music, Play, Upload, User, Video } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';
import {earningsData ,streamsData ,videoTutorials ,recentReleases ,quickActions ,performanceMetrics} from './Dashboard.config'
import React, { useEffect, useState } from 'react';
import { getUserDashboard, getYoutubeLinks, resendVerificationEmail, verifyEmail } from '@/services/api.services';
import { getUserProfile } from '@/services/auth.services';
import { Link } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { AlertCircle, CheckCircle2, Loader2, X } from 'lucide-react';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { user } = useAuthStore();
  const [dashboardData, setDashboardData] = useState(null);
  const [dashboardVideos, setDashboardVideos] = useState([]);
  const [showAllVideos, setShowAllVideos] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Email Verification States
  const [isVerifyingModalOpen, setIsVerifyingModalOpen] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isResending, setIsResending] = useState(false);
  const [isSubmittingOtp, setIsSubmittingOtp] = useState(false);
  const otpInputRefs = React.useRef([]);

  const getYouTubeVideoId = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const [res, videosRes] = await Promise.all([
          getUserDashboard(),
          getYoutubeLinks()
        ]);
        setDashboardData(res.data);
        if (videosRes?.data && Array.isArray(videosRes.data)) {
          setDashboardVideos(videosRes.data);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  const handleResendEmail = async () => {
    setIsResending(true);
    try {
      await resendVerificationEmail({ emailAddress: user?.emailAddress });
      toast.success('Verification code sent to your email!');
      setIsVerifyingModalOpen(true);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to resend verification email.');
    } finally {
      setIsResending(false);
    }
  };

  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    const otpStr = otp.join('');
    if (otpStr.length !== 6) {
      toast.error('Please enter the 6-digit code');
      return;
    }

    setIsSubmittingOtp(true);
    try {
      await verifyEmail({ emailAddress: user?.emailAddress, code: otpStr });
      toast.success('Email verified successfully!');
      setIsVerifyingModalOpen(false);
      
      // Refresh user profile to update verified status
      const profileRes = await getUserProfile();
      if (profileRes?.data?.user) {
        useAuthStore.getState().setUser(profileRes.data.user);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Verification failed. Please check the code.');
    } finally {
      setIsSubmittingOtp(false);
    }
  };

  if (loading || !dashboardData) {
    return <div className="flex h-screen items-center justify-center">Loading Dashboard...</div>;
  }

  const {
    totalReleases = 0,
    totalStreams = 0,
    wallet = { totalEarnings: 0 },
    charts = { monthlyEarnings: [], monthlyStreams: [] },
    recentReleases = { basic: [], advanced: [] }
  } = dashboardData;

  const mergedRecentReleases = [...recentReleases.basic, ...recentReleases.advanced]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  return (
    <div className=''>
      <main className="p-2 md:p-2 space-y-8">
        {user?.userType === 'aggregator' && (user?.aggregatorBanner?.heading || user?.aggregatorBanner?.description) && (
          <div className="bg-gradient-to-r from-purple-900 to-purple-600 rounded-xl p-6 shadow-lg text-white mb-6 border border-purple-400/30 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Megaphone size={120} />
            </div>
            <div className="relative z-10">
              {user.aggregatorBanner.heading && (
                <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
                  <Megaphone className="w-6 h-6" />
                  {user.aggregatorBanner.heading}
                </h2>
              )}
              {user.aggregatorBanner.description && (
                <p className="text-purple-100 text-lg max-w-3xl">
                  {user.aggregatorBanner.description}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Artist Account Banner */}
        {user?.userType === 'artist' && (
          <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-violet-700 rounded-2xl p-8 shadow-xl text-white mb-8 border border-white/10 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
              <Music size={160} />
            </div>
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
            
            <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
              <Avatar className="w-24 h-24 border-4 border-white/20 shadow-2xl">
                <AvatarImage src={user?.profile?.photo || user?.profileImage} alt={user?.firstName} />
                <AvatarFallback className="bg-white/20 text-white text-3xl backdrop-blur-md">
                  <User size={40} />
                </AvatarFallback>
              </Avatar>
              
              <div className="text-center md:text-left space-y-2">
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                  <Badge className="bg-white/20 hover:bg-white/30 text-white border-none backdrop-blur-md px-3 py-1 text-xs uppercase tracking-wider font-bold">
                    Artist Account
                  </Badge>
                  {/* <span className="text-indigo-200 text-sm font-medium">Verified Creator</span> */}
                </div>
                <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
                  Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-indigo-200">{user?.artistData?.artistName || user?.firstName || 'Artist'}!</span>
                </h2>
                <p className="text-indigo-100/80 text-lg max-w-2xl font-medium">
                  Your stage is set. Manage your releases, track your growth, and connect with your fans all in one place.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Label Account Banner */}
        {user?.userType === 'label' && (
          <div className="bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-950 rounded-2xl p-8 shadow-xl text-white mb-8 border border-blue-500/20 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
              <Building2 size={160} />
            </div>
            <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl"></div>
            
            <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
              <Avatar className="w-24 h-24 border-4 border-blue-400/20 shadow-2xl">
                <AvatarImage src={user?.profile?.photo || user?.profileImage} alt={user?.firstName} />
                <AvatarFallback className="bg-blue-900/40 text-white text-3xl backdrop-blur-md border border-white/10">
                  <Building2 size={40} />
                </AvatarFallback>
              </Avatar>
              
              <div className="text-center md:text-left space-y-2">
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                  <Badge className="bg-blue-500/20 hover:bg-blue-500/30 text-white border border-blue-400/30 backdrop-blur-md px-4 py-1 text-xs uppercase tracking-wider font-bold">
                    Label Account
                  </Badge>
                  {/* <span className="text-blue-300 text-sm font-medium flex items-center gap-1">
                    Professional Suite
                  </span> */}
                </div>
                <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
                  Good day, <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-200">{user?.firstName || 'Label Owner'}!</span>
                </h2>
                <p className="text-blue-100/80 text-lg max-w-2xl font-medium">
                  Oversee your entire catalog, monitor performance across all artists, and drive your label's success.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Email Verification Alert */}
        {!user?.isEmailVerified && (
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 backdrop-blur-sm shadow-sm">
            <div className="flex items-center gap-3 text-left">
              <div className="bg-amber-500/20 p-2 rounded-full flex-shrink-0">
                <AlertCircle className="w-5 h-5 text-amber-500" />
              </div>
              <div>
                <h3 className="font-semibold text-amber-500">Email Not Verified</h3>
                <p className="text-sm text-amber-600/90 font-medium">Please verify your email address to ensure your account security and unlock all features.</p>
              </div>
            </div>
            <Button 
              onClick={handleResendEmail} 
              disabled={isResending}
              className="bg-amber-500 hover:bg-amber-600 text-white border-none min-w-[140px] shadow-sm font-semibold"
            >
              {isResending ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Sending...</>
              ) : (
                'Verify Now'
              )}
            </Button>
          </div>
        )}

        <div className='flex flex-wrap space-y-6 justify-between items-center'>

        <div>
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's what's happening with your music.
          </p>
        </div>

        {/* Upload Release Button */}
        <a href="/app/upload-release">
        <Button className="bg-purple-600 hover:bg-purple-700 text-white" >
          <Upload className="w-4 h-4 mr-2" />
          Upload Release
        </Button>
        </a>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { label: "Total Releases", value: totalReleases.toLocaleString('en-IN'), icon: Music, color:'text-blue-500'},
            { label: "Total Streams", value: totalStreams.toLocaleString('en-IN'), icon: Play, color:'text-green-500'},
            { label: "Total Earnings", value: `₹${(wallet?.totalEarnings || 0).toLocaleString('en-IN')}`, icon: IndianRupee, color:'text-purple-500'}
          ].map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="rounded-lg border bg-card p-6 shadow-sm">
                <div className="flex items-center justify-between space-y-0 pb-2">
                  <h3 className="text-sm font-medium text-muted-foreground">
                    {stat.label}
                  </h3>
                  <Icon className={`h-4 w-4 ${stat.color} `} />
                </div>
                <div className="space-y-1">
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Monthly Earnings Chart */}
          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <div className="mb-4">
              <h3 className="text-lg font-semibold  flex flex-nowrap items-center gap-1"><span>{<IndianRupee className='text-purple-400' size='20'/>}</span> Monthly Earnings</h3>
              <p className="text-sm text-muted-foreground">Your earnings over the last 5 months</p>
            </div>
            <div className="h-64 ">
              <ResponsiveContainer width="100%" height="100%" >
                <LineChart data={charts.monthlyEarnings?.slice(-5)}>
                  <XAxis 
                    dataKey="month" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#9CA3AF', fontSize: 12 }}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#9CA3AF', fontSize: 12 }}
                    tickFormatter={(value) => `${value/1000}k`}
                  />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    formatter={(value) => [`₹${(value || 0).toLocaleString('en-IN')}`, 'Earnings']}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="earnings" 
                    stroke="#8B5CF6" 
                    strokeWidth={3}
                    dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, fill: '#8B5CF6' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Monthly Streams Chart */}
          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <div className="mb-4">
              <h3 className="text-lg font-semibold  flex flex-nowrap items-center gap-1"><span><Play className='text-green-500' size='20'/></span> Monthly Streams</h3>
              <p className="text-sm text-muted-foreground">Your streaming performance over the last 5 months</p>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={charts.monthlyStreams?.slice(-5)}>
                  <XAxis 
                    dataKey="month" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#9CA3AF', fontSize: 12 }}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#9CA3AF', fontSize: 12 }}
                    tickFormatter={(value) => `${value/1000}k`}
                  />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    cursor={{fill: 'transparent'}}
                    formatter={(value) => [(value || 0).toLocaleString('en-IN'), 'Streams']}
                  />
                  <Bar 
                    dataKey="streams" 
                    fill="#8B5CF6" 
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        

        {/* Bottom Section with Recent Releases, Quick Actions, and Performance */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Releases */}
          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <div className="mb-4">
              <h3 className="text-lg font-semibold ">Recent Releases</h3>
              <p className="text-sm text-muted-foreground">Your latest releases and their performance</p>
            </div>
            <div className="space-y-4">
              {mergedRecentReleases.length === 0 ? (
                <p className="text-sm text-muted-foreground">No recent releases found.</p>
              ) : (
                mergedRecentReleases.map((release, index) => (
                  <div key={index} className="flex items-center space-x-3 bg-muted/50 rounded-lg p-4">
                    <div className="w-12 h-12 rounded-lg bg-[#2A2051] flex items-center justify-center">
                      <Music className="w-6 h-6 text-[#711CE9] " />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium  truncate">{release.releaseName}</h4>
                        <p className="text-sm text-muted-foreground ">{release.streamsCount?.toLocaleString('en-IN')} streams</p>
                      </div>
                      <div className='flex items-center justify-between'>
                        <p className="text-sm text-muted-foreground">{release.artistName || 'Unknown Artist'}</p>
                        <span className={`px-3 py-1 font-semibold rounded-full text-xs text-white ${release.releaseStatus === 'Live' ? 'bg-[#711CE9] ' : 'bg-gray-700 '}`}>
                          {release.releaseStatus} ({release.releaseType})
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <div className="mb-4">
              <h3 className="text-lg font-semibold ">Quick Actions</h3>
              <p className="text-sm text-muted-foreground">Common tasks and shortcuts</p>
            </div>
            <div className="space-y-3">
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <Link key={index} to={action.path} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
                    <div className="flex items-center space-x-3 gap-2">
                      <Icon className={`w-5 h-5 text-[#711CE9]`} />
                      <div>
                        <h4 className="font-medium ">{action.title}</h4>
                        <p className="text-sm text-muted-foreground">{action.subtitle}</p>
                      </div>
                    </div>
                    <ArrowRight size='20' className="text-muted-foreground"></ArrowRight>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* This Month's Performance */}
        </div>
          {/* <div className="rounded-lg border bg-card p-6 shadow-sm">
            <div className="mb-4">
              <h3 className="text-lg font-semibold ">This Month's Performance</h3>
              <p className="text-sm text-muted-foreground">Track your growth and engagement metrics</p>
            </div>
            <div className="space-y-6 grid grid-cols-1 lg:grid-cols-3 space-x-4">
              {performanceMetrics.map((metric, index) => (
                <div key={index} className="space-y-2 ">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium ">{metric.title}</h4>
                    <span className="text-sm font-semibold ">{metric.percentage}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className={`bg-[#711CE9] h-2 rounded-full transition-all duration-300`}
                      style={{ width: `${metric.percentage}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between items-center text-sm text-muted-foreground">
                    <span>{metric.current}{metric.target && ` / ${metric.target}`}</span>
                  </div>
                </div>
              ))}
            </div>
          </div> */}

          {/* Video Tutorials Section */}
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Video Tutorials</h3>
            {dashboardVideos.length > 4 && (
              <Button variant="ghost" size="sm" onClick={() => setShowAllVideos(!showAllVideos)}>
                {showAllVideos ? 'Show Less' : 'View More'}
              </Button>
            )}
          </div>
          {dashboardVideos.length === 0 ? (
            <p className="text-sm text-muted-foreground">No video tutorials available yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {(showAllVideos ? dashboardVideos : dashboardVideos.slice(0, 4)).map((video, index) => {
                const videoId = getYouTubeVideoId(video.url);
                return (
                  <div key={index} className="space-y-3 border rounded-lg p-4 flex flex-col cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => setSelectedVideo(video)}>
                    <div className="aspect-video w-full rounded-lg bg-muted flex items-center justify-center relative overflow-hidden group">
                      {videoId ? (
                        <img 
                          src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`} 
                          alt={video.title || 'Video thumbnail'} 
                          className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" 
                        />
                      ) : (
                        <Video className="h-12 w-12 text-muted-foreground opacity-50" />
                      )}
                      <div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                        <div className="w-12 h-12 rounded-full bg-white/30 backdrop-blur-md flex items-center justify-center group-hover:scale-110 transition-transform">
                           <Play className="h-5 w-5 text-white ml-1" />
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium line-clamp-2" title={video.title}>{video.title || 'Untitled Video'}</h4>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <Dialog open={!!selectedVideo} onOpenChange={(open) => !open && setSelectedVideo(null)}>
            <DialogContent className="sm:max-w-4xl p-0 overflow-hidden bg-black border-none" showCloseButton={true}>
              {/* Added accessible hidden title to fix Dialog missing Title warnings */}
              <DialogTitle className="sr-only">{selectedVideo?.title || "Video Player"}</DialogTitle>
              <DialogDescription className="sr-only">Video player displaying selected tutorial content</DialogDescription>
              <div className="aspect-video w-full flex items-center justify-center relative">
                {selectedVideo && getYouTubeVideoId(selectedVideo.url) ? (
                  <iframe
                    width="100%"
                    height="100%"
                    src={`https://www.youtube.com/embed/${getYouTubeVideoId(selectedVideo.url)}?autoplay=1`}
                    title={selectedVideo.title || "Video Tutorial"}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                ) : selectedVideo ? (
                  <video 
                    controls 
                    autoPlay 
                    src={selectedVideo.url} 
                    className="w-full h-full object-contain"
                  />
                ) : null}
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* OTP Verification Modal */}
        <Dialog open={isVerifyingModalOpen} onOpenChange={setIsVerifyingModalOpen}>
          <DialogContent className="sm:max-w-md bg-[#0f1117] border-slate-800 p-8">
            <DialogTitle className="text-2xl font-bold text-center text-white mb-2">
              Verify Your Email
            </DialogTitle>
            <DialogDescription className="text-center text-slate-400 mb-6">
              We've sent a 6-digit code to <span className="text-purple-400 font-medium">{user?.emailAddress}</span>. Enter it below to verify your account.
            </DialogDescription>

            <form onSubmit={handleVerifyOtp} className="space-y-8">
              <div className="flex justify-center gap-2">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (otpInputRefs.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-12 h-14 text-center text-xl font-bold bg-slate-900 border border-slate-700 text-white rounded-lg focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all font-mono"
                  />
                ))}
              </div>

              <div className="flex flex-col gap-3">
                <Button 
                  type="submit" 
                  disabled={isSubmittingOtp || otp.join('').length !== 6}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white h-12 text-lg font-semibold"
                >
                  {isSubmittingOtp ? (
                    <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Verifying...</>
                  ) : (
                    'Verify Email'
                  )}
                </Button>
                <Button 
                  variant="ghost" 
                  type="button"
                  onClick={() => setIsVerifyingModalOpen(false)}
                  className="w-full text-slate-400 hover:text-white"
                >
                  Cancel
                </Button>
              </div>

              <div className="text-center">
                <p className="text-sm text-slate-500">
                  Didn't receive the code?{' '}
                  <button 
                    type="button"
                    onClick={handleResendEmail}
                    disabled={isResending}
                    className="text-purple-400 hover:text-purple-300 font-medium disabled:opacity-50"
                  >
                    Resend Code
                  </button>
                </p>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default Dashboard;