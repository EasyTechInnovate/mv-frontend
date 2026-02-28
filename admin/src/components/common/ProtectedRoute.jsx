import React from "react";
import { useAuth } from "@/context/AuthContext";
import { ShieldOff } from "lucide-react";

function AccessDenied({ moduleName, theme }) {
  const isDark = theme === "dark";
  return (
    <div
      className={`flex flex-col items-center justify-center h-full min-h-[60vh] gap-4 text-center px-6 ${
        isDark ? "text-gray-300" : "text-gray-600"
      }`}
    >
      <ShieldOff
        size={64}
        className="text-red-400 opacity-80"
      />
      <h2 className="text-2xl font-bold text-red-400">Access Denied</h2>
      <p className="text-sm max-w-sm opacity-70">
        You don't have permission to access{" "}
        <span className="font-semibold text-white">
          {moduleName || "this page"}
        </span>
        . Contact your administrator to request access.
      </p>
    </div>
  );
}

/**
 * ProtectedRoute — wraps a page component and checks moduleAccess.
 *
 * Props:
 *   requiredModule  – e.g. "User Management". If null/undefined, only auth is checked.
 *   theme           – forwarded for AccessDenied styling
 *   children        – the actual page element
 */
export default function ProtectedRoute({ requiredModule, theme, children }) {
  const { user, hasAccess } = useAuth();

  // Not logged in → redirect handled by App, just block render
  if (!user) return null;

  if (!hasAccess(requiredModule)) {
    return <AccessDenied moduleName={requiredModule} theme={theme} />;
  }

  return children;
}
