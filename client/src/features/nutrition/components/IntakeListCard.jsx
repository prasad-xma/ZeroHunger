// client/src/features/nutrition/components/IntakeListCard.jsx

export default function IntakeListCard({ summary }) {
  const intake = summary?.intake || {};
  const targets = summary?.targets || {};

  const macros = [
    {
      label: "Calories",
      value: intake.calories || 0,
      unit: "kcal",
      target: targets.tdeeCalories || 0,
      color: "#F97316",
      bg: "#FFF7ED",
      border: "#FFEDD5",
      highlight: true,
    },
    {
      label: "Protein",
      value: intake.proteinG || 0,
      unit: "g",
      target: targets.proteinG || 0,
      color: "#8B5CF6",
      bg: "#F5F3FF",
      border: "#EDE9FE",
    },
    {
      label: "Carbs",
      value: intake.carbsG || 0,
      unit: "g",
      target: targets.carbsG || 0,
      color: "#3B82F6",
      bg: "#EFF6FF",
      border: "#DBEAFE",
    },
    {
      label: "Fat",
      value: intake.fatG || 0,
      unit: "g",
      target: targets.fatG || 0,
      color: "#10B981",
      bg: "#ECFDF5",
      border: "#D1FAE5",
    },
    {
      label: "Sugar",
      value: intake.sugarG || 0,
      unit: "g",
      color: "#F59E0B",
      bg: "#FFFBEB",
      border: "#FEF3C7",
    },
    {
      label: "Sat Fat",
      value: intake.satFatG || 0,
      unit: "g",
      color: "#EF4444",
      bg: "#FEF2F2",
      border: "#FECACA",
    },
  ];

  return (
    <div style={styles.card}>
      <div style={styles.cardHeader}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={styles.iconBox}>
            <svg viewBox="0 0 24 24" fill="white" style={{ width: 16, height: 16 }}>
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
            </svg>
          </div>
          <div>
            <h2 style={styles.cardTitle}>Today's Intake</h2>
            <p style={styles.cardSub}>Current totals saved for today.</p>
          </div>
        </div>
      </div>

      <div style={styles.grid}>
        {macros.map((item) => (
          <div
            key={item.label}
            style={{
              ...styles.statBox,
              background: item.bg,
              border: `1px solid ${item.border}`,
            }}
          >
            <div style={{ ...styles.statLabel, color: item.color + "99" }}>{item.label}</div>
            <div style={{ ...styles.statVal, color: item.highlight ? item.color : "#1C1917" }}>
              {item.value}
              <span style={styles.statUnit}> {item.unit}</span>
            </div>
            {item.target ? (
              <div style={{ ...styles.statTarget, color: item.color + "80" }}>
                / {item.target} {item.unit}
              </div>
            ) : null}
          </div>
        ))}
      </div>

      {/* Remaining section */}
      <div style={styles.remainingHeader}>
        <svg viewBox="0 0 24 24" fill="none" stroke="#F97316" strokeWidth="2" style={{ width: 14, height: 14 }}>
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
        <span style={styles.remainingTitle}>Remaining Today</span>
      </div>

      {[
        {
          label: "Calories left",
          val: Math.max(0, (targets.tdeeCalories || 0) - (intake.calories || 0)),
          unit: "kcal",
          color: "#F97316",
        },
        {
          label: "Protein left",
          val: Math.max(0, (targets.proteinG || 0) - (intake.proteinG || 0)),
          unit: "g",
          color: "#8B5CF6",
        },
        {
          label: "Carbs left",
          val: Math.max(0, (targets.carbsG || 0) - (intake.carbsG || 0)),
          unit: "g",
          color: "#3B82F6",
        },
        {
          label: "Fat left",
          val: Math.max(0, (targets.fatG || 0) - (intake.fatG || 0)),
          unit: "g",
          color: "#10B981",
        },
      ].map((item) => (
        <div key={item.label} style={styles.remainingRow}>
          <span style={styles.remainingLabel}>{item.label}</span>
          <span style={{ ...styles.remainingVal, color: item.color }}>
            {item.val}
            <span style={styles.remainingUnit}> {item.unit}</span>
          </span>
        </div>
      ))}
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
    marginBottom: 16,
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
  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 10,
    marginBottom: 20,
  },
  statBox: {
    borderRadius: 12,
    padding: "12px 14px",
  },
  statLabel: {
    fontSize: 11,
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.06em",
    marginBottom: 3,
  },
  statVal: {
    fontFamily: "'Sora', 'Inter', sans-serif",
    fontSize: 20,
    fontWeight: 700,
  },
  statUnit: {
    fontSize: 12,
    fontWeight: 400,
    color: "#78716C",
    fontFamily: "inherit",
  },
  statTarget: {
    fontSize: 11,
    marginTop: 2,
    fontWeight: 500,
  },
  remainingHeader: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    marginBottom: 10,
    paddingTop: 4,
    borderTop: "1px solid #F5F5F4",
    paddingTop: 14,
  },
  remainingTitle: {
    fontSize: 11,
    fontWeight: 700,
    color: "#A8A29E",
    letterSpacing: "0.07em",
    textTransform: "uppercase",
  },
  remainingRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "9px 12px",
    background: "#FAFAF9",
    borderRadius: 10,
    marginBottom: 7,
  },
  remainingLabel: {
    fontSize: 13,
    fontWeight: 600,
    color: "#78716C",
  },
  remainingVal: {
    fontFamily: "'Sora', 'Inter', sans-serif",
    fontSize: 15,
    fontWeight: 700,
  },
  remainingUnit: {
    fontSize: 12,
    fontWeight: 400,
    color: "#A8A29E",
    fontFamily: "inherit",
  },
};