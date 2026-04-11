// client/src/features/nutrition/components/DailySummaryCard.jsx

import ProgressBar from "./ProgressBar";

export default function DailySummaryCard({ summary }) {
  const intake = summary?.intake || {};
  const targets = summary?.targets || {};
  const percentages = summary?.percentages || {};

  const macros = [
    {
      label: "Calories",
      emoji: "🔥",
      value: intake.calories || 0,
      target: targets.tdeeCalories || 0,
      percent: percentages.calories || 0,
      unit: "",
      color: "#F97316",
    },
    {
      label: "Protein",
      emoji: "💪",
      value: intake.proteinG || 0,
      target: targets.proteinG || 0,
      percent: percentages.protein || 0,
      unit: "g",
      color: "#8B5CF6",
    },
    {
      label: "Carbs",
      emoji: "🍞",
      value: intake.carbsG || 0,
      target: targets.carbsG || 0,
      percent: percentages.carbs || 0,
      unit: "g",
      color: "#3B82F6",
    },
    {
      label: "Fat",
      emoji: "🥑",
      value: intake.fatG || 0,
      target: targets.fatG || 0,
      percent: percentages.fat || 0,
      unit: "g",
      color: "#10B981",
    },
  ];

  return (
    <div style={styles.card}>
      <div style={styles.cardHeader}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={styles.iconBox}>
            <svg viewBox="0 0 24 24" fill="white" style={{ width: 16, height: 16 }}>
              <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6h-6z" />
            </svg>
          </div>
          <div>
            <h2 style={styles.cardTitle}>Daily Summary</h2>
            <p style={styles.cardSub}>Today's intake vs your targets.</p>
          </div>
        </div>

        {/* Overall progress ring text */}
        <div style={styles.overallBadge}>
          <span style={styles.overallPct}>{percentages.calories || 0}%</span>
          <span style={styles.overallLabel}>of daily goal</span>
        </div>
      </div>

      <div>
        {macros.map((macro) => (
          <ProgressBar
            key={macro.label}
            label={macro.label}
            emoji={macro.emoji}
            value={macro.value}
            target={macro.target}
            percent={macro.percent}
            unit={macro.unit}
            color={macro.color}
          />
        ))}
      </div>
    </div>
  );
}

const styles = {
  card: {
    background: "white",
    borderRadius: 20,
    border: "1px solid #E7E5E4",
    padding: 24,
  },
  cardHeader: {
    marginBottom: 20,
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  iconBox: {
    width: 34,
    height: 34,
    background: "#F97316",
    borderRadius: 9,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  cardTitle: {
    fontFamily: "'Sora', 'Inter', sans-serif",
    fontSize: 15,
    fontWeight: 700,
    color: "#1C1917",
    margin: 0,
  },
  cardSub: {
    fontSize: 12,
    color: "#78716C",
    marginTop: 2,
  },
  overallBadge: {
    background: "#FFF7ED",
    border: "1px solid #FFEDD5",
    borderRadius: 10,
    padding: "8px 14px",
    textAlign: "center",
  },
  overallPct: {
    display: "block",
    fontFamily: "'Sora', 'Inter', sans-serif",
    fontSize: 18,
    fontWeight: 700,
    color: "#F97316",
  },
  overallLabel: {
    fontSize: 10,
    color: "#A8A29E",
    fontWeight: 600,
  },
};