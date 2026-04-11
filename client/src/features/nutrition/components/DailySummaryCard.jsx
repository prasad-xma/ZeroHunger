// client/src/features/nutrition/components/DailySummaryCard.jsx

import ProgressBar from "./ProgressBar";

export default function DailySummaryCard({ summary }) {
  const intake = summary?.intake || {};
  const targets = summary?.targets || {};
  const percentages = summary?.percentages || {};

  const macros = [
    { label: "Calories", emoji: "🔥", value: intake.calories || 0, target: targets.tdeeCalories || 0, percent: percentages.calories || 0, unit: "", color: "#F97316" },
    { label: "Protein", emoji: "💪", value: intake.proteinG || 0, target: targets.proteinG || 0, percent: percentages.protein || 0, unit: "g", color: "#8B5CF6" },
    { label: "Carbs", emoji: "🍞", value: intake.carbsG || 0, target: targets.carbsG || 0, percent: percentages.carbs || 0, unit: "g", color: "#3B82F6" },
    { label: "Fat", emoji: "🥑", value: intake.fatG || 0, target: targets.fatG || 0, percent: percentages.fat || 0, unit: "g", color: "#10B981" },
  ];

  const overallPct = percentages.calories || 0;
  const statusText = overallPct >= 90 ? "Goal Met! 🎉" : overallPct >= 60 ? "On Track 👍" : "Keep Going 💪";
  const statusColor = overallPct >= 90 ? "#16A34A" : overallPct >= 60 ? "#F97316" : "#78716C";
  const statusBg = overallPct >= 90 ? "#DCFCE7" : overallPct >= 60 ? "#FFF0E0" : "#F5F5F4";

  return (
    <div style={S.card}>
      <div style={S.header}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={S.iconBox}>
            <svg viewBox="0 0 24 24" fill="white" width="16" height="16">
              <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6h-6z" />
            </svg>
          </div>
          <div>
            <h2 style={S.title}>Daily Summary</h2>
            <p style={S.sub}>Today's intake vs targets.</p>
          </div>
        </div>
        <span style={{ ...S.badge, background: statusBg, color: statusColor }}>{statusText}</span>
      </div>

      {/* Big calorie ring-style display */}
      <div style={S.calorieRow}>
        <div style={S.calorieBox}>
          <div style={S.calorieVal}>{intake.calories || 0}</div>
          <div style={S.calorieLabel}>eaten today</div>
        </div>
        <div style={S.calorieBar}>
          <div style={{ height: "100%", background: "#F5EDE0", borderRadius: 99, overflow: "hidden", flex: 1 }}>
            <div style={{
              height: "100%",
              width: `${Math.min(overallPct, 100)}%`,
              background: "linear-gradient(90deg,#F97316,#EA580C)",
              borderRadius: 99,
              transition: "width 0.5s ease",
            }} />
          </div>
          <span style={{ fontSize: 13, fontWeight: 800, color: "#F97316", whiteSpace: "nowrap" }}>
            {overallPct}% of {targets.tdeeCalories || 0} kcal
          </span>
        </div>
      </div>

      <div style={S.divider} />

      {macros.map((m) => (
        <ProgressBar
          key={m.label}
          label={m.label}
          emoji={m.emoji}
          value={m.value}
          target={m.target}
          percent={m.percent}
          unit={m.unit}
          color={m.color}
        />
      ))}
    </div>
  );
}

const S = {
  card: {
    background: "white",
    borderRadius: 18,
    border: "1px solid #F5E6D0",
    padding: "20px 20px 16px",
    boxShadow: "0 2px 8px rgba(249,115,22,0.05)",
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  iconBox: {
    width: 36,
    height: 36,
    background: "#F97316",
    borderRadius: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    boxShadow: "0 3px 8px rgba(249,115,22,0.3)",
  },
  title: {
    fontFamily: "'Sora', sans-serif",
    fontSize: 15,
    fontWeight: 700,
    color: "#1C1917",
    margin: 0,
  },
  sub: {
    fontSize: 11,
    color: "#A8A29E",
    marginTop: 2,
  },
  badge: {
    fontSize: 11,
    fontWeight: 700,
    borderRadius: 20,
    padding: "3px 10px",
  },
  calorieRow: {
    display: "flex",
    alignItems: "center",
    gap: 14,
    marginBottom: 14,
  },
  calorieBox: {
    background: "#FFF0E0",
    borderRadius: 12,
    padding: "10px 14px",
    textAlign: "center",
    flexShrink: 0,
  },
  calorieVal: {
    fontFamily: "'Sora', sans-serif",
    fontSize: 24,
    fontWeight: 800,
    color: "#F97316",
    lineHeight: 1.1,
  },
  calorieLabel: {
    fontSize: 10,
    color: "#EA580C",
    marginTop: 2,
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  },
  calorieBar: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: 6,
  },
  divider: {
    height: 1,
    background: "#F5EDE0",
    margin: "0 0 16px",
  },
};