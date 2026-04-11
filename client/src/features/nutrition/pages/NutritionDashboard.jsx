// client/src/features/nutrition/pages/NutritionDashboard.jsx

import { useEffect, useState } from "react";
import DailySummaryCard from "../components/DailySummaryCard";
import FoodSearchCard from "../components/FoodSearchCard";
import IntakeListCard from "../components/IntakeListCard";
import TargetForm from "../components/TargetForm";
import WeeklySummaryCard from "../components/WeeklySummaryCard";
import { getMyTargets, getTodaySummary, getWeeklySummary } from "../services/nutritionService";

const NAV = [
  {
    id: "dashboard",
    label: "Meal Dashboard",
    sub: "Overview & Stats",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
        <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" />
      </svg>
    ),
  },
  {
    id: "health",
    label: "Health Dashboard",
    sub: "Health Metrics & Profiles",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
  },
  {
    id: "planner",
    label: "Weekly Meal Planner",
    sub: "Plan your weekly meals",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    ),
  },
  {
    id: "tracker",
    label: "Progress Tracker",
    sub: "Track goals & predictions",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
      </svg>
    ),
  },
  {
    id: "shopping",
    label: "Shopping Optimizer",
    sub: "Smart shopping lists",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
        <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
        <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 001.96-1.61L23 6H6" />
      </svg>
    ),
  },
  {
    id: "gallery",
    label: "Meal Gallery",
    sub: "Browse all meals",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
        <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
      </svg>
    ),
  },
];

function Sidebar({ activeNav, setActiveNav }) {
  return (
    <aside style={S.sidebar}>
      <div style={S.brand}>
        <div style={S.brandIcon}>
          <svg viewBox="0 0 24 24" fill="white" width="22" height="22">
            <path d="M18.06 22.99h1.66c.84 0 1.53-.64 1.63-1.46L23 5.05h-5V1h-1.97v4.05h-4.97l.3 2.34c1.71.47 3.31 1.32 4.27 2.26 1.44 1.42 2.43 2.89 2.43 5.29v8.05zM1 21.99V21h15.03v.99c0 .55-.45 1-1.01 1H2.01c-.56 0-1.01-.45-1.01-1zm15.03-7c0-8-15.03-8-15.03 0h15.03zM1.02 17h15v2h-15z" />
          </svg>
        </div>
        <div>
          <div style={S.brandName}>NutriTrack</div>
          <div style={S.brandSub}>Smart Meal Management</div>
        </div>
      </div>

      <div style={S.modeToggle}>
        <svg viewBox="0 0 24 24" fill="none" stroke="#A8A29E" strokeWidth="2" width="15" height="15">
          <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
        </svg>
      </div>

      <nav style={S.navList}>
        {NAV.map((item) => {
          const active = activeNav === item.id;
          return (
            <div
              key={item.id}
              style={{ ...S.navItem, ...(active ? S.navItemActive : {}) }}
              onClick={() => setActiveNav(item.id)}
            >
              <div style={{ ...S.navIconBox, ...(active ? S.navIconBoxActive : {}) }}>
                {item.icon}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ ...S.navLabel, ...(active ? { color: "#1C1917", fontWeight: 700 } : {}) }}>
                  {item.label}
                </div>
                <div style={S.navSub}>{item.sub}</div>
              </div>
              {active && <div style={S.activeDot} />}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}

export default function NutritionDashboard() {
  const [targets, setTargets] = useState(null);
  const [todaySummary, setTodaySummary] = useState(null);
  const [weeklySummary, setWeeklySummary] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeNav, setActiveNav] = useState("dashboard");

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
      if (targetsRes.status === "rejected" && todayRes.status === "rejected" && weeklyRes.status === "rejected")
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
      <div style={S.page}>
        <Sidebar activeNav={activeNav} setActiveNav={setActiveNav} />
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ textAlign: "center" }}>
            <div style={S.spinner} />
            <p style={{ color: "#A8A29E", marginTop: 14, fontWeight: 500 }}>Loading your dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={S.page}>
      <Sidebar activeNav={activeNav} setActiveNav={setActiveNav} />

      <main style={S.main}>
        {/* Stat cards */}
        <div style={S.statRow}>
          {statCards.map((c) => (
            <div key={c.label} style={S.statCard}>
              <div style={S.statCardTop}>
                <div style={S.statEmoji}>{c.emoji}</div>
                <span style={{ ...S.badge, background: c.badgeBg, color: c.badgeColor }}>{c.badge}</span>
              </div>
              <div style={S.statValue}>{c.value}</div>
              <div style={S.statLabel}>{c.label}</div>
              <div style={S.statMeta}>
                <span style={{ marginRight: 4 }}>{c.subIcon}</span>{c.sub}
              </div>
              <div style={S.statTrend}>
                <svg viewBox="0 0 24 24" fill="none" stroke="#F97316" strokeWidth="2.5" width="11" height="11">
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
  sidebar: {
    width: 250,
    minHeight: "100vh",
    background: "#FFFBF5",
    borderRight: "1.5px solid #F5E6D0",
    padding: "22px 14px",
    display: "flex",
    flexDirection: "column",
    flexShrink: 0,
    position: "sticky",
    top: 0,
    height: "100vh",
    overflowY: "auto",
  },
  brand: {
    display: "flex",
    alignItems: "center",
    gap: 11,
    padding: "0 6px",
    marginBottom: 6,
  },
  brandIcon: {
    width: 44,
    height: 44,
    background: "#F97316",
    borderRadius: 13,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    boxShadow: "0 4px 12px rgba(249,115,22,0.3)",
  },
  brandName: {
    fontFamily: "'Sora', 'DM Sans', sans-serif",
    fontSize: 17,
    fontWeight: 800,
    color: "#F97316",
    lineHeight: 1.2,
  },
  brandSub: {
    fontSize: 10,
    color: "#A8A29E",
    marginTop: 1,
  },
  modeToggle: {
    width: 30,
    height: 30,
    borderRadius: 8,
    border: "1px solid #F5E6D0",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    margin: "14px 6px 18px",
    background: "white",
  },
  navList: {
    display: "flex",
    flexDirection: "column",
    gap: 3,
  },
  navItem: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "9px 8px",
    borderRadius: 12,
    cursor: "pointer",
    position: "relative",
    transition: "background 0.12s",
  },
  navItemActive: {
    background: "#FFF0E0",
  },
  navIconBox: {
    width: 34,
    height: 34,
    borderRadius: 9,
    background: "#F5F5F4",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#A8A29E",
    flexShrink: 0,
  },
  navIconBoxActive: {
    background: "#F97316",
    color: "white",
    boxShadow: "0 2px 8px rgba(249,115,22,0.35)",
  },
  navLabel: {
    fontSize: 12.5,
    fontWeight: 600,
    color: "#78716C",
    lineHeight: 1.3,
  },
  navSub: {
    fontSize: 10.5,
    color: "#C4B5A0",
    marginTop: 1,
  },
  activeDot: {
    width: 7,
    height: 7,
    borderRadius: "50%",
    background: "#F97316",
    position: "absolute",
    right: 10,
    top: "50%",
    transform: "translateY(-50%)",
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