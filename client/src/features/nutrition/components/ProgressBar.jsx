// client/src/features/nutrition/components/ProgressBar.jsx

export default function ProgressBar({
  label,
  emoji = "",
  value = 0,
  target = 0,
  percent = 0,
  unit = "",
  color = "#F97316",
}) {
  const safePercent = Math.max(0, Math.min(percent, 100));

  return (
    <div style={styles.wrap}>
      <div style={styles.row}>
        <span style={styles.labelWrap}>
          {emoji && <span style={{ marginRight: 5 }}>{emoji}</span>}
          <span style={styles.label}>{label}</span>
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={styles.values}>
            {value}
            {unit} / {target}
            {unit}
          </span>
          <span style={{ ...styles.pctBadge, background: color + "18", color }}>
            {percent}%
          </span>
        </div>
      </div>

      <div style={styles.track}>
        <div
          style={{
            ...styles.fill,
            width: `${safePercent}%`,
            background: color,
          }}
        />
      </div>
    </div>
  );
}

const styles = {
  wrap: {
    marginBottom: 18,
  },
  row: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  labelWrap: {
    display: "flex",
    alignItems: "center",
    fontSize: 13,
    fontWeight: 600,
    color: "#1C1917",
  },
  label: {
    fontSize: 13,
    fontWeight: 600,
    color: "#1C1917",
  },
  values: {
    fontSize: 12,
    color: "#78716C",
  },
  pctBadge: {
    fontSize: 11,
    fontWeight: 700,
    borderRadius: 6,
    padding: "2px 8px",
  },
  track: {
    height: 10,
    width: "100%",
    background: "#F5F5F4",
    borderRadius: 99,
    overflow: "hidden",
  },
  fill: {
    height: "100%",
    borderRadius: 99,
    transition: "width 0.4s ease",
  },
};