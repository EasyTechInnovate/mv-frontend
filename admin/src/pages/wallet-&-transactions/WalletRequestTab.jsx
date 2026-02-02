import { Button } from "@/components/ui/button";

export default function WithdrawalRow({ withdrawal, onApprove, onReject, onView, theme }) {
  const isDark = theme === "dark";

  const StatusBadge = ({ status }) => {
    const cls =
      status === "approved"
        ? "bg-green-600 text-white"
        : status === "rejected"
        ? "bg-red-600 text-white"
        : status === "pending"
        ? isDark
          ? "bg-gray-700 text-gray-200"
          : "bg-gray-200 text-gray-800"
        : "bg-gray-500 text-white";
    return <span className={`text-xs px-2 py-1 rounded-full ${cls}`}>{status.charAt(0).toUpperCase() + status.slice(1)}</span>;
  };

  return (
    <tr className={`border-t ${isDark ? "border-gray-700" : "border-gray-200"}`}>
      <td className="px-5 py-3">{withdrawal.accountId}</td>
      <td className="px-5 py-3">{withdrawal.user}</td>
      <td className="px-5 py-3">₹{withdrawal.amount.toLocaleString("en-IN")}</td>
      <td className="px-5 py-3">{withdrawal.description}</td>
      <td className="px-5 py-3">{withdrawal.date}</td>

      {/* Status Column */}
      <td className="px-5 py-3">
        <StatusBadge status={withdrawal.status} />
      </td>

      {/* Action Buttons */}
      <td className="px-5 py-3">
        {withdrawal.status === "pending" ? (
          <div className="flex gap-2">
            <Button
              size="sm"
              variant={isDark ? "outline" : "secondary"}
              className="rounded-full px-3"
              onClick={() => onView(withdrawal.id)}
            >
              View
            </Button>
            <Button size="sm" className="bg-green-600 text-white" onClick={() => onApprove(withdrawal.id)}>
              Approve
            </Button>
            <Button size="sm" className="bg-red-600 text-white" onClick={() => onReject(withdrawal.id)}>
              Reject
            </Button>
          </div>
        ) : (
          <span className={`text-xs italic ${isDark ? "text-gray-400" : "text-gray-500"}`}>
            Action Taken
          </span>
        )}
      </td>
    </tr>
  );
}
