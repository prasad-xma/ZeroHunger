// client/src/features/nutrition/pages/NutritionDashboard.jsx

import { useEffect, useState } from "react";
import {
  getMyTargets,
  getTodaySummary,
  getWeeklySummary,
} from "../services/nutritionService";

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
      }

      if (todayRes.status === "fulfilled") {
        setTodaySummary(todayRes.value?.data || null);
      }

      if (weeklyRes.status === "fulfilled") {
        setWeeklySummary(weeklyRes.value?.data || []);
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
        <div className="mx-auto max-w-6xl rounded-2xl bg-white p-8 shadow-lg">
          <p className="text-lg font-semibold text-gray-700">Loading nutrition dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-100 via-orange-50 to-white px-4 py-10">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="rounded-2xl bg-white p-6 shadow-lg">
          <h1 className="text-3xl font-bold text-gray-800">Nutrition Dashboard</h1>
          <p className="mt-2 text-sm text-gray-600">
            Track your targets, daily intake, and weekly nutrition progress.
          </p>
        </div>

        {error ? (
          <div className="rounded-2xl bg-red-50 p-4 shadow-lg">
            <p className="text-sm font-medium text-red-600">{error}</p>
          </div>
        ) : null}

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          <div className="rounded-2xl bg-white p-6 shadow-lg">
            <h2 className="text-xl font-semibold text-gray-800">Latest Targets</h2>
            {targets ? (
              <div className="mt-4 space-y-2 text-sm text-gray-600">
                <p>
                  <span className="font-medium text-gray-800">Calories:</span>{" "}
                  {targets?.results?.tdeeCalories ?? 0}
                </p>
                <p>
                  <span className="font-medium text-gray-800">Protein:</span>{" "}
                  {targets?.results?.proteinG ?? 0} g
                </p>
                <p>
                  <span className="font-medium text-gray-800">Carbs:</span>{" "}
                  {targets?.results?.carbsG ?? 0} g
                </p>
                <p>
                  <span className="font-medium text-gray-800">Fat:</span>{" "}
                  {targets?.results?.fatG ?? 0} g
                </p>
              </div>
            ) : (
              <p className="mt-4 text-sm text-gray-500">No targets found yet.</p>
            )}
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-lg">
            <h2 className="text-xl font-semibold text-gray-800">Today Summary</h2>
            {todaySummary ? (
              <div className="mt-4 space-y-2 text-sm text-gray-600">
                <p>
                  <span className="font-medium text-gray-800">Calories:</span>{" "}
                  {todaySummary?.intake?.calories ?? 0}
                </p>
                <p>
                  <span className="font-medium text-gray-800">Protein:</span>{" "}
                  {todaySummary?.intake?.proteinG ?? 0} g
                </p>
                <p>
                  <span className="font-medium text-gray-800">Carbs:</span>{" "}
                  {todaySummary?.intake?.carbsG ?? 0} g
                </p>
                <p>
                  <span className="font-medium text-gray-800">Fat:</span>{" "}
                  {todaySummary?.intake?.fatG ?? 0} g
                </p>
              </div>
            ) : (
              <p className="mt-4 text-sm text-gray-500">No summary available.</p>
            )}
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-lg">
            <h2 className="text-xl font-semibold text-gray-800">Weekly Overview</h2>
            {weeklySummary.length > 0 ? (
              <div className="mt-4 space-y-2 text-sm text-gray-600">
                {weeklySummary.map((item) => (
                  <div
                    key={item.dateKey}
                    className="flex items-center justify-between rounded-xl bg-orange-50 px-3 py-2"
                  >
                    <span className="font-medium text-gray-700">{item.dateKey}</span>
                    <span className="text-gray-600">{item.calories} kcal</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-4 text-sm text-gray-500">No weekly data available.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}