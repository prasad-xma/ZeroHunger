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
  const [activeNav, setActiveNav] = useState("dashboard");

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
      ) {
        setError("Failed to load nutrition dashboard");
      }
    } catch (err) {
      setError(err.message || "Failed to load nutrition dashboard");
    } finally {
      setLoading(false);
    }
  }

  const navItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: 18, height: 18 }}>
          <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" />
        </svg>
      ),
    },
    {
      id: "search",
      label: "Food Search",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 18, height: 18 }}>
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
      ),
    },
    {
      id: "targets",
      label: "My Targets",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 18, height: 18 }}>
          <path d="M9 11l3 3L22 4" />
          <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
        </svg>
      ),
    },
    {
      id: "weekly",
      label: "Weekly Report",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 18, height: 18 }}>
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
        </svg>
      ),
    },
    {
      id: "settings",
      label: "Settings",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 18, height: 18 }}>
          <circle cx="12" cy="12" r="3" />
          <path d="M19.07 4.93a10 10 0 010 14.14M4.93 4.93a10 10 0 000 14.14" />
        </svg>
      ),
    },
  ];

  const intake = todaySummary?.intake || {};
  const tgt = todaySummary?.targets || {};
  const pct = todaySummary?.percentages || {};

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });

  if (loading) {
    return (
      <div style={styles.page}>
        <aside style={styles.sidebar}>
          <div style={styles.sidebarLogo}>
            <div style={styles.logoIcon}>
              <svg viewBox="0 0 24 24" fill="white" style={{ width: 20, height: 20 }}>
                <path d="M18.06 22.99h1.66c.84 0 1.53-.64 1.63-1.46L23 5.05h-5V1h-1.97v4.05h-4.97l.3 2.34c1.71.47 3.31 1.32 4.27 2.26 1.44 1.42 2.43 2.89 2.43 5.29v8.05zM1 21.99V21h15.03v.99c0 .55-.45 1-1.01 1H2.01c-.56 0-1.01-.45-1.01-1zm15.03-7c0-8-15.03-8-15.03 0h15.03zM1.02 17h15v2h-15z" />
              </svg>
            </div>
            <span style={styles.logoText}>
              Nutri<span style={{ color: "#F97316" }}>Track</span>
            </span>
          </div>

          {navItems.map((item) => (
            <div
              key={item.id}
              style={{
                ...styles.navItem,
                ...(activeNav === item.id ? styles.navItemActive : {}),
              }}
              onClick={() => setActiveNav(item.id)}
            >
              {item.icon}
              {item.label}
            </div>
          ))}

          <div style={styles.sidebarFooter}>
            <div style={styles.avatarCircle}>R</div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "white" }}>Ramzy</div>
              <div style={{ fontSize: 11, color: "#78716C" }}>Member</div>
            </div>
          </div>
        </aside>
        <main style={{ ...styles.main, alignItems: "center", justifyContent: "center" }}>
          <div style={styles.loadingBox}>
            <div style={styles.loadingSpinner} />
            <p style={{ marginTop: 16, color: "#78716C", fontWeight: 500 }}>Loading your nutrition data...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <aside style={styles.sidebar}>
        <div style={styles.sidebarLogo}>
          <div style={styles.logoIcon}>
            <svg viewBox="0 0 24 24" fill="white" style={{ width: 20, height: 20 }}>
              <path d="M18.06 22.99h1.66c.84 0 1.53-.64 1.63-1.46L23 5.05h-5V1h-1.97v4.05h-4.97l.3 2.34c1.71.47 3.31 1.32 4.27 2.26 1.44 1.42 2.43 2.89 2.43 5.29v8.05zM1 21.99V21h15.03v.99c0 .55-.45 1-1.01 1H2.01c-.56 0-1.01-.45-1.01-1zm15.03-7c0-8-15.03-8-15.03 0h15.03zM1.02 17h15v2h-15z" />
            </svg>
          </div>
          <span style={styles.logoText}>
            Nutri<span style={{ color: "#F97316" }}>Track</span>
          </span>
        </div>

        {navItems.map((item) => (
          <div
            key={item.id}
            style={{
              ...styles.navItem,
              ...(activeNav === item.id ? styles.navItemActive : {}),
            }}
            onClick={() => setActiveNav(item.id)}
          >
            {item.icon}
            {item.label}
          </div>
        ))}

        <div style={styles.sidebarFooter}>
          <div style={styles.avatarCircle}>R</div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: "white" }}>Ramzy</div>
            <div style={{ fontSize: 11, color: "#78716C" }}>Member</div>
          </div>
        </div>
      </aside>

      <main style={styles.main}>
        {/* Topbar */}
        <div style={styles.topbar}>
          <div>
            <h1 style={styles.pageTitle}>
              Nutrition <span style={{ color: "#F97316" }}>Dashboard</span>
            </h1>
            <p style={styles.pageSub}>Track your intake, calculate nutrition, and manage your goals.</p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={styles.dateChip}>
              <svg viewBox="0 0 24 24" fill="none" stroke="#F97316" strokeWidth="2" style={{ width: 14, height: 14 }}>
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              {today}
            </div>
          </div>
        </div>

        {/* Hero Banner */}
        <div style={styles.heroBanner}>
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: "white", margin: 0 }}>
              Good morning, Ramzy! 👋
            </h2>
            <p style={{ fontSize: 13, color: "#A8A29E", marginTop: 6, maxWidth: 340, lineHeight: 1.6 }}>
              Stay consistent with your targets. You're doing great — keep the momentum going today.
            </p>
            <div style={styles.heroStats}>
              <div style={styles.heroStat}>
                <div style={styles.heroStatVal}>{tgt.tdeeCalories || "—"}</div>
                <div style={styles.heroStatLabel}>Target kcal</div>
              </div>
              <div style={styles.heroStat}>
                <div style={styles.heroStatVal}>{pct.calories || 0}%</div>
                <div style={styles.heroStatLabel}>Daily progress</div>
              </div>
              <div style={styles.heroStat}>
                <div style={styles.heroStatVal}>{tgt.proteinG || "—"}g</div>
                <div style={styles.heroStatLabel}>Protein target</div>
              </div>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 10, zIndex: 1 }}>
            <div style={styles.streakBadge}>
              <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: 16, height: 16 }}>
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
              </svg>
              On Track Today!
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              {[
                { color: "#8B5CF6", label: `P: ${intake.proteinG || 0}g` },
                { color: "#3B82F6", label: `C: ${intake.carbsG || 0}g` },
                { color: "#10B981", label: `F: ${intake.fatG || 0}g` },
              ].map((m) => (
                <div key={m.label} style={styles.macroPill}>
                  <div style={{ width: 7, height: 7, borderRadius: "50%", background: m.color }} />
                  {m.label}
                </div>
              ))}
            </div>
          </div>
        </div>

        {error && (
          <div style={styles.errorBanner}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 16, height: 16, flexShrink: 0 }}>
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            {error}
          </div>
        )}

        {/* Row 1: Targets + Daily Summary */}
        <div style={styles.grid2}>
          <TargetForm existingTargets={targets} onSaved={loadDashboard} />
          <DailySummaryCard summary={todaySummary} />
        </div>

        {/* Row 2: Food Search + Intake/Remaining */}
        <div style={styles.grid23}>
          <FoodSearchCard onIntakeAdded={loadDashboard} />
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <IntakeListCard summary={todaySummary} />
          </div>
        </div>

        {/* Row 3: Weekly Summary */}
        <WeeklySummaryCard weeklySummary={weeklySummary} />
      </main>
    </div>
  );
}

const styles = {
  page: {
    display: "grid",
    gridTemplateColumns: "240px 1fr",
    minHeight: "100vh",
    fontFamily: "'DM Sans', 'Inter', sans-serif",
    background: "#FFF7ED",
  },
  sidebar: {
    background: "#1C1917",
    padding: "24px 16px",
    display: "flex",
    flexDirection: "column",
    gap: 6,
    position: "sticky",
    top: 0,
    height: "100vh",
    overflowY: "auto",
  },
  sidebarLogo: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "8px 12px",
    marginBottom: 16,
  },
  logoIcon: {
    width: 36,
    height: 36,
    background: "#F97316",
    borderRadius: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  logoText: {
    fontFamily: "'Sora', 'Inter', sans-serif",
    fontSize: 16,
    fontWeight: 700,
    color: "white",
  },
  navItem: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "11px 14px",
    borderRadius: 10,
    cursor: "pointer",
    color: "#A8A29E",
    fontSize: 14,
    fontWeight: 500,
    transition: "background 0.15s",
  },
  navItemActive: {
    background: "#F97316",
    color: "white",
  },
  sidebarFooter: {
    marginTop: "auto",
    padding: 12,
    background: "rgba(255,255,255,0.05)",
    borderRadius: 10,
    display: "flex",
    alignItems: "center",
    gap: 10,
  },
  avatarCircle: {
    width: 36,
    height: 36,
    borderRadius: "50%",
    background: "#F97316",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "'Sora', sans-serif",
    fontWeight: 700,
    fontSize: 13,
    color: "white",
    flexShrink: 0,
  },
  main: {
    padding: 28,
    display: "flex",
    flexDirection: "column",
    gap: 24,
    overflowY: "auto",
  },
  topbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  pageTitle: {
    fontFamily: "'Sora', 'Inter', sans-serif",
    fontSize: 26,
    fontWeight: 700,
    color: "#1C1917",
    margin: 0,
  },
  pageSub: {
    fontSize: 13,
    color: "#78716C",
    marginTop: 3,
  },
  dateChip: {
    background: "white",
    border: "1px solid #E7E5E4",
    borderRadius: 10,
    padding: "8px 14px",
    fontSize: 13,
    color: "#78716C",
    display: "flex",
    alignItems: "center",
    gap: 6,
  },
  heroBanner: {
    background: "linear-gradient(135deg,#1C1917 0%,#292524 60%,#44403C 100%)",
    borderRadius: 20,
    padding: "28px 32px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    overflow: "hidden",
    position: "relative",
  },
  heroStats: {
    display: "flex",
    gap: 16,
    marginTop: 18,
  },
  heroStat: {
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 12,
    padding: "12px 18px",
    textAlign: "center",
  },
  heroStatVal: {
    fontFamily: "'Sora', 'Inter', sans-serif",
    fontSize: 20,
    fontWeight: 700,
    color: "#F97316",
  },
  heroStatLabel: {
    fontSize: 11,
    color: "#78716C",
    marginTop: 2,
  },
  streakBadge: {
    background: "#F97316",
    color: "white",
    borderRadius: 14,
    padding: "10px 18px",
    fontFamily: "'Sora', 'Inter', sans-serif",
    fontSize: 13,
    fontWeight: 700,
    display: "flex",
    alignItems: "center",
    gap: 7,
  },
  macroPill: {
    background: "rgba(255,255,255,0.08)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 8,
    padding: "6px 12px",
    fontSize: 12,
    color: "#D6D3D1",
    display: "flex",
    alignItems: "center",
    gap: 5,
  },
  errorBanner: {
    background: "#FEF2F2",
    border: "1px solid #FECACA",
    borderRadius: 12,
    padding: "12px 16px",
    color: "#DC2626",
    fontSize: 13,
    fontWeight: 600,
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  grid2: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 20,
  },
  grid23: {
    display: "grid",
    gridTemplateColumns: "2fr 1fr",
    gap: 20,
  },
  loadingBox: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    background: "white",
    borderRadius: 20,
    padding: 48,
    border: "1px solid #E7E5E4",
  },
  loadingSpinner: {
    width: 36,
    height: 36,
    border: "3px solid #FFEDD5",
    borderTop: "3px solid #F97316",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
  },
};