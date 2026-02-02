import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { Download, DollarSign, TrendingUp, BarChart3, Calendar, Music, FileDown } from 'lucide-react';
import { getRoyaltyDashboard } from '@/services/api.services';

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

  // Fetch royalty data
  const { data: royaltyData, isLoading, error } = useQuery({
    queryKey: ['royalty', timeframe],
    queryFn: () => getRoyaltyDashboard({ timeframe }),
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

    // 1. Overview & Trends
    const regularTrends = data.trends?.monthlyRoyaltyTrends?.map((item, index) => ({
      month: item.date || `Month ${index + 1}`, 
      regular: item.regularRoyalty || 0,
      total: item.totalEarnings || 0,
      streaming: item.regularRoyalty || 0, // Fallback for composition
      mechanical: 0,
      sync: 0
    })) || [];

    const bonusTrends = data.trends?.monthlyBonusRoyaltyTrends?.map((item, index) => ({
      month: item.date || `Month ${index + 1}`,
      bonus: item.bonusRoyalty || 0,
      streaming: item.bonusRoyalty || 0, 
      mechanical: 0,
      sync: 0
    })) || [];

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

  if (isLoading) return <div className="min-h-screen flex items-center justify-center">Loading Royalties...</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-500">Error loading data</div>;

  const { overview, trends, platforms, tracks, performance, paymentHistory } = processedData;

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
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
          <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-white">
            <Calendar className="w-4 h-4 mr-2" />
            Schedule Payout
          </Button>
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
            <div className="text-2xl font-bold">{formatCurrency(overview.totalEarnings)}</div>
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
            <CardTitle className="text-sm font-medium">Pending Payout</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">--</div>
            <div className="flex items-center text-sm text-muted-foreground">
              <span>Calculated at month end</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="breakdown">Breakdown</TabsTrigger>
          {/* <TabsTrigger value="payments">Payments</TabsTrigger> */}
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        {/* 1. OVERVIEW TAB */}
        <TabsContent value="overview" className="space-y-8">
          <div className="space-y-6">
            <h3 className="text-xl font-semibold">Regular Royalties</h3>
            <Card>
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
            </Card>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                      <Bar dataKey="streaming" stackId="a" fill="#8B5CF6" name="Total Regular" />
                      <Bar dataKey="mechanical" stackId="a" fill="#10B981" name="Mechanical" />
                      <Bar dataKey="sync" stackId="a" fill="#F59E0B" name="Sync" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              <Card>
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
              </Card>
            </div>
          </div>
          <div className="space-y-6">
            <h3 className="text-xl font-semibold">Bonus Royalties</h3>
            <Card>
              <CardHeader>
                <CardTitle>Monthly Bonus Royalty Trends</CardTitle>
                <CardDescription>Track your bonus earnings over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                      <Bar dataKey="streaming" stackId="b" fill="#8B5CF6" name="Total Bonus" />
                      <Bar dataKey="mechanical" stackId="b" fill="#10B981" name="Mechanical" />
                      <Bar dataKey="sync" stackId="b" fill="#F59E0B" name="Sync" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Bonus Performance Metrics</CardTitle>
                  <CardDescription>Key performance indicators for bonuses</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between bg-muted-foreground/10 p-4 rounded-lg">
                      <div>
                        <p className="text-sm text-muted-foreground">Average Monthly</p>
                        <p className="text-xl font-bold">{formatCurrency(performance.bonus?.averageMonthly)}</p>
                      </div>
                      <TrendingUp className="h-6 w-6 text-green-500" />
                    </div>
                    <div className="flex items-center justify-between bg-muted-foreground/10 p-4 rounded-lg">
                      <div>
                        <p className="text-sm text-muted-foreground">Best Month</p>
                        <p className="text-xl font-bold">{performance.bonus?.bestMonth?.month || 'N/A'}</p>
                        <p className="text-xs text-muted-foreground">{formatCurrency(performance.bonus?.bestMonth?.amount)}</p>
                      </div>
                      <BarChart3 className="h-6 w-6 text-blue-500" />
                    </div>
                     <div className="flex items-center justify-between bg-muted-foreground/10 p-4 rounded-lg">
                      <div>
                        <p className="text-sm text-muted-foreground">Growth Rate</p>
                        <p className="text-xl font-bold text-green-500">{performance.bonus?.growthRate || 0}%</p>
                      </div>
                      <TrendingUp className="h-6 w-6 text-green-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
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
                  <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
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
                  <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                    {platforms.bonus.list.length === 0 ? (
                        <div className="text-center text-muted-foreground py-4">No bonus platform data</div>
                    ) : (
                        platforms.bonus.list.map((platform) => (
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
                        ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
            {/* <Card>
              <CardHeader>
                <CardTitle>Top Earning Tracks for Bonuses</CardTitle>
                <CardDescription>Tracks generating the highest bonuses</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {tracks.bonus.length === 0 ? (
                      <div className="text-center text-muted-foreground py-8">No bonus track data available yet</div>
                  ) : (
                      tracks.bonus.map((track) => (
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
    </div>
  );
}