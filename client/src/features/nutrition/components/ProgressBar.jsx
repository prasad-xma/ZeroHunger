// client/src/features/nutrition/components/ProgressBar.jsx

export default function ProgressBar({ label, emoji = "", value = 0, target = 0, percent = 0, unit = "", color = "#F97316" }) {
  const safe = Math.max(0, Math.min(percent, 100));
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 7 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          {emoji && <span style={{ fontSize: 14 }}>{emoji}</span>}
          <span style={{ fontSize: 13, fontWeight: 700, color: "#1C1917" }}>{label}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 12, color: "#A8A29E" }}>
            {value}{unit} / {target}{unit}
          </span>
          <span style={{
            fontSize: 11, fontWeight: 800, borderRadius: 20, padding: "2px 9px",
            background: color + "18", color,
          }}>
            {percent}%
          </span>
        </div>
      </div>
      <div style={{ height: 9, background: "#F5EDE0", borderRadius: 99, overflow: "hidden" }}>
        <div style={{
          height: "100%", borderRadius: 99,
          width: `${safe}%`,
          background: `linear-gradient(90deg, ${color}CC, ${color})`,
          transition: "width 0.5s ease",
        }} />
      </div>
    </div>
  );
}