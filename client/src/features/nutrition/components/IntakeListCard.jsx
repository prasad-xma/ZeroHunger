// client/src/features/nutrition/components/IntakeListCard.jsx

export default function IntakeListCard({ summary }) {
  const intake = summary?.intake || {};
  const targets = summary?.targets || {};

  const items = [
    { label: "Calories", value: intake.calories || 0, unit: "kcal", target: targets.tdeeCalories, color: "#F97316", bg: "#FFF0E0", emoji: "🔥", successRate: 75 },
    { label: "Protein", value: intake.proteinG || 0, unit: "g", target: targets.proteinG, color: "#8B5CF6", bg: "#F5F3FF", emoji: "💪", successRate: 85 },
    { label: "Carbs", value: intake.carbsG || 0, unit: "g", target: targets.carbsG, color: "#3B82F6", bg: "#EFF6FF", emoji: "🍞", successRate: 68 },
    { label: "Fat", value: intake.fatG || 0, unit: "g", target: targets.fatG, color: "#10B981", bg: "#ECFDF5", emoji: "🥑", successRate: 72 },
    { label: "Sugar", value: intake.sugarG || 0, unit: "g", color: "#F59E0B", bg: "#FFFBEB", emoji: "🍬", successRate: null },
    { label: "Sat Fat", value: intake.satFatG || 0, unit: "g", color: "#EF4444", bg: "#FEF2F2", emoji: "⚠️", successRate: null },
  ];

  return (
    <div style={S.card}>
      <div style={S.header}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={S.iconBox}>
            <svg viewBox="0 0 24 24" fill="white" width="16" height="16">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
            </svg>
          </div>
          <div>
            <h2 style={S.title}>Smart Meal Planning</h2>
            <p style={S.sub}>Today's intake totals.</p>
          </div>
        </div>
        <span style={S.proTag}>Pro Tip</span>
      </div>

      {items.filter((i) => i.target != null).map((item) => {
        const pct = item.target ? Math.min(Math.round((item.value / item.target) * 100), 100) : 0;
        return (
          <div key={item.label} style={S.row}>
            <div style={S.rowLeft}>
              <span style={{ fontSize: 16 }}>{item.emoji}</span>
              <div>
                <div style={S.rowLabel}>{item.label}</div>
                <div style={S.rowSub}>
                  {item.value}{item.unit} of {item.target}{item.unit} goal
                </div>
              </div>
            </div>
            <div style={S.rowRight}>
              <div style={{ display: "flex", flexDirection: "column", gap: 4, flex: 1, minWidth: 100 }}>
                <div style={{ ...S.miniTrack }}>
                  <div style={{
                    height: "100%",
                    width: `${pct}%`,
                    background: item.color,
                    borderRadius: 99,
                    transition: "width 0.4s ease",
                  }} />
                </div>
              </div>
              <span style={{ ...S.pctBadge, color: item.color, background: item.bg }}>
                {item.successRate != null ? `${item.successRate}% Effective` : `${pct}%`}
              </span>
            </div>
          </div>
        );
      })}

      {/* Extras */}
      <div style={S.divider} />
      <div style={{ display: "flex", gap: 10 }}>
        {items.filter((i) => !i.target).map((item) => (
          <div key={item.label} style={{ ...S.extraChip, background: item.bg }}>
            <span>{item.emoji}</span>
            <div>
              <div style={{ fontSize: 13, fontWeight: 800, color: item.color }}>{item.value}<span style={{ fontSize: 11, fontWeight: 400 }}>{item.unit}</span></div>
              <div style={{ fontSize: 10, color: "#A8A29E", fontWeight: 600, textTransform: "uppercase" }}>{item.label}</div>
            </div>
          </div>
        ))}
      </div>
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
    marginBottom: 18,
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
  proTag: {
    fontSize: 11,
    fontWeight: 700,
    background: "#FFF0E0",
    color: "#EA580C",
    borderRadius: 20,
    padding: "3px 10px",
  },
  row: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
    padding: "12px 14px",
    background: "#FAFAF9",
    borderRadius: 12,
    marginBottom: 9,
    border: "1px solid #F5EDE0",
  },
  rowLeft: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    flex: 1,
    minWidth: 0,
  },
  rowLabel: {
    fontSize: 13,
    fontWeight: 700,
    color: "#1C1917",
  },
  rowSub: {
    fontSize: 11,
    color: "#A8A29E",
    marginTop: 1,
  },
  rowRight: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    flexShrink: 0,
  },
  miniTrack: {
    height: 6,
    background: "#F5EDE0",
    borderRadius: 99,
    overflow: "hidden",
    width: 80,
  },
  pctBadge: {
    fontSize: 11,
    fontWeight: 700,
    borderRadius: 8,
    padding: "3px 9px",
    whiteSpace: "nowrap",
  },
  divider: {
    height: 1,
    background: "#F5EDE0",
    margin: "12px 0",
  },
  extraChip: {
    flex: 1,
    borderRadius: 12,
    padding: "10px 12px",
    display: "flex",
    alignItems: "center",
    gap: 8,
    border: "1px solid #F5EDE0",
  },
};