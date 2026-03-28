import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { subscriptionStats } from "./SubscriptionPlansData";
import SubscriptionCard from "@/components/subscription-plans/SubscriptionCard";
import SubscriberTable from "@/components/subscription-plans/SubscriberTable";
import CreateSubscriptionPlanModal from "../../components/subscription-plans/SubscriptionPlanModal";
import GlobalApi from "@/lib/GlobalApi";
import { toast } from "sonner";

export default function SubscriptionPlans({ theme }) {
  const isDark = theme === "dark";
  const [plans, setPlans] = useState([]);
  const [activeTab, setActiveTab] = useState("Everyone");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);

  
  useEffect(() => {
    fetchPlans(activeTab);
  }, [activeTab]);

  const TAB_TARGET_TYPE = {
    Everyone: "everyone",
    Artists: "artist",
    Labels: "label",
  };

  const fetchPlans = async (tab = activeTab) => {
    if (tab === "Subscribers") return;
    try {
      const targetType = TAB_TARGET_TYPE[tab] || null;
      const res = await GlobalApi.getSubscriptionPlans(true, targetType);
      if (res.data?.data?.plans) {
        const normalized = res.data.data.plans.map((p) => ({
          ...p,
          id: p.id ?? p._id,
        }));
        setPlans(normalized);
      }
    } catch (err) {
      console.error("Failed to fetch plans:", err);
      toast.error("Failed to load subscription plans");
    }
  };

 
  const handleDelete = async (planId) => {
    try {
      await GlobalApi.deletePlan(planId);
      setPlans((prev) => prev.filter((p) => p.planId !== planId));
      toast.success(`Deleted plan successfully`);
    } catch (err) {
      console.error("Delete failed:", err);
      toast.error(
        err.response?.data?.message || "Failed to delete the subscription plan"
      );
    }
  };

  
  const handleToggle = async (planId, value) => {
    try {
      if (value) {
        await GlobalApi.activatePlan(planId);
      } else {
        await GlobalApi.deactivatePlan(planId);
      }

      setPlans((prev) =>
        prev.map((p) =>
          p.planId === planId ? { ...p, active: value, isActive: value } : p
        )
      );

      toast.success(`Plan ${value ? "activated" : "deactivated"} successfully`);
    } catch (err) {
      console.error("Toggle failed:", err);
      toast.error("Failed to update plan status");
    }
  };


  
  const openCreateModal = () => {
    setSelectedPlan(null);
    setIsModalOpen(true);
  };

  const openEditModal = (plan) => {
    setSelectedPlan(plan);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedPlan(null);
    fetchPlans(activeTab);
  };

  return (
    <div
      className={`p-4 md:p-6 space-y-6 ${
        isDark
          ? "bg-[#111A22] text-gray-200"
          : "bg-gray-50 text-[#151F28]"
      }`}
    >
      
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Subscription Plans</h1>
          <p
            className={`${
              isDark ? "text-gray-400" : "text-gray-600"
            } text-sm`}
          >
            Manage pricing tiers and subscription offerings
          </p>
        </div>
        <Button
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 flex items-center gap-2"
          onClick={openCreateModal}
        >
          <Plus className="h-4 w-4" /> Create New Plan
        </Button>
      </div>

     
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {subscriptionStats.map((stat, i) => (
          <div
            key={i}
            className={`rounded-lg p-4 shadow-md ${
              isDark ? "bg-[#151F28]" : "bg-white"
            }`}
          >
            <p className="text-sm">{stat.label}</p>
            <p className="text-2xl font-semibold">{stat.value}</p>
            <p
              className={`text-xs mt-1 ${
                stat.subtext.includes("+")
                  ? "text-green-400"
                  : "text-red-400"
              }`}
            >
              {stat.subtext}
            </p>
          </div>
        ))}
      </div>

      
      <div
        className={`flex items-center rounded-lg overflow-hidden ${
          isDark ? "bg-[#151F28]" : "bg-gray-200"
        }`}
      >
        {["Everyone", "Artists", "Labels", "Subscribers"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2 text-sm font-medium transition-colors ${
              activeTab === tab
                ? "bg-purple-600 text-white"
                : isDark
                ? "text-gray-300 hover:bg-gray-800"
                : "text-gray-700 hover:bg-gray-300"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      
      {activeTab === "Subscribers" ? (
        <SubscriberTable isDark={isDark} />
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
          {plans.map((plan) => (
            <div key={plan.id} className="max-w-sm w-full">
              <SubscriptionCard
                plan={plan}
                isDark={isDark}
                handleDelete={handleDelete}
                handleToggle={handleToggle}
                handleEdit={openEditModal}
              />
            </div>
          ))}
        </div>
      )}

      
      <CreateSubscriptionPlanModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        theme={theme}
        planData={selectedPlan}
        categories={[
          { id: 1, name: "Everyone" },
          { id: 2, name: "Artists" },
          { id: 3, name: "Labels" },
          { id: 4, name: "Subscribers" },
        ]}
      />
    </div>
  );
}
