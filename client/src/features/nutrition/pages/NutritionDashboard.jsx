// client/src/features/nutrition/pages/NutritionDashboard.jsx

import { useEffect, useState } from "react";
import DailySummaryCard from "../components/DailySummaryCard";
import FoodSearchCard from "../components/FoodSearchCard";
import IntakeListCard from "../components/IntakeListCard";
import TargetForm from "../components/TargetForm";
import WeeklySummaryCard from "../components/WeeklySummaryCard";
import { getMyTargets, getTodaySummary, getWeeklySummary } from "../services/nutritionService";

export default function NutritionDashboard() {
  const [targets, setTargets] = useState(null);
  const [todaySummary, setTodaySummary] = useState(null);
  const [weeklySummary, setWeeklySummary] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    try {
      setLoading(true);
      setError("");

      const [targetsRes, todayRes, weeklyRes] = await Promise.allSettled([
        getMyTargets(),
        getTodaySummary(),
        getWeeklySummary(),
      ]);

      if (targetsRes.status === "fulfilled") {
        setTargets(targetsRes.value?.data || null);
      } else {
        setTargets(null);
      }

      if (todayRes.status === "fulfilled") {
        setTodaySummary(todayRes.value?.data || null);
      } else {
        setTodaySummary(null);
      }

      if (weeklyRes.status === "fulfilled") {
        setWeeklySummary(weeklyRes.value?.data || []);
      } else {
        setWeeklySummary([]);
      }

      if (
        targetsRes.status === "rejected" &&
        todayRes.status === "rejected" &&
        weeklyRes.status === "rejected"
      ) {
        setError("Failed to load nutrition dashboard");
      }
    } catch (err) {
      setError(err.message || "Failed to load nutrition dashboard");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-100 via-orange-50 to-white px-4 py-10">
        <div className="mx-auto max-w-7xl rounded-2xl bg-white p-8 shadow-lg">
          <p className="text-lg font-semibold text-gray-700">Loading nutrition dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-100 via-orange-50 to-white px-4 py-10">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="rounded-2xl bg-white p-6 shadow-lg">
          <h1 className="text-3xl font-bold text-gray-800">Nutrition Dashboard</h1>
          <p className="mt-2 text-sm text-gray-600">
            Manage your targets, calculate food nutrition, and track your daily intake.
          </p>
        </div>

        {error ? (
          <div className="rounded-2xl bg-red-50 p-4 shadow-lg">
            <p className="text-sm font-medium text-red-600">{error}</p>
          </div>
        ) : null}

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          <TargetForm existingTargets={targets} onSaved={loadDashboard} />
          <DailySummaryCard summary={todaySummary} />
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          <FoodSearchCard onIntakeAdded={loadDashboard} />
          <IntakeListCard summary={todaySummary} />
        </div>

        <WeeklySummaryCard weeklySummary={weeklySummary} />
      </div>
    </div>
  );
}