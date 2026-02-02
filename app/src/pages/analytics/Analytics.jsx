import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Download, Play, Users, Globe, IndianRupee } from 'lucide-react';
import { getAnalyticsDashboard } from '@/services/api.services';

// Country code to name mapping
const COUNTRY_NAMES = {
  'IN': 'India', 'PK': 'Pakistan', 'GB': 'United Kingdom', 'AE': 'UAE',
  'US': 'United States', 'SA': 'Saudi Arabia', 'ZA': 'South Africa',
  'NL': 'Netherlands', 'AU': 'Australia', 'MY': 'Malaysia', 'CA': 'Canada',
  'NZ': 'New Zealand', 'TR': 'Turkey', 'FR': 'France', 'SG': 'Singapore',
  'OM': 'Oman', 'JP': 'Japan', 'NO': 'Norway', 'DE': 'Germany',
  'KW': 'Kuwait', 'IT': 'Italy', 'QA': 'Qatar', 'UA': 'Ukraine',
  'YE': 'Yemen', 'ES': 'Spain', 'MX': 'Mexico', 'BE': 'Belgium',
  'ID': 'Indonesia', 'BR': 'Brazil', 'RU': 'Russia', 'KR': 'South Korea',
  'TH': 'Thailand', 'PH': 'Philippines', 'VN': 'Vietnam', 'EG': 'Egypt'
};

const getCountryName = (code) => COUNTRY_NAMES[code] || code;

export default function Analytics() {
  const [timeframe, setTimeframe] = useState('last_30_days');
  const [groupBy] = useState('day');

  // Fetch analytics data
  const { data: analyticsData, isLoading, error } = useQuery({
    queryKey: ['analytics', timeframe, groupBy],
    queryFn: () => getAnalyticsDashboard({
      timeframe,
      groupBy,
      topTracksLimit: 10,
      countriesLimit: 20
    }),
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Map timeframe values for the select component
  const timeframeMap = {
    'last_7_days': '7days',
    'last_30_days': '30days',
    'last_3_months': '3months',
    'last_6_months': '6months',
    'last_year': '1year'
  };

  const reverseTimeframeMap = {
    '7days': 'last_7_days',
    '30days': 'last_30_days',
    '3months': 'last_3_months',
    '6months': 'last_6_months',
    '1year': 'last_year'
  };

  // Handle timeframe change
  const handleTimeframeChange = (value) => {
    setTimeframe(reverseTimeframeMap[value]);
  };

  // Format number with K, M suffixes
  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num?.toString() || '0';
  };

  // Format currency
  const formatCurrency = (num) => {
    return '₹' + (num || 0).toLocaleString('en-IN');
  };

  // Format period for chart display
  const formatPeriod = (period) => {
    if (!period) return '';
    const { year, month, day, week } = period;
    if (day) return `${month} ${day}`;
    if (week) return `Week ${week}, ${year}`;
    if (month) return `${month} ${year}`;
    return `${year}`;
  };

  // Process and transform API data
  const processedData = useMemo(() => {
    if (!analyticsData?.data) return null;

    const data = analyticsData.data;
    const overview = data.overview || {};

    // Transform chart data - add date field from period
    const streamsChartData = data.charts?.streamsOverTime?.data?.map(item => ({
      ...item,
      date: formatPeriod(item.period),
      streams: item.totalStreams
    })) || [];

    const revenueChartData = data.charts?.revenueOverTime?.data?.map(item => ({
      ...item,
      date: formatPeriod(item.period),
      revenue: item.totalRevenue
    })) || [];

    // Transform top tracks data - map field names
    const topTracks = data.topTracks?.tracks?.map(track => ({
      trackName: track.trackTitle,
      artistName: track.artistName,
      albumName: track.albumTitle,
      streams: track.totalStreams,
      revenue: track.totalRevenue,
      platforms: track.platforms,
      platformCount: track.platformCount,
      countryCount: track.countryCount
    })) || [];

    // Transform platforms data - calculate percentages
    const totalStreams = data.distribution?.platforms?.reduce((sum, p) => sum + (p.totalStreams || 0), 0) || 1;
    const platforms = data.distribution?.platforms?.map(platform => ({
      platformName: platform.platform,
      streams: platform.totalStreams,
      revenue: platform.totalRevenue,
      percentage: (platform.totalStreams / totalStreams) * 100,
      trackCount: platform.trackCount
    })) || [];

    // Transform countries data - add country names
    const countries = data.distribution?.countries?.data?.map(country => ({
      countryCode: country.countryCode,
      countryName: getCountryName(country.countryCode),
      streams: country.totalStreams,
      revenue: country.totalRevenue,
      trackCount: country.trackCount
    })) || [];

    return {
      overview,
      streamsChartData,
      revenueChartData,
      topTracks,
      platforms,
      countries
    };
  }, [analyticsData]);

  const overview = processedData?.overview || {};
  const streamsChartData = processedData?.streamsChartData || [];
  const revenueChartData = processedData?.revenueChartData || [];
  const topTracksData = processedData?.topTracks || [];
  const platformsData = processedData?.platforms || [];
  const countriesData = processedData?.countries || [];

  return (
    <div className="min-h-screen bg-background text-foreground p-6">
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Analytics</h1>
          <p className="text-muted-foreground">Detailed insights into your music performance and audience</p>
        </div>
        <div className="flex items-center gap-4">
          {/* <Select
            value={timeframeMap[timeframe]}
            onValueChange={handleTimeframeChange}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 days</SelectItem>
              <SelectItem value="30days">Last 30 days</SelectItem>
              <SelectItem value="3months">Last 3 months</SelectItem>
              <SelectItem value="6months">Last 6 months</SelectItem>
              <SelectItem value="1year">Last year</SelectItem>
            </SelectContent>
          </Select> */}
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center h-64">
          <div className="text-muted-foreground">Loading analytics...</div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="flex items-center justify-center h-64">
          <div className="text-red-500">Failed to load analytics data</div>
        </div>
      )}

      {/* Key Metrics */}
      {!isLoading && !error && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 ">
                <CardTitle className="text-sm font-medium">Total Streams</CardTitle>
                <Play className="h-4 w-4 text-[#711CE9]" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatNumber(overview?.totalStreams?.totalStreams || 0)}
                </div>
                <div className="flex items-center text-xs text-muted-foreground ">
                  <h1>
                    <span className={overview?.streamsGrowth >= 0 ? 'text-green-500' : 'text-red-500'}>
                      {overview?.streamsGrowth >= 0 ? '+' : ''}{overview?.streamsGrowth?.toFixed(1) || 0}%
                    </span> vs last period
                  </h1>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 ">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <IndianRupee className="h-4 w-4 text-[#711CE9]" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatCurrency(overview?.totalRevenue || 0)}
                </div>
                <div className="flex items-center text-xs text-muted-foreground ">
                  <h1>
                    <span className={overview?.revenueGrowth >= 0 ? 'text-green-500' : 'text-red-500'}>
                      {overview?.revenueGrowth >= 0 ? '+' : ''}{overview?.revenueGrowth?.toFixed(1) || 0}%
                    </span> vs last period
                  </h1>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 ">
                <CardTitle className="text-sm font-medium">Active Listeners</CardTitle>
                <Users className="h-4 w-4 text-[#711CE9]" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatNumber(overview?.activeListeners || 0)}
                </div>
                <div className="flex items-center text-xs text-muted-foreground ">
                  <span>Unique listeners this period</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 ">
                <CardTitle className="text-sm font-medium">Countries Reached</CardTitle>
                <Globe className="h-4 w-4 text-[#711CE9]" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {overview?.countriesReached || 0}
                </div>
                <div className="flex items-center text-xs text-muted-foreground">
                  <span>Countries streaming your music</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tabs Section */}
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 ">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              {/* <TabsTrigger value="tracks">Top Tracks</TabsTrigger> */}
              {/* <TabsTrigger value="audience">Audience</TabsTrigger> */}
              <TabsTrigger value="platforms">Platforms</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Streams Over Time</CardTitle>
                    <CardDescription>Streaming performance over selected period</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {streamsChartData.length > 0 ? (
                      <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={streamsChartData}>
                          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                          <XAxis dataKey="date" className="text-muted-foreground" />
                          <YAxis className="text-muted-foreground " />
                          <Area
                            type="monotone"
                            dataKey="streams"
                            stroke="#711CE9"
                            fill="#711CE9"
                            fillOpacity={0.3}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                        No streaming data available
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Revenue Trends</CardTitle>
                    <CardDescription>Revenue performance over selected period</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {revenueChartData.length > 0 ? (
                      <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={revenueChartData}>
                          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                          <XAxis dataKey="date" className="text-muted-foreground" />
                          <YAxis className="text-muted-foreground" />
                          <Line
                            type="monotone"
                            dataKey="revenue"
                            stroke="#711CE9"
                            strokeWidth={3}
                            dot={{ fill: 'hsl(var(--primary))' }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                        No revenue data available
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Top Tracks Tab */}
            <TabsContent value="tracks" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Top Performing Tracks</CardTitle>
                  <CardDescription>Your most successful releases this period</CardDescription>
                </CardHeader>
                <CardContent>
                  {topTracksData.length > 0 ? (
                    <div className="space-y-4">
                      {topTracksData.map((track, index) => (
                        <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center space-x-4">
                            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-semibold">
                              {index + 1}
                            </div>
                            <div>
                              <h3 className="font-semibold">{track.trackName || 'Unknown Track'}</h3>
                              <p className="text-sm text-muted-foreground">
                                {track.artistName}
                              </p>
                              <div className="flex gap-3 mt-1">
                                <span className="text-xs text-muted-foreground">
                                  {formatNumber(track.streams || 0)} streams
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  • {track.platformCount || 0} platforms
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  • {track.countryCount || 0} countries
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">{formatCurrency(track.revenue || 0)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-32 text-muted-foreground">
                      No track data available
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

        {/* Audience Tab */}
        {/* <TabsContent value="audience" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Age Distribution</CardTitle>
                <CardDescription>Listener demographics by age group</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {audienceData.map((group) => (
                    <div key={group.age} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-4 h-4 bg-primary rounded"></div>
                        <span className="font-medium">{group.age}</span>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="w-32 bg-muted rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full"
                            style={{ width: `${group.percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-muted-foreground w-12 text-right">
                          {group.percentage}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Geographic Distribution</CardTitle>
                <CardDescription>Top listening regions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { country: 'India', percentage: 35, listeners: '15.8K' },
                    { country: 'United States', percentage: 28, listeners: '12.7K' },
                    { country: 'United Kingdom', percentage: 15, listeners: '6.8K' },
                    { country: 'Canada', percentage: 12, listeners: '5.4K' },
                    { country: 'Australia', percentage: 10, listeners: '4.5K' }
                  ].map((region) => (
                    <div key={region.country} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-4 h-4 bg-primary rounded"></div>
                        <span className="font-medium">{region.country}</span>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className="text-sm text-muted-foreground">{region.listeners}</span>
                        <span className="text-sm font-medium w-12 text-right">{region.percentage}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent> */}

            {/* Platforms Tab */}
            <TabsContent value="platforms" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Platform Distribution</CardTitle>
                    <CardDescription>Stream distribution across platforms</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {platformsData.length > 0 ? (
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={platformsData}
                              cx="50%"
                              cy="50%"
                              innerRadius={40}
                              outerRadius={80}
                              paddingAngle={5}
                              dataKey="percentage"
                            >
                              {platformsData.map((entry, index) => {
                                // Platform-specific colors
                                const getPlatformColor = (platformName) => {
                                  const name = platformName?.toLowerCase() || '';
                                  if (name.includes('youtube')) return '#FF0000';
                                  if (name.includes('spotify')) return '#1DB954';
                                  // Random colors for other platforms
                                  const otherColors = ['#FA233B', '#00D9FF', '#711CE9', '#FF6B35', '#F7DC6F', '#BB8FCE'];
                                  return otherColors[index % otherColors.length];
                                };
                                return <Cell key={`cell-${index}`} fill={getPlatformColor(entry.platformName)} />;
                              })}
                            </Pie>
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-64 text-muted-foreground">
                        No platform data available
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Platform Performance</CardTitle>
                    <CardDescription>Detailed breakdown by platform</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {platformsData.length > 0 ? (
                      <div className="space-y-4">
                        {platformsData.map((platform, index) => {
                          // Platform-specific colors
                          const getPlatformColor = (platformName) => {
                            const name = platformName?.toLowerCase() || '';
                            if (name.includes('youtube')) return '#FF0000';
                            if (name.includes('spotify')) return '#1DB954';
                            // Random colors for other platforms
                            const otherColors = ['#FA233B', '#00D9FF', '#711CE9', '#FF6B35', '#F7DC6F', '#BB8FCE'];
                            return otherColors[index % otherColors.length];
                          };
                          const color = getPlatformColor(platform.platformName);
                          return (
                            <div key={platform.platformName || index} className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <div
                                  className="w-4 h-4 rounded"
                                  style={{ backgroundColor: color }}
                                ></div>
                                <span className="font-medium">{platform.platformName || 'Unknown'}</span>
                              </div>
                              <div className="flex items-center space-x-4">
                                <span className="text-sm text-muted-foreground">
                                  {formatNumber(platform.streams || 0)} streams
                                </span>
                                <div className="w-24 bg-muted rounded-full h-2">
                                  <div
                                    className="h-2 rounded-full"
                                    style={{
                                      width: `${platform.percentage || 0}%`,
                                      backgroundColor: color
                                    }}
                                  ></div>
                                </div>
                                <span className="text-sm font-medium w-12 text-right">
                                  {platform.percentage?.toFixed(1) || 0}%
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-32 text-muted-foreground">
                        No platform data available
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
}