// client/src/features/nutrition/components/WeeklySummaryCard.jsx

export default function WeeklySummaryCard({ weeklySummary = [] }) {
  const today = new Date().toISOString().split("T")[0];

  const maxCalories = weeklySummary.length
    ? Math.max(...weeklySummary.map((d) => d.calories || 0), 1)
    : 1;

  const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  function getDayLabel(dateKey) {
    if (!dateKey) return "—";
    const date = new Date(dateKey);
    const isToday = dateKey === today;
    if (isToday) return "Today";
    return dayLabels[date.getDay()] || dateKey;
  }

  return (
    <div style={styles.card}>
      <div style={styles.cardHeader}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={styles.iconBox}>
            <svg viewBox="0 0 24 24" fill="white" style={{ width: 16, height: 16 }}>
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
            </svg>
          </div>
          <div>
            <h2 style={styles.cardTitle}>Weekly Summary</h2>
            <p style={styles.cardSub}>Last 7 days intake at a glance.</p>
          </div>
        </div>
        <button style={styles.viewBtn}>View full report →</button>
      </div>

      {weeklySummary.length > 0 ? (
        <>
          {/* Day columns bar view */}
          <div style={styles.weekRow}>
            {weeklySummary.map((item) => {
              const isToday = item.dateKey === today;
              const pct = Math.round(((item.calories || 0) / maxCalories) * 100);
              return (
                <div
                  key={item.dateKey}
                  style={{
                    ...styles.dayCol,
                    ...(isToday ? styles.dayColToday : {}),
                  }}
                >
                  <div
                    style={{
                      ...styles.dayName,
                      ...(isToday ? { color: "rgba(255,255,255,0.75)" } : {}),
                    }}
                  >
                    {getDayLabel(item.dateKey)}
                  </div>
                  <div
                    style={{
                      ...styles.dayCal,
                      ...(isToday ? { color: "white" } : {}),
                    }}
                  >
                    {item.calories}
                  </div>
                  <div style={styles.barTrack}>
                    <div
                      style={{
                        ...styles.barFill,
                        width: `${pct}%`,
                        background: isToday ? "white" : "#F97316",
                      }}
                    />
                  </div>
                  <div
                    style={{
                      ...styles.dayProt,
                      ...(isToday ? { color: "rgba(255,255,255,0.7)" } : {}),
                    }}
                  >
                    P {item.proteinG}g
                  </div>
                </div>
              );
            })}
          </div>

          {/* Table view */}
          <div style={styles.tableWrap}>
            <div style={styles.tableHeader}>
              {["Date", "Calories", "Protein", "Carbs", "Fat"].map((h) => (
                <div key={h} style={styles.th}>{h}</div>
              ))}
            </div>
            {weeklySummary.map((item) => {
              const isToday = item.dateKey === today;
              return (
                <div
                  key={item.dateKey}
                  style={{
                    ...styles.tableRow,
                    ...(isToday ? styles.tableRowToday : {}),
                  }}
                >
                  <div style={{ ...styles.td, fontWeight: 700, color: isToday ? "#F97316" : "#1C1917" }}>
                    {isToday ? "Today" : item.dateKey}
                  </div>
                  <div style={styles.td}>{item.calories} <span style={styles.unit}>kcal</span></div>
                  <div style={styles.td}>{item.proteinG} <span style={styles.unit}>g</span></div>
                  <div style={styles.td}>{item.carbsG} <span style={styles.unit}>g</span></div>
                  <div style={styles.td}>{item.fatG ?? "—"} <span style={styles.unit}>{item.fatG != null ? "g" : ""}</span></div>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <div style={styles.empty}>
          <svg viewBox="0 0 24 24" fill="none" stroke="#D4D4D0" strokeWidth="1.5" style={{ width: 40, height: 40 }}>
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
          </svg>
          <p style={styles.emptyText}>No weekly data available yet.</p>
          <p style={styles.emptySub}>Start logging food to see your weekly summary here.</p>
        </div>
      )}
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
    alignItems: "center",
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
  viewBtn: {
    background: "#FFF7ED",
    border: "1px solid #E7E5E4",
    borderRadius: 10,
    padding: "8px 14px",
    fontSize: 12,
    fontWeight: 600,
    color: "#78716C",
    cursor: "pointer",
    fontFamily: "inherit",
  },
  weekRow: {
    display: "grid",
    gridTemplateColumns: "repeat(7, 1fr)",
    gap: 8,
    marginBottom: 20,
  },
  dayCol: {
    background: "white",
    borderRadius: 12,
    border: "1px solid #E7E5E4",
    padding: "12px 8px",
    textAlign: "center",
    transition: "transform 0.15s",
  },
  dayColToday: {
    background: "#F97316",
    borderColor: "#F97316",
  },
  dayName: {
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: "0.06em",
    color: "#A8A29E",
    textTransform: "uppercase",
  },
  dayCal: {
    fontFamily: "'Sora', 'Inter', sans-serif",
    fontSize: 14,
    fontWeight: 700,
    color: "#1C1917",
    margin: "6px 0 5px",
  },
  barTrack: {
    height: 4,
    background: "#F5F5F4",
    borderRadius: 99,
    overflow: "hidden",
    margin: "0 4px",
  },
  barFill: {
    height: "100%",
    borderRadius: 99,
    transition: "width 0.4s ease",
  },
  dayProt: {
    fontSize: 9,
    color: "#A8A29E",
    marginTop: 5,
  },
  tableWrap: {
    borderRadius: 12,
    border: "1px solid #E7E5E4",
    overflow: "hidden",
  },
  tableHeader: {
    display: "grid",
    gridTemplateColumns: "1.5fr 1fr 1fr 1fr 1fr",
    background: "#FAFAF9",
    padding: "10px 16px",
    borderBottom: "1px solid #E7E5E4",
  },
  th: {
    fontSize: 11,
    fontWeight: 700,
    color: "#A8A29E",
    textTransform: "uppercase",
    letterSpacing: "0.06em",
  },
  tableRow: {
    display: "grid",
    gridTemplateColumns: "1.5fr 1fr 1fr 1fr 1fr",
    padding: "12px 16px",
    borderBottom: "1px solid #F5F5F4",
    alignItems: "center",
  },
  tableRowToday: {
    background: "#FFF7ED",
  },
  td: {
    fontSize: 13,
    fontWeight: 600,
    color: "#1C1917",
  },
  unit: {
    fontSize: 11,
    fontWeight: 400,
    color: "#A8A29E",
  },
  empty: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px 20px",
    gap: 8,
  },
  emptyText: {
    fontSize: 14,
    fontWeight: 600,
    color: "#78716C",
    margin: 0,
  },
  emptySub: {
    fontSize: 12,
    color: "#A8A29E",
    margin: 0,
    textAlign: "center",
  },
};