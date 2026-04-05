import React, { useState, useMemo, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { Download, DollarSign, TrendingUp, BarChart3, Calendar, Music, FileDown, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { showToast } from '@/utils/toast';
import { getRoyaltyDashboard, getActiveMonthsByType, exportUserRoyaltyData, getMCNDashboard } from '@/services/api.services';

// Platform Colors Mapping - YouTube: Red, Spotify: Green, Meta: Blue, Others: Random
const PLATFORM_COLORS = {
  'YouTube': '#FF0000',
  'YouTube Music': '#FF0000',
  'Spotify': '#1DB954',
  'Meta': '#0668E1',
  'Facebook': '#0668E1',
  'Instagram': '#0668E1',
  'Apple Music / iTunes': '#FA2D48',
  'Apple Music': '#FA2D48',
  'JioSaavn': '#02AAB0',
  'Amazon': '#FF9900',
  'Amazon Music': '#FF9900',
  'Wynk': '#00D9FF',
  'Gaana': '#E72C30',
  'Others': '#8B5CF6'
};

// Random colors for platforms not in the list
const RANDOM_COLORS = ['#8B5CF6', '#FF6B35', '#F7DC6F', '#BB8FCE', '#58D68D', '#5DADE2', '#F1948A'];

// Get platform color - returns specific color for known platforms, random for others
const getPlatformColor = (platformName, index = 0) => {
  if (!platformName) return RANDOM_COLORS[index % RANDOM_COLORS.length];
  
  const name = platformName.toLowerCase();
  
  // YouTube - Red
  if (name.includes('youtube')) return '#FF0000';
  // Spotify - Green
  if (name.includes('spotify')) return '#1DB954';
  // Meta/Facebook/Instagram - Blue
  if (name.includes('meta') || name.includes('facebook') || name.includes('instagram')) return '#0668E1';
  
  // Check exact match in PLATFORM_COLORS
  if (PLATFORM_COLORS[platformName]) return PLATFORM_COLORS[platformName];
  
  // Random color for unknown platforms
  return RANDOM_COLORS[index % RANDOM_COLORS.length];
};

const quickDownloads = [
  'Last Month Statement',
  'Q1 2024 Report',
  'Tax Document (2023)',
  'Platform Performance'
];

// --- MOCK DATA FOR PAYMENTS (Since API does not provide this yet) ---
const MOCK_PAYMENT_HISTORY = [
  { date: '1/15/2024', period: 'December 2023', regular: 4200, bonus: 800, total: 5000 },
  { date: '2/15/2024', period: 'January 2024', regular: 4600, bonus: 1200, total: 5800 },
  { date: '3/15/2024', period: 'February 2024', regular: 5200, bonus: 1400, total: 6600 },
  { date: '4/15/2024', period: 'March 2024', regular: 5800, bonus: 1600, total: 7400 },
  { date: '5/15/2024', period: 'April 2024', regular: 6100, bonus: 1800, total: 7900 },
];

export default function Royalties() {
  const [timeframe, setTimeframe] = useState('last_year');
  const [paymentFilter, setPaymentFilter] = useState('all');

  // Export Modal State
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [exportMonth, setExportMonth] = useState('');
  const [exportType, setExportType] = useState('');
  const [exporting, setExporting] = useState(false);
  const [availableMonths, setAvailableMonths] = useState([]);
  const [isFetchingMonths, setIsFetchingMonths] = useState(false);

  // Fetch available months when exportType changes
  useEffect(() => {
    if (isExportModalOpen && exportType) {
      const fetchMonths = async () => {
        setIsFetchingMonths(true);
        try {
          // Map the UI export type to the backend month type
          let monthType = 'royalty'; 
          if (exportType === 'bonus') monthType = 'bonus';
          if (exportType === 'mcn') monthType = 'mcn';
          
          const res = await getActiveMonthsByType(monthType);
          if (res?.data) {
            setAvailableMonths(res.data);
          }
        } catch (error) {
          console.error("Failed to fetch months:", error);
          showToast.error("Failed to load available months");
        } finally {
          setIsFetchingMonths(false);
        }
      };
      
      fetchMonths();
    } else {
        setAvailableMonths([]);
        setExportMonth('');
    }
  }, [isExportModalOpen, exportType]);

  const handleExport = async () => {
    if (!exportMonth || !exportType) {
      showToast.error('Please select both a month and an export type.');
      return;
    }
    
    try {
      setExporting(true);
      showToast.info('Preparing export...');
      const blob = await exportUserRoyaltyData(exportMonth, exportType);
      
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      // Fetch the display name to use in filename if possible
      const selectedMonthObj = availableMonths.find(m => m._id === exportMonth);
      const monthName = selectedMonthObj ? selectedMonthObj.displayName.replace(/\s+/g, '_') : exportMonth;
      link.setAttribute('download', `${exportType}_royalty_${monthName}.csv`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      
      showToast.success('Export downloaded successfully!');
      setIsExportModalOpen(false);
    } catch (error) {
      console.error('Export failed:', error);
      showToast.error('Failed to export royalty data. Current selected data might be empty.');
    } finally {
      setExporting(false);
    }
  };

  // Fetch royalty data
  const { data: royaltyData, isLoading, error } = useQuery({
    queryKey: ['royalty', timeframe],
    queryFn: () => getRoyaltyDashboard({ timeframe }),
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
  });

  // Fetch MCN data
  const { data: mcnData, isLoading: mcnLoading } = useQuery({
    queryKey: ['mcn-dashboard', timeframe],
    queryFn: () => getMCNDashboard({ timeframe }),
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
  });

  // Timeframe Mapping
  const timeframeMap = {
    'last_7_days': '7days',
    'last_30_days': '30days',
    'last_90_days': '90days',
    'last_6_months': '6months',
    'last_year': '1year'
  };

  const reverseTimeframeMap = {
    '7days': 'last_7_days',
    '30days': 'last_30_days',
    '90days': 'last_90_days',
    '6months': 'last_6_months',
    '1year': 'last_year'
  };

  // Formatters
  const formatCurrency = (num) => {
    return '₹' + (num || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const formatNumber = (num) => {
    if (!num) return '0';
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  // --- Data Processing Logic ---
  const processedData = useMemo(() => {
    if (!royaltyData?.data) return null;
    const { data } = royaltyData;
    console.log("ROYALTY DATA TRENDS:", data.trends);

    // Helper: Process Platforms
    const processPlatformData = (platformArray) => {
      if (!platformArray || platformArray.length === 0) return { list: [], chart: [] };
      
      const totalRevenue = platformArray.reduce((sum, p) => sum + (p.totalRevenue || 0), 0) || 1;
      
      // 1. Create Full List (Sorted)
      const sortedList = platformArray.map((platform, index) => ({
        name: platform.platform || platform._id,
        value: (platform.totalRevenue / totalRevenue) * 100,
        color: getPlatformColor(platform.platform || platform._id, index),
        amount: formatCurrency(platform.totalRevenue),
        share: `${((platform.totalRevenue / totalRevenue) * 100).toFixed(1)}% share`,
        rawRevenue: platform.totalRevenue,
        units: platform.totalUnits
      })).sort((a, b) => b.rawRevenue - a.rawRevenue);

      // 2. Create Chart Data (Top 5 + Others)
      let chartData = [];
      if (sortedList.length <= 5) {
        chartData = sortedList;
      } else {
        const top5 = sortedList.slice(0, 5);
        const others = sortedList.slice(5);
        const othersRevenue = others.reduce((sum, item) => sum + item.rawRevenue, 0);
        const othersShare = ((othersRevenue / totalRevenue) * 100).toFixed(1);

        chartData = [
          ...top5,
          {
            name: 'Others',
            value: (othersRevenue / totalRevenue) * 100,
            color: PLATFORM_COLORS['Others'],
            amount: formatCurrency(othersRevenue),
            share: `${othersShare}% share`,
            rawRevenue: othersRevenue,
            units: 0 
          }
        ];
      }
      return { list: sortedList, chart: chartData };
    };

    // Helper: Format Chart Period
    const formatPeriod = (period, fallbackIndex) => {
      if (!period) return `Month ${fallbackIndex + 1}`;
      if (period.month) {
        let m = String(period.month);
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const mNum = parseInt(m, 10);
        if (!isNaN(mNum) && mNum >= 1 && mNum <= 12) {
            m = monthNames[mNum - 1];
        } else {
            m = m.substring(0, 3);
        }
        return period.year ? `${m} ${period.year}` : m;
      }
      return `Month ${fallbackIndex + 1}`;
    };

    // Helper: Get month number from name
    const getMonthNumber = (monthStr) => {
      const monthMap = { 'Jan': 1, 'Feb': 2, 'Mar': 3, 'Apr': 4, 'May': 5, 'Jun': 6, 'Jul': 7, 'Aug': 8, 'Sep': 9, 'Oct': 10, 'Nov': 11, 'Dec': 12 };
      const m = String(monthStr).substring(0, 3);
      return monthMap[m] || parseInt(monthStr, 10) || 0;
    };

    // Helper: Sort trends chronologically and take last N months
    const sortAndLimitTrends = (trendsArr, limit = 4) => {
      if (!trendsArr || trendsArr.length === 0) return [];
      const sorted = [...trendsArr].sort((a, b) => {
        const yearA = a.period?.year || 0;
        const yearB = b.period?.year || 0;
        if (yearA !== yearB) return yearA - yearB;
        return getMonthNumber(a.period?.month) - getMonthNumber(b.period?.month);
      });
      return sorted.slice(-limit);
    };

    // 1. Overview & Trends - sorted chronologically, last 4 months only
    const sortedRegularTrends = sortAndLimitTrends(data.trends?.monthlyRoyaltyTrends, 4);
    const regularTrends = sortedRegularTrends.map((item, index) => ({
      month: formatPeriod(item.period, index), 
      regular: item.regularRoyalty || 0,
      total: item.totalEarnings || 0,
      streaming: item.regularRoyalty || 0,
      mechanical: 0,
      sync: 0
    }));
    

    const sortedBonusTrends = sortAndLimitTrends(data.trends?.monthlyBonusRoyaltyTrends, 4);
    const bonusTrends = sortedBonusTrends.map((item, index) => ({
      month: formatPeriod(item.period, index),
      bonus: item.bonusRoyalty || 0,
      streaming: item.bonusRoyalty || 0, 
      mechanical: 0,
      sync: 0
    }));

    // 2. Platform Breakdown
    const regularPlatforms = processPlatformData(data.platforms?.regular?.performance);
    const bonusPlatforms = processPlatformData(data.platforms?.bonus?.performance);

    // 3. Top Tracks
    const mapTracks = (trackList) => {
        if(!trackList) return [];
        return trackList.map((track, i) => ({
            id: i,
            name: track.title || 'Unknown Track', 
            artist: track.artist || 'Unknown Artist',
            earnings: formatCurrency(track.revenue),
            streams: formatNumber(track.streams || 0)
        }));
    };

    const regularTracks = mapTracks(data.topTracks?.regular);
    const bonusTracks = mapTracks(data.topTracks?.bonus);

    return {
      overview: data.overview || {},
      performance: data.performance || {},
      trends: { regular: regularTrends, bonus: bonusTrends },
      hasBonusData: bonusTrends.length > 0,
      platforms: { regular: regularPlatforms, bonus: bonusPlatforms },
      tracks: { regular: regularTracks, bonus: bonusTracks },
      // Using Mock Data for Payments Tab as requested
      paymentHistory: MOCK_PAYMENT_HISTORY.map(p => ({
          ...p,
          regularFormatted: formatCurrency(p.regular),
          bonusFormatted: formatCurrency(p.bonus),
          totalFormatted: formatCurrency(p.total)
      }))
    };
  }, [royaltyData]);

  // Process MCN data
  const mcnProcessed = useMemo(() => {
    if (!mcnData?.data) return null;
    const { data } = mcnData;

    // Process trends — sort chronologically, take last 5 months
    const trends = (data.trends || [])
      .sort((a, b) => {
        const [mA, yA] = a.month.split('-');
        const [mB, yB] = b.month.split('-');
        if (parseInt(yA) !== parseInt(yB)) return parseInt(yA) - parseInt(yB);
        const monthOrder = { 'January': 1, 'February': 2, 'March': 3, 'April': 4, 'May': 5, 'June': 6, 'July': 7, 'August': 8, 'September': 9, 'October': 10, 'November': 11, 'December': 12 };
        return (monthOrder[mA] || 0) - (monthOrder[mB] || 0);
      })
      .slice(-5);

    return {
      overview: data.overview || {},
      trends,
      topChannels: data.topChannels || [],
      hasMCNData: trends.length > 0 || (data.topChannels && data.topChannels.length > 0)
    };
  }, [mcnData]);

  if (isLoading) return <div className="min-h-screen flex items-center justify-center">Loading Royalties...</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-500">Error loading data</div>;

  const { overview, trends, platforms, tracks, performance, paymentHistory, hasBonusData } = processedData;

  // Filter Logic for Payment Tables
  const filteredPayments = paymentHistory.filter(payment => {
    if (paymentFilter === 'all') return true;
    if (paymentFilter === 'regular') return payment.regular > 0;
    if (paymentFilter === 'bonus') return payment.bonus > 0;
    return true;
  });

  return (
    <div className="min-h-screen bg-background text-foreground p-6">
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Royalties</h1>
          <p className="text-muted-foreground">Track your earnings and royalty payments</p>
        </div>
        <div className="flex items-center gap-4">
          {/* <Select value={timeframeMap[timeframe]} onValueChange={(val) => setTimeframe(reverseTimeframeMap[val])}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 days</SelectItem>
              <SelectItem value="30days">Last 30 days</SelectItem>
              <SelectItem value="90days">Last 90 days</SelectItem>
              <SelectItem value="1year">Last year</SelectItem>
            </SelectContent>
          </Select> */}
          <Button variant="outline" size="sm" onClick={() => setIsExportModalOpen(true)}>
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
          {/* <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-white">
            <Calendar className="w-4 h-4 mr-2" />
            Schedule Payout
          </Button> */}
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 ">
            <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency((overview.totalEarnings || 0) + (mcnProcessed?.overview?.totalPayoutInr || 0))}</div>
            <div className={`flex items-center text-sm ${overview.growthPercent >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              <span>{overview.growthPercent > 0 ? '+' : ''}{overview.growthPercent}% from last period</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 ">
            <CardTitle className="text-sm font-medium">Regular Royalty</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(overview.regularRoyalty)}</div>
            <div className="flex items-center text-sm text-muted-foreground">
              <span>Standard earnings</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 ">
            <CardTitle className="text-sm font-medium">Bonus Royalties</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(overview.bonusRoyalty)}</div>
            <div className="flex items-center text-sm text-muted-foreground">
              <span>Performance bonuses</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 ">
            <CardTitle className="text-sm font-medium">MCN Royalty</CardTitle>
            <Music className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mcnLoading ? '...' : formatCurrency(mcnProcessed?.overview?.totalPayoutInr || 0)}
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <span>YouTube MCN earnings</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="breakdown">Breakdown</TabsTrigger>
          {/* <TabsTrigger value="payments">Payments</TabsTrigger> */}
          {/* <TabsTrigger value="reports">Reports</TabsTrigger> */}
        </TabsList>

        {/* 1. OVERVIEW TAB */}
        <TabsContent value="overview" className="space-y-8">
          <div className="space-y-6">
            <h3 className="text-xl font-semibold">Regular Royalties</h3>
            {/* <Card>
              <CardHeader>
                <CardTitle>Monthly Royalty Trends</CardTitle>
                <CardDescription>Regular earnings over selected timeframe</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={trends.regular}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="month" className="text-muted-foreground" />
                    <YAxis className="text-muted-foreground" />
                    <Tooltip contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151' }} itemStyle={{ color: '#fff' }} />
                    <Line type="monotone" dataKey="regular" stroke="#F59E0B" strokeWidth={3} dot={{ fill: '#F59E0B', strokeWidth: 2, r: 4 }} name="Regular Royalty" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card> */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
              <CardHeader>
                <CardTitle>Monthly Royalty Trends</CardTitle>
                <CardDescription>Regular earnings over selected timeframe</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={trends.regular}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="month" className="text-muted-foreground" />
                    <YAxis className="text-muted-foreground" />
                    <Tooltip contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151' }} itemStyle={{ color: '#fff' }} />
                    <Line type="monotone" dataKey="regular" stroke="#F59E0B" strokeWidth={3} dot={{ fill: '#F59E0B', strokeWidth: 2, r: 4 }} name="Regular Royalty" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Royalty Composition</CardTitle>
                  <CardDescription>Breakdown by type (Data pending)</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={trends.regular}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="month" className="text-muted-foreground" />
                      <YAxis className="text-muted-foreground" />
                      <Tooltip contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151' }} itemStyle={{ color: '#fff' }} />
                      <Bar dataKey="streaming" fill="#8B5CF6" name="Total Regular" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              {/* <Card>
                <CardHeader>
                  <CardTitle>Performance Metrics</CardTitle>
                  <CardDescription>Key regular performance indicators</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between bg-muted-foreground/10 p-4 rounded-lg">
                      <div>
                        <p className="text-sm text-muted-foreground">Average Monthly</p>
                        <p className="text-xl font-bold">{formatCurrency(performance.regular?.averageMonthly)}</p>
                      </div>
                      <TrendingUp className="h-6 w-6 text-green-500" />
                    </div>
                    <div className="flex items-center justify-between bg-muted-foreground/10 p-4 rounded-lg">
                      <div>
                        <p className="text-sm text-muted-foreground">Best Month</p>
                        <p className="text-xl font-bold">{performance.regular?.bestMonth?.month || 'N/A'}</p>
                        <p className="text-xs text-muted-foreground">{formatCurrency(performance.regular?.bestMonth?.amount)}</p>
                      </div>
                      <BarChart3 className="h-6 w-6 text-blue-500" />
                    </div>
                    <div className="flex items-center justify-between bg-muted-foreground/10 p-4 rounded-lg">
                      <div>
                        <p className="text-sm text-muted-foreground">Growth Rate</p>
                        <p className="text-xl font-bold text-green-500">{performance.regular?.growthRate || 0}%</p>
                      </div>
                      <TrendingUp className="h-6 w-6 text-green-500" />
                    </div>
                  </div>
                </CardContent>
              </Card> */}
            </div>
          </div>

          {/* Bonus Royalties - only shown when data exists */}
          {hasBonusData && (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold">Bonus Royalties</h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
              <CardHeader>
                <CardTitle>Monthly Bonus Royalty Trends</CardTitle>
                <CardDescription>Track your bonus earnings over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={trends.bonus}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="month" className="text-muted-foreground" />
                    <YAxis className="text-muted-foreground" />
                    <Tooltip contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151' }} itemStyle={{ color: '#fff' }} />
                    <Line type="monotone" dataKey="bonus" stroke="#F59E0B" strokeWidth={3} dot={{ fill: '#F59E0B', strokeWidth: 2, r: 4 }} name="Bonus Royalty" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
               <Card>
                <CardHeader>
                  <CardTitle>Bonus Composition</CardTitle>
                  <CardDescription>Breakdown by type (Data pending)</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={trends.bonus}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="month" className="text-muted-foreground" />
                      <YAxis className="text-muted-foreground" />
                      <Tooltip contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151' }} itemStyle={{ color: '#fff' }} />
                      <Bar dataKey="streaming" fill="#8B5CF6" name="Total Bonus" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </div>
          )}

          {/* MCN Royalty Table - only shown when data exists */}
          {mcnProcessed?.hasMCNData && (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold">MCN Royalty</h3>
            <Card>
              <CardHeader>
                <CardTitle>MCN Revenue Summary</CardTitle>
                <CardDescription>YouTube channel earnings from MCN network (Last 5 months)</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-medium text-muted-foreground">Month</th>
                        <th className="text-left py-3 px-4 font-medium text-muted-foreground">YouTube Payout (USD)</th>
                        <th className="text-left py-3 px-4 font-medium text-muted-foreground">MV Commission</th>
                        <th className="text-left py-3 px-4 font-medium text-muted-foreground">Revenue (USD)</th>
                        <th className="text-right py-3 px-4 font-medium text-muted-foreground">Payout Revenue (INR)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mcnProcessed.trends.map((trend, i) => (
                        <tr key={i} className="border-b hover:bg-accent/50 transition-colors">
                          <td className="py-3 px-4 font-medium">{trend.month}</td>
                          <td className="py-3 px-4">${(trend.revenueUsd + trend.mvCommission).toFixed(2)}</td>
                          <td className="py-3 px-4">${trend.mvCommission.toFixed(2)}</td>
                          <td className="py-3 px-4">${trend.revenueUsd.toFixed(2)}</td>
                          <td className="py-3 px-4 text-right font-semibold">₹{trend.payoutInr.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                        </tr>
                      ))}
                      {mcnProcessed.trends.length === 0 && (
                        <tr><td colSpan={5} className="text-center py-6 text-muted-foreground">No MCN royalty data available</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Top Channels Table */}
            {mcnProcessed.topChannels.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Top YouTube Channels</CardTitle>
                <CardDescription>Channel-wise performance breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-medium text-muted-foreground">YouTube Channel Name</th>
                        <th className="text-left py-3 px-4 font-medium text-muted-foreground">YouTube Payout (USD)</th>
                        <th className="text-left py-3 px-4 font-medium text-muted-foreground">MV Commission</th>
                        <th className="text-left py-3 px-4 font-medium text-muted-foreground">Revenue (USD)</th>
                        <th className="text-right py-3 px-4 font-medium text-muted-foreground">Payout Revenue (INR)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mcnProcessed.topChannels.map((channel, i) => (
                        <tr key={i} className="border-b hover:bg-accent/50 transition-colors">
                          <td className="py-3 px-4 font-medium">{channel.channelName || 'Unknown Channel'}</td>
                          <td className="py-3 px-4">${(channel.totalRevenueUsd + channel.mvCommission).toFixed(2)}</td>
                          <td className="py-3 px-4">${channel.mvCommission.toFixed(2)}</td>
                          <td className="py-3 px-4">${channel.totalRevenueUsd.toFixed(2)}</td>
                          <td className="py-3 px-4 text-right font-semibold">₹{channel.totalPayoutInr.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
            )}
          </div>
          )}

          {/* MCN Loading State */}
          {mcnLoading && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground mr-2" />
              <span className="text-muted-foreground">Loading MCN data...</span>
            </div>
          )}
        </TabsContent>

        {/* 2. BREAKDOWN TAB */}
        <TabsContent value="breakdown" className="space-y-8">
          <div className="space-y-6">
            <h3 className="text-xl font-semibold">Regular Breakdown</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Revenue by Platform</CardTitle>
                  <CardDescription>Top Performing Platforms</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 mb-6">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={platforms.regular.chart}
                          cx="50%"
                          cy="50%"
                          innerRadius={40}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {platforms.regular.chart.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Platform Performance</CardTitle>
                  <CardDescription>Detailed revenue breakdown</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scroll">
                    {platforms.regular.list.map((platform) => (
                      <div key={platform.name} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: platform.color }}></div>
                          <div>
                            <p className="font-medium">{platform.name}</p>
                            <p className="text-sm text-muted-foreground">{platform.share}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">{platform.amount}</p>
                          <p className="text-sm text-muted-foreground">{formatNumber(platform.units)} units</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
            {/* <Card>
              <CardHeader>
                <CardTitle>Top Earning Tracks</CardTitle>
                <CardDescription>Highest regular revenue generating tracks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {tracks.regular.length === 0 ? (
                      <div className="text-center text-muted-foreground py-8">No track data available yet</div>
                  ) : (
                      tracks.regular.map((track) => (
                        <div key={track.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center space-x-4">
                            <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                              <Music className="w-4 h-4" />
                            </div>
                            <div>
                              <h3 className="font-semibold">{track.name}</h3>
                              <p className="text-sm text-muted-foreground">{track.artist}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">{track.earnings}</p>
                            <p className="text-sm text-muted-foreground">{track.streams} streams</p>
                          </div>
                        </div>
                      ))
                  )}
                </div>
              </CardContent>
            </Card> */}
          </div>
          {/* Bonus Breakdown - only shown when data exists */}
          {hasBonusData && platforms.bonus.list.length > 0 && (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold">Bonus Breakdown</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Bonus Revenue by Platform</CardTitle>
                  <CardDescription>Platforms generating bonuses</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 mb-6">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={platforms.bonus.chart}
                          cx="50%"
                          cy="50%"
                          innerRadius={40}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {platforms.bonus.chart.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Bonus Royalty Platform Performance</CardTitle>
                  <CardDescription>Detailed bonus breakdown</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 max-h-[400px]  overflow-y-auto pr-2 custom-scroll">
                    {platforms.bonus.list.map((platform) => (
                        <div key={platform.name} className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex items-center space-x-3">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: platform.color }}></div>
                            <div>
                                <p className="font-medium">{platform.name}</p>
                                <p className="text-sm text-muted-foreground">{platform.share}</p>
                            </div>
                            </div>
                            <div className="text-right">
                            <p className="font-semibold">{platform.amount}</p>
                            <p className="text-sm text-muted-foreground">{formatNumber(platform.units)} units</p>
                            </div>
                        </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          )}
        </TabsContent>

        {/* 3. PAYMENTS TAB - SEPARATE LISTS */}
        <TabsContent value="payments" className="space-y-8">
          
          {/* List 1: Payment History (Regular/All) */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Payment History</CardTitle>
                <CardDescription>Track all your regular royalty payments</CardDescription>
              </div>
              <Select value={paymentFilter} onValueChange={setPaymentFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="All Payments" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Payments</SelectItem>
                  <SelectItem value="regular">Regular Only</SelectItem>
                  <SelectItem value="bonus">Bonus Only</SelectItem>
                </SelectContent>
              </Select>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">Payment Date</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">Period</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">Regular</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">Bonus</th>
                      <th className="text-right py-3 px-4 font-medium text-muted-foreground">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPayments.map((payment, i) => (
                      <tr key={i} className="border-b hover:bg-accent/50">
                        <td className="py-3 px-4 font-medium">{payment.date}</td>
                        <td className="py-3 px-4">{payment.period}</td>
                        <td className="py-3 px-4">{payment.regularFormatted}</td>
                        <td className="py-3 px-4">{payment.bonusFormatted}</td>
                        <td className="py-3 px-4 text-right font-semibold">{payment.totalFormatted}</td>
                      </tr>
                    ))}
                    {filteredPayments.length === 0 && (
                        <tr><td colSpan={5} className="text-center py-4 text-muted-foreground">No payment history found</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* List 2: Bonus Payment History (Specific separate list) */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Bonus Payment History</CardTitle>
                <CardDescription>Track all your bonus royalty payments</CardDescription>
              </div>
              <Select value={paymentFilter} onValueChange={setPaymentFilter}>
                <SelectTrigger className="w-[180px]">
                   <SelectValue placeholder="All Payments" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Payments</SelectItem>
                </SelectContent>
              </Select>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">Payment Date</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">Period</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">Regular</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">Bonus</th>
                      <th className="text-right py-3 px-4 font-medium text-muted-foreground">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPayments.map((payment, i) => (
                      <tr key={`bonus-${i}`} className="border-b hover:bg-accent/50">
                        <td className="py-3 px-4 font-medium">{payment.date}</td>
                        <td className="py-3 px-4">{payment.period}</td>
                        <td className="py-3 px-4">{payment.regularFormatted}</td>
                        <td className="py-3 px-4">{payment.bonusFormatted}</td>
                        <td className="py-3 px-4 text-right font-semibold">{payment.totalFormatted}</td>
                      </tr>
                    ))}
                    {filteredPayments.length === 0 && (
                        <tr><td colSpan={5} className="text-center py-4 text-muted-foreground">No payment history found</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 4. REPORTS TAB */}
        <TabsContent value="reports" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Generate Custom Report</CardTitle>
                <CardDescription>Create detailed royalty reports</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Report Type</label>
                  <Select>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select report type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="earnings">Earnings Summary</SelectItem>
                      <SelectItem value="platform">Platform Breakdown</SelectItem>
                      <SelectItem value="tracks">Track Performance</SelectItem>
                      <SelectItem value="payments">Payment History</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Date Range</label>
                  <div className="grid grid-cols-2 gap-2">
                    <input type="date" className="px-3 py-2 border rounded-md bg-background" />
                    <input type="date" className="px-3 py-2 border rounded-md bg-background" />
                  </div>
                </div>
                <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                  <Download className="w-4 h-4 mr-2" />
                  Generate Report
                </Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Quick Downloads</CardTitle>
                <CardDescription>Ready-made reports and documents</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {quickDownloads.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent cursor-pointer transition-colors">
                      <div className="flex items-center space-x-3">
                        <FileDown className="w-4 h-4 text-muted-foreground" />
                        <span className="font-medium">{item}</span>
                      </div>
                      <Download className="w-4 h-4 text-muted-foreground" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            {/* Bonus Report Generation (Restored) */}
            <Card>
              <CardHeader>
                <CardTitle>Generate Custom Report for Bonus</CardTitle>
                <CardDescription>Create detailed bonus royalty reports</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Report Type</label>
                  <Select>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select report type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="earnings">Bonus Earnings Summary</SelectItem>
                      <SelectItem value="platform">Bonus Platform Breakdown</SelectItem>
                      <SelectItem value="tracks">Bonus Track Performance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Date Range</label>
                  <div className="grid grid-cols-2 gap-2">
                    <input type="date" className="px-3 py-2 border rounded-md bg-background" />
                    <input type="date" className="px-3 py-2 border rounded-md bg-background" />
                  </div>
                </div>
                <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                  <Download className="w-4 h-4 mr-2" />
                  Generate Report
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Export Modal */}
      <Dialog open={isExportModalOpen} onOpenChange={setIsExportModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Export Royalty Report</DialogTitle>
            <DialogDescription>
              Select the month and the type of royalty data you wish to export as a CSV.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="type" className="text-right">
                Type
              </Label>
              <Select value={exportType} onValueChange={setExportType}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select export type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="regular">Regular Royalty</SelectItem>
                  <SelectItem value="bonus">Bonus Royalty</SelectItem>
                  <SelectItem value="mcn">MCN Royalty</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="month" className="text-right">
                Month
              </Label>
              <Select value={exportMonth} onValueChange={setExportMonth} disabled={!exportType || isFetchingMonths}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder={!exportType ? "Select a type first" : (isFetchingMonths ? "Loading..." : "Select a month")} />
                </SelectTrigger>
                <SelectContent>
                  {availableMonths.map((month) => (
                    <SelectItem key={month._id} value={month._id}>
                      {month.displayName}
                    </SelectItem>
                  ))}
                  {availableMonths.length === 0 && !isFetchingMonths && exportType && (
                    <div className="p-2 text-sm text-muted-foreground text-center">No months available</div>
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsExportModalOpen(false)}>Cancel</Button>
            <Button onClick={handleExport} disabled={exporting || !exportMonth || !exportType} className="bg-purple-600 hover:bg-purple-700 text-white">
              {exporting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Exporting...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  Download CSV
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}