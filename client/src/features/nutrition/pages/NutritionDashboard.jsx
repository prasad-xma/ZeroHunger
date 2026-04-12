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

  useEffect(() => { loadDashboard(); }, []);

  async function loadDashboard() {
    try {
      setLoading(true);
      setError("");
      const [targetsRes, todayRes, weeklyRes] = await Promise.allSettled([
        getMyTargets(), getTodaySummary(), getWeeklySummary(),
      ]);
      if (targetsRes.status === "fulfilled") setTargets(targetsRes.value?.data || null);
      else setTargets(null);
      if (todayRes.status === "fulfilled") setTodaySummary(todayRes.value?.data || null);
      else setTodaySummary(null);
      if (weeklyRes.status === "fulfilled") setWeeklySummary(weeklyRes.value?.data || []);
      else setWeeklySummary([]);
      if (
        targetsRes.status === "rejected" &&
        todayRes.status === "rejected" &&
        weeklyRes.status === "rejected"
      )
        setError("Failed to load nutrition dashboard");
    } catch (err) {
      setError(err.message || "Failed to load nutrition dashboard");
    } finally {
      setLoading(false);
    }
  }

  const intake = todaySummary?.intake || {};
  const tgt = todaySummary?.targets || {};
  const pct = todaySummary?.percentages || {};

  const statCards = [
    {
      emoji: "🍽️",
      label: "Daily Calories",
      value: intake.calories || 0,
      sub: `Goal: ${tgt.tdeeCalories || 2000}`,
      subIcon: "🎯",
      badge: "On Target",
      badgeBg: "#DCFCE7",
      badgeColor: "#16A34A",
      trend: `+${pct.calories || 0}% of goal`,
    },
    {
      emoji: "🔥",
      label: "Avg Calories/Meal",
      value: intake.calories ? Math.round(intake.calories / 3) : 0,
      sub: "Optimal range",
      subIcon: "📈",
      badge: "Healthy",
      badgeBg: "#DCFCE7",
      badgeColor: "#16A34A",
      trend: "↑ On track",
    },
    {
      emoji: "💪",
      label: "Protein Today",
      value: `${intake.proteinG || 0}g`,
      sub: `Target: ${tgt.proteinG || 0}g`,
      subIcon: "🎯",
      badge: `+${pct.protein || 0}%`,
      badgeBg: "#FFF0E0",
      badgeColor: "#EA580C",
      trend: "↑ Great progress!",
    },
    {
      emoji: "📊",
      label: "Goal Progress",
      value: `${pct.calories || 0}%`,
      sub: "Great progress!",
      subIcon: "🏆",
      badge: `+5%`,
      badgeBg: "#FFF0E0",
      badgeColor: "#EA580C",
      trend: "↑ Keep it up",
    },
  ];

  if (loading) {
    return (
      <div style={S.loadingWrap}>
        <div style={S.spinner} />
        <p style={{ color: "#A8A29E", marginTop: 14, fontWeight: 500 }}>
          Loading your dashboard...
        </p>
      </div>
    );
  }

  return (
    <div style={S.page}>
      <main style={S.main}>
        {/* Stat cards */}
        <div style={S.statRow}>
          {statCards.map((c) => (
            <div key={c.label} style={S.statCard}>
              <div style={S.statCardTop}>
                <div style={S.statEmoji}>{c.emoji}</div>
                <span style={{ ...S.badge, background: c.badgeBg, color: c.badgeColor }}>
                  {c.badge}
                </span>
              </div>
              <div style={S.statValue}>{c.value}</div>
              <div style={S.statLabel}>{c.label}</div>
              <div style={S.statMeta}>
                <span style={{ marginRight: 4 }}>{c.subIcon}</span>{c.sub}
              </div>
              <div style={S.statTrend}>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#F97316"
                  strokeWidth="2.5"
                  width="11"
                  height="11"
                >
                  <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
                </svg>
                {c.trend}
              </div>
            </div>
          ))}
        </div>

        {error && <div style={S.errBox}>{error}</div>}

        {/* Two-column content */}
        <div style={S.contentRow}>
          <div style={{ display: "flex", flexDirection: "column", gap: 20, flex: "1.3" }}>
            <FoodSearchCard onIntakeAdded={loadDashboard} />
            <WeeklySummaryCard weeklySummary={weeklySummary} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 20, flex: "1" }}>
            <TargetForm existingTargets={targets} onSaved={loadDashboard} />
            <DailySummaryCard summary={todaySummary} />
            <IntakeListCard summary={todaySummary} />
          </div>
        </div>
      </main>
    </div>
  );
}

const S = {
  page: {
    display: "flex",
    minHeight: "100vh",
    background: "#FEF9F0",
    fontFamily: "'DM Sans', 'Nunito', system-ui, sans-serif",
  },
  loadingWrap: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    background: "#FEF9F0",
    fontFamily: "'DM Sans', system-ui, sans-serif",
  },
  main: {
    flex: 1,
    padding: "24px 24px 32px",
    display: "flex",
    flexDirection: "column",
    gap: 20,
    overflowY: "auto",
  },
  statRow: {
    display: "grid",
    gridTemplateColumns: "repeat(4,1fr)",
    gap: 16,
  },
  statCard: {
    background: "white",
    borderRadius: 18,
    padding: "18px 18px 14px",
    border: "1px solid #F5E6D0",
    boxShadow: "0 2px 8px rgba(249,115,22,0.05)",
  },
  statCardTop: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  statEmoji: {
    width: 40,
    height: 40,
    background: "#FFF0E0",
    borderRadius: 11,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 18,
  },
  badge: {
    fontSize: 11,
    fontWeight: 700,
    borderRadius: 20,
    padding: "3px 10px",
  },
  statValue: {
    fontFamily: "'Sora', 'DM Sans', sans-serif",
    fontSize: 30,
    fontWeight: 800,
    color: "#1C1917",
    lineHeight: 1.1,
  },
  statLabel: {
    fontSize: 13,
    color: "#78716C",
    marginTop: 3,
    fontWeight: 500,
  },
  statMeta: {
    fontSize: 12,
    color: "#A8A29E",
    marginTop: 8,
    display: "flex",
    alignItems: "center",
  },
  statTrend: {
    fontSize: 11,
    color: "#F97316",
    marginTop: 4,
    display: "flex",
    alignItems: "center",
    gap: 4,
    fontWeight: 600,
  },
  contentRow: {
    display: "flex",
    gap: 20,
    alignItems: "flex-start",
  },
  errBox: {
    background: "#FEF2F2",
    border: "1px solid #FECACA",
    borderRadius: 12,
    padding: "12px 16px",
    color: "#DC2626",
    fontSize: 13,
    fontWeight: 600,
  },
  spinner: {
    width: 36,
    height: 36,
    border: "3px solid #FFEDD5",
    borderTop: "3px solid #F97316",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
    margin: "0 auto",
  },
};