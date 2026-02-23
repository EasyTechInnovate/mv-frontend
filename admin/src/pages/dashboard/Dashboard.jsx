import { useEffect, useState } from "react";
import { fetchDashboardData } from "./DashboardData";
import {
  Users,
  Music,
  IndianRupee,
  FileWarning,
  Database,
  Activity,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import GlobalApi from "@/lib/GlobalApi";

const cardIcons = {
  totalUsers: Users,
  activeReleases: Music,
  monthlyRoyalty: IndianRupee,
  pendingKYC: FileWarning,
  totalCatalog: Database,
  platformUsage: Activity,
};


const formatNumber = (num) =>
  typeof num === "number" ? num.toLocaleString("en-IN") : num;


const getThemeClasses = (theme, dark, light) =>
  theme === "dark" ? dark : light;

export default function Dashboard({ theme }) {
  const [data, setData] = useState(null);
  const [showAllActivities, setShowAllActivities] = useState(false);

useEffect(() => {
  const loadData = async () => {
    try {
      const mockDashboardRes = await fetchDashboardData();
      const [healthRes, realDashboardRes] = await Promise.all([
        GlobalApi.getHealth(),
        GlobalApi.getDashboardData()
      ]);

      const realData = realDashboardRes.data.data;

      // Transform the health API data
      const transformHealthData = (apiData) => {
        const { application, system } = apiData;

        return [
          {
            id: 1,
            name: "Application Uptime",
            status: "Operational",
            detail: application.uptime,
          },
          {
            id: 2,
            name: "Memory Usage",
            status: "Operational",
            detail: `Used: ${application.memoryUsage.heapUsed} / Total: ${application.memoryUsage.heapTotal}`,
          },
          {
            id: 3,
            name: "CPU Usage",
            status: system.cpuUsage.some((u) => u > 70)
              ? "Degraded"
              : "Operational",
            detail: `Usage: ${system.cpuUsage.join(", ")}%`,
          },
          {
            id: 4,
            name: "System Memory",
            status:
              parseFloat(system.freeMemory) / parseFloat(system.totalMemory) <
              0.2
                ? "Degraded"
                : "Operational",
            detail: `Free: ${system.freeMemory} / Total: ${system.totalMemory}`,
          },
        ];
      };

      const systemHealthTransformed = transformHealthData(healthRes.data.data);

      const userTypeChartData = Object.keys(realData.users.byType).map(type => {
        const value = realData.users.byType[type];
        const percentage = ((value / realData.users.total) * 100).toFixed(1) + "%";
        return { name: type.charAt(0).toUpperCase() + type.slice(1), value, percentage };
      });

      // Combine real and mock responses
      setData({
        ...mockDashboardRes,
        totalUsers: {
          ...mockDashboardRes.totalUsers,
          count: realData.users.total,
          breakdown: realData.users.byType
        },
        activeReleases: {
          ...mockDashboardRes.activeReleases,
          count: realData.totalReleases,
        },
        monthlyRoyalty: {
          ...mockDashboardRes.monthlyRoyalty,
          amount: `₹${(realData.revenue?.totalEarnings || 0).toLocaleString('en-IN')}`,
          breakdown: {
            paid: `₹${(realData.revenue?.totalPaidOut || 0).toLocaleString('en-IN')}`,
            pending: `₹${(realData.revenue?.totalPending || 0).toLocaleString('en-IN')}`,
          }
        },
        pendingKYC: {
          ...mockDashboardRes.pendingKYC,
          count: realData.pendingKYC?.total || 0,
          breakdown: {
            urgent: realData.pendingKYC?.urgent || 0,
            standard: realData.pendingKYC?.standard || 0,
          }
        },
        totalCatalog: {
            ...mockDashboardRes.totalCatalog,
            count: 0,
        },
        platformUsage: {
            ...mockDashboardRes.platformUsage,
            percentage: "0%",
        },
        platformUsage24h: realData.charts?.platformUsage24h || mockDashboardRes.platformUsage24h,
        revenueGrowth: realData.charts?.revenueGrowth || mockDashboardRes.revenueGrowth,
        userTypeDistribution: userTypeChartData,
        recentActivities: realData.recentSystemActivities?.length > 0 ? realData.recentSystemActivities : mockDashboardRes.recentActivities,
        systemHealth: systemHealthTransformed,
      });
    } catch (err) {
      console.error("Error loading dashboard data:", err);
    }
  };

  loadData();
}, []);


  if (!data)
    return (
      <div
        className={getThemeClasses(
          theme,
          "text-gray-400 bg-gray-950",
          "text-gray-700 bg-gray-100"
        ) + " text-center p-10"}
      >
        Loading Dashboard...
      </div>
    );

 
  const StatCard = ({ title, value, change, breakdown, icon: Icon }) => (
    <div
      className={
        getThemeClasses(
          theme,
          "bg-[#151F28] text-white",
          "bg-white text-black"
        ) + " p-5 rounded-2xl shadow-lg relative"
      }
    >
      <Icon
        className={getThemeClasses(theme, "text-gray-400", "text-gray-500") + " absolute top-4 right-4"}
        size={20}
      />
      <h3
        className={getThemeClasses(theme, "text-gray-400", "text-gray-600") + " text-sm font-medium"}
      >
        {title}
      </h3>
      <p className="text-2xl font-bold mt-1">{formatNumber(value)}</p>

      {breakdown && (
        <div
          className={getThemeClasses(theme, "text-gray-400", "text-gray-600") + " text-xs mt-2"}
        >
          {Object.entries(breakdown)
            .map(
              ([k, v]) =>
                `${k.charAt(0).toUpperCase() + k.slice(1)}: ${formatNumber(v)}`
            )
            .join(" | ")}
        </div>
      )}
    </div>
  );

  return (
    <div
      className={
        getThemeClasses(theme, "bg-[#111A22] text-white", "bg-gray-100 text-black") +
        " min-h-screen p-4 sm:p-6 rounded-2xl"
      }
    >
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {Object.entries(cardIcons).map(([key, Icon]) => (
          <StatCard
            key={key}
            title={key.replace(/([A-Z])/g, " $1")}
            value={data[key]?.count || data[key]?.amount || data[key]?.percentage}
            change={data[key]?.change}
            breakdown={data[key]?.breakdown}
            icon={Icon}
          />
        ))}





      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mt-6 w-full">

        {/* Charts */}
<div
  className={
    getThemeClasses(theme, "bg-[#151F28]", "bg-white") +
    " p-4 sm:p-5 rounded-2xl shadow-lg col-span-1"
  }
>
  <h3
    className={
      getThemeClasses(theme, "text-gray-400", "text-gray-600") +
      " text-xs sm:text-sm font-medium mb-2 sm:mb-3"
    }
  >
    Platform Usage (24h)
  </h3>
  <div className="w-full overflow-x-auto">
    <div className="min-w-[280px]">
      <ResponsiveContainer width="100%" height={220}>
  <LineChart
    data={data.platformUsage24h}
    margin={{ top: 10, right: 10, left: 5, bottom: 0 }}
  >
    <XAxis dataKey="time" stroke={theme === "dark" ? "#aaa" : "#555"} />
    <YAxis 
      stroke={theme === "dark" ? "#aaa" : "#555"} 
      width={35} // ✅ tight Y axis for mobile
    />
    <Tooltip />
    <Line
      type="monotone"
      dataKey="value"
      stroke="#8b5cf6"
      strokeWidth={2}
      dot={{ r: 4, fill: "#8b5cf6" }}
    />
  </LineChart>
</ResponsiveContainer>

    </div>
  </div>
</div>


<div
  className={
    getThemeClasses(theme, "bg-[#151F28]", "bg-white") +
    " p-4 sm:p-5 rounded-2xl shadow-lg"
  }
>
  <h3
    className={
      getThemeClasses(theme, "text-gray-400", "text-gray-600") +
      " text-xs sm:text-sm font-medium mb-2 sm:mb-3"
    }
  >
    Revenue & User Growth
  </h3>

  
  <div className="w-full overflow-x-auto custom-scrollbar">
    <div className="min-w-[280px]">
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data.revenueGrowth}>
          <XAxis dataKey="month" stroke={theme === "dark" ? "#aaa" : "#555"} />
          <YAxis stroke={theme === "dark" ? "#aaa" : "#555"} />
          <Tooltip />
          <Bar dataKey="value" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  </div>
</div>
      </div>

      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mt-6 w-full">
     
        <div
          className={
            getThemeClasses(theme, "bg-[#151F28]", "bg-white") +
            " p-4 sm:p-5 rounded-2xl shadow-lg"
          }
        >
          <h3 className={getThemeClasses(theme, "text-gray-400", "text-gray-600") + " text-xs sm:text-sm font-medium mb-1"}>
            User Type Distribution
          </h3>
          <p className={getThemeClasses(theme, "text-gray-500", "text-gray-500") + " text-[10px] sm:text-xs mb-4"}>
            Breakdown of registered users by category
          </p>
          <div className="space-y-2 text-xs sm:text-sm">
            {data.userTypeDistribution.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      idx === 0 ? "bg-blue-500" : idx === 1 ? "bg-green-500" : "bg-yellow-500"
                    }`}
                  />
                  <span>{item.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>{item.value.toLocaleString()}</span>
                  <span className="text-[10px] sm:text-xs text-gray-500">({item.percentage})</span>
                </div>
              </div>
            ))}
          </div>
          <div
            className={getThemeClasses(theme, "border-gray-800 text-gray-300", "border-gray-300 text-gray-700") + " border-t mt-3 pt-2 text-right text-xs sm:text-sm"}
          >
            Total Users: {data.totalUsers.count.toLocaleString()}
          </div>
        </div>

        {/* Recent Activities */}
        <div
          className={
            getThemeClasses(theme, "bg-[#151F28]", "bg-white") +
            " p-4 sm:p-5 rounded-2xl shadow-lg"
          }
        >
          <h3 className={getThemeClasses(theme, "text-gray-400", "text-gray-600") + " text-xs sm:text-sm font-medium mb-1"}>
            Recent System Activities
          </h3>
          <p className={getThemeClasses(theme, "text-gray-500", "text-gray-500") + " text-[10px] sm:text-xs mb-4"}>
            Latest platform activities and notifications
          </p>
          <ul className="space-y-3 text-xs sm:text-sm max-h-48 overflow-y-auto pr-2 custom-scrollbar">
            {(showAllActivities ? data.recentActivities : data.recentActivities.slice(0, 5)).map(
              (act, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span
                    className={`w-2 h-2 mt-1 rounded-full ${
                      act.type === "success"
                        ? "bg-green-500"
                        : act.type === "warning"
                        ? "bg-yellow-500"
                        : "bg-blue-500"
                    }`}
                  />
                  <div>
                    <p>{act.message}</p>
                    <p className={getThemeClasses(theme, "text-gray-400", "text-gray-500") + " text-[10px] sm:text-xs"}>{act.time}</p>
                  </div>
                </li>
              )
            )}
          </ul>
          <button
            onClick={() => setShowAllActivities(!showAllActivities)}
            className={
              getThemeClasses(theme, "text-gray-400 border-gray-700 hover:bg-gray-800", "text-gray-600 border-gray-300 hover:bg-gray-200") +
              " mt-4 w-full py-1 text-xs sm:text-sm border rounded-lg"
            }
          >
            {showAllActivities ? "Show Less" : "View All Activities"}
          </button>
        </div>
      </div>

      {/* System Health & Status */}
      <div
        className={
          getThemeClasses(theme, "bg-[#151F28]", "bg-white") +
          " p-4 sm:p-5 rounded-2xl shadow-lg w-full mt-6"
        }
      >
        <h3 className={getThemeClasses(theme, "text-gray-400", "text-gray-600") + " text-xs sm:text-sm font-medium mb-1"}>
          System Health & Status
        </h3>
        <p className={getThemeClasses(theme, "text-gray-500", "text-gray-500") + " text-[10px] sm:text-xs mb-4"}>
          Real-time monitoring of critical system components
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {data.systemHealth.map((sys, idx) => (
            <div
              key={idx}
              className={
                getThemeClasses(theme, "bg-gray-800 text-gray-200", "bg-gray-200 text-gray-800") +
                " rounded-lg p-3 sm:p-4 text-center text-xs sm:text-sm"
              }
            >
              <span
                className={`px-2 py-0.5 text-[10px] sm:text-xs font-medium rounded-full ${
                  sys.status === "Operational"
                    ? "bg-green-900/30 text-green-400"
                    : sys.status === "Degraded"
                    ? "bg-yellow-900/30 text-yellow-400"
                    : "bg-red-900/30 text-red-400"
                }`}
              >
                {sys.status}
              </span>
              <p className="mt-2">{sys.name}</p>
              <p className={getThemeClasses(theme, "text-gray-400", "text-gray-600") + " text-[10px] sm:text-xs"}>{sys.detail}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
