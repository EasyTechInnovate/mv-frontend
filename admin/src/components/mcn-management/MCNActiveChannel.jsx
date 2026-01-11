import React from "react";
import { Eye, Edit } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const StatusBadge = ({ status }) => {
  const statusConfig = {
    pending: "bg-yellow-500/20 text-yellow-500",
    approved: "bg-green-500/20 text-green-500",
    active: "bg-green-500/20 text-green-500",
    rejected: "bg-red-500/20 text-red-500",
    removal_requested: "bg-orange-500/20 text-orange-500",
    removal_approved: "bg-purple-500/20 text-purple-400",
    inactive: "bg-gray-500/20 text-gray-400",
    suspended: "bg-red-700/20 text-red-500",
  };
  const normalizedStatus = status?.toLowerCase().replace(/ /g, '_');
  const className = statusConfig[normalizedStatus] || "bg-gray-500/20 text-gray-400";
  
  return (
    <Badge className={className}>
      {status?.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
    </Badge>
  );
};

export default function ActiveChannelTable({ 
  theme = "dark", 
  channels,
  onViewChannel,
  onEditChannel,
  onEditStatus,
}) {
  const isDark = theme === "dark";
  const textColor = isDark ? "text-gray-300" : "text-[#111A22]";
  const borderColor = isDark ? "border-[#1f2d38]" : "border-gray-200";

  return (
      <div className="overflow-x-auto">
          <table className="min-w-[900px] w-full text-sm border-collapse">
            <thead className="text-gray-500">
              <tr>
                {["MCN Channel", "Status", "Revenue Share", "YouTube ID", "Account ID", "Account Name", "Actions"].map(
                  (th, idx) => (
                    <th
                      key={idx}
                      className="text-left px-4 py-3 font-medium uppercase tracking-wide text-xs border-b"
                    >
                      {th}
                    </th>
                  )
                )}
              </tr>
            </thead>

            <tbody>
              {channels.length > 0 ? (
                channels.map((channel) => {
                  const fullName = channel.userId ? `${channel.userId.firstName || ""} ${channel.userId.lastName || ""}`.trim() : "Unknown";
                  return (
                  <tr
                    key={channel._id}
                    className={`border-b ${borderColor} hover:bg-gray-800/10 transition`}
                  >
                    <td className="px-4 py-4 whitespace-nowrap">
                      <p className={`font-semibold ${textColor}`}>{channel.channelName}</p>
                      <p className="text-xs text-gray-500">
                        Manager: {channel.channelManager || "-"}
                      </p>
                    </td>

                    <td className="px-4 py-4 whitespace-nowrap">
                      <StatusBadge status={channel.status} />
                    </td>

                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className={`${textColor}`}>{channel.revenueShare}%</span>
                    </td>

                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className="text-purple-400 font-medium truncate block max-w-[200px]" title={channel.youtubeChannelId}>{channel.youtubeChannelId}</span>
                    </td>

                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className="text-green-400 font-medium">
                        {channel.userAccountId}
                      </span>
                    </td>

                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className="text-blue-400 font-medium">{fullName}</span>
                    </td>

                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onViewChannel && onViewChannel(channel)}
                          className={`p-2 rounded-lg ${isDark
                              ? "bg-gray-700 text-white hover:bg-gray-600"
                              : "bg-gray-200 text-black hover:bg-gray-300"
                            } transition`}
                        >
                          <Eye size={16} />
                        </button>

                        <button
                          onClick={() => onEditChannel && onEditChannel(channel)}
                          className={`p-2 rounded-lg ${isDark
                              ? "bg-gray-700 text-white hover:bg-gray-600"
                              : "bg-gray-200 text-black hover:bg-gray-300"
                            } transition`}
                        >
                          <Edit size={16} />
                        </button>

                        <button
                          onClick={() => onEditStatus && onEditStatus(channel)}
                          className={`p-2 rounded-lg ${isDark
                              ? "bg-gray-700 text-white hover:bg-gray-600"
                              : "bg-gray-200 text-black hover:bg-gray-300"
                            } transition`}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-toggle-right"><rect width="20" height="12" x="2" y="6" rx="6" ry="6"/><circle cx="16" cy="12" r="2"/></svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                )})
              ) : (
                <tr>
                  <td
                    colSpan={7}
                    className="text-center py-10 text-gray-400 italic text-sm"
                  >
                    No channels found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
      </div>
  );
}