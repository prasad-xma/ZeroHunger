// client/src/features/nutrition/components/WeeklySummaryCard.jsx

export default function WeeklySummaryCard({ weeklySummary = [] }) {
  const today = new Date().toISOString().split("T")[0];
  const maxCal = weeklySummary.length
    ? Math.max(...weeklySummary.map((d) => d.calories || 0), 1)
    : 2000;

  const dayAbbr = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  function getDayLabel(dateKey) {
    if (!dateKey) return "—";
    if (dateKey === today) return "Today";
    return dayAbbr[new Date(dateKey).getDay()] || dateKey;
  }

  // Nutrition tips (static, mimics ZeroHunger "Daily Nutrition Tips")
  const tips = [
    { num: 1, title: "Stay Hydrated", body: "Drink at least 8 glasses of water daily to maintain optimal metabolism and energy levels.", color: "#F97316", bg: "#FFF0E0" },
    { num: 2, title: "Balance Your Macros", body: "Aim for 40% carbs, 30% protein, and 30% healthy fats for optimal nutrition.", color: "#EA580C", bg: "#FFF4EC" },
    { num: 3, title: "Eat Colorful Foods", body: "Include a variety of colorful fruits and vegetables for diverse nutrients.", color: "#16A34A", bg: "#F0FDF4" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Daily Nutrition Tips card - mimics ZeroHunger panel */}
      <div style={S.card}>
        <div style={S.header}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={S.iconBox}>
              <svg viewBox="0 0 24 24" fill="white" width="16" height="16">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </div>
            <div>
              <h2 style={S.title}>Daily Nutrition Tips</h2>
              <p style={S.sub}>Expert advice for your goals.</p>
            </div>
          </div>
          <span style={{ ...S.badge, background: "#DCFCE7", color: "#16A34A" }}>Updated</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {tips.map((tip) => (
            <div key={tip.num} style={{ ...S.tipRow, borderLeft: `3px solid ${tip.color}`, background: tip.bg }}>
              <div style={{ ...S.tipNum, background: tip.color }}>{tip.num}</div>
              <div style={{ flex: 1 }}>
                <div style={S.tipTitle}>{tip.title}</div>
                <div style={S.tipBody}>{tip.body}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Weekly summary card */}
      <div style={S.card}>
        <div style={S.header}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={S.iconBox}>
              <svg viewBox="0 0 24 24" fill="white" width="16" height="16">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
              </svg>
            </div>
            <div>
              <h2 style={S.title}>Weekly Summary</h2>
              <p style={S.sub}>Last 7 days at a glance.</p>
            </div>
          </div>
          <button style={S.viewBtn}>View all →</button>
        </div>

        {weeklySummary.length > 0 ? (
          <>
            <div style={S.weekRow}>
              {weeklySummary.map((item) => {
                const isToday = item.dateKey === today;
                const pct = Math.round(((item.calories || 0) / maxCal) * 100);
                return (
                  <div key={item.dateKey} style={{ ...S.dayCol, ...(isToday ? S.dayColToday : {}) }}>
                    <div style={{ ...S.dayName, ...(isToday ? { color: "rgba(255,255,255,.8)" } : {}) }}>
                      {getDayLabel(item.dateKey)}
                    </div>
                    <div style={{ ...S.dayCal, ...(isToday ? { color: "white" } : {}) }}>
                      {item.calories}
                    </div>
                    <div style={{ ...S.barTrack, background: isToday ? "rgba(255,255,255,.2)" : "#F5EDE0" }}>
                      <div style={{
                        height: "100%", width: `${pct}%`, borderRadius: 99,
                        background: isToday ? "white" : "#F97316", transition: "width 0.4s",
                      }} />
                    </div>
                    <div style={{ ...S.dayProt, ...(isToday ? { color: "rgba(255,255,255,.7)" } : {}) }}>
                      P {item.proteinG}g
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={S.tableWrap}>
              <div style={S.tableHead}>
                {["Date", "Calories", "Protein", "Carbs"].map((h) => (
                  <div key={h} style={S.th}>{h}</div>
                ))}
              </div>
              {weeklySummary.map((item) => {
                const isToday = item.dateKey === today;
                return (
                  <div key={item.dateKey} style={{ ...S.tableRow, ...(isToday ? { background: "#FFF7EE" } : {}) }}>
                    <div style={{ ...S.td, color: isToday ? "#F97316" : "#1C1917", fontWeight: 700 }}>
                      {isToday ? "Today" : item.dateKey}
                    </div>
                    <div style={S.td}>{item.calories} <span style={S.unit}>kcal</span></div>
                    <div style={S.td}>{item.proteinG} <span style={S.unit}>g</span></div>
                    <div style={S.td}>{item.carbsG} <span style={S.unit}>g</span></div>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <div style={S.empty}>
            <p style={{ color: "#A8A29E", fontSize: 13 }}>No weekly data yet. Start logging meals!</p>
          </div>
        )}
      </div>
    </div>
  );
}

const S = {
  card: {
    background: "white",
    borderRadius: 18,
    border: "1px solid #F5E6D0",
    padding: "20px 20px 18px",
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
  viewBtn: {
    background: "#FFF0E0",
    border: "1px solid #F5E6D0",
    borderRadius: 20,
    padding: "4px 12px",
    fontSize: 11,
    fontWeight: 700,
    color: "#EA580C",
    cursor: "pointer",
    fontFamily: "inherit",
  },
  tipRow: {
    display: "flex",
    alignItems: "flex-start",
    gap: 12,
    padding: "12px 14px",
    borderRadius: 12,
    borderLeftWidth: 3,
    borderLeftStyle: "solid",
  },
  tipNum: {
    width: 24,
    height: 24,
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 12,
    fontWeight: 800,
    color: "white",
    flexShrink: 0,
    marginTop: 1,
  },
  tipTitle: {
    fontSize: 13,
    fontWeight: 700,
    color: "#1C1917",
    marginBottom: 3,
  },
  tipBody: {
    fontSize: 12,
    color: "#78716C",
    lineHeight: 1.5,
  },
  weekRow: {
    display: "grid",
    gridTemplateColumns: "repeat(7,1fr)",
    gap: 7,
    marginBottom: 16,
  },
  dayCol: {
    background: "white",
    border: "1px solid #F5E6D0",
    borderRadius: 11,
    padding: "10px 6px",
    textAlign: "center",
  },
  dayColToday: {
    background: "#F97316",
    borderColor: "#F97316",
    boxShadow: "0 4px 12px rgba(249,115,22,0.3)",
  },
  dayName: {
    fontSize: 9,
    fontWeight: 700,
    color: "#C4B5A0",
    textTransform: "uppercase",
    letterSpacing: "0.06em",
  },
  dayCal: {
    fontFamily: "'Sora', sans-serif",
    fontSize: 13,
    fontWeight: 800,
    color: "#1C1917",
    margin: "5px 0 4px",
  },
  barTrack: {
    height: 4,
    borderRadius: 99,
    overflow: "hidden",
    margin: "0 4px",
  },
  dayProt: {
    fontSize: 9,
    color: "#C4B5A0",
    marginTop: 4,
  },
  tableWrap: {
    borderRadius: 12,
    border: "1px solid #F5E6D0",
    overflow: "hidden",
  },
  tableHead: {
    display: "grid",
    gridTemplateColumns: "1.5fr 1fr 1fr 1fr",
    background: "#FFFBF5",
    padding: "9px 14px",
    borderBottom: "1px solid #F5E6D0",
  },
  th: {
    fontSize: 10,
    fontWeight: 700,
    color: "#C4B5A0",
    textTransform: "uppercase",
    letterSpacing: "0.06em",
  },
  tableRow: {
    display: "grid",
    gridTemplateColumns: "1.5fr 1fr 1fr 1fr",
    padding: "10px 14px",
    borderBottom: "1px solid #F5EDE0",
    alignItems: "center",
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
    padding: "30px 0",
    textAlign: "center",
  },
};