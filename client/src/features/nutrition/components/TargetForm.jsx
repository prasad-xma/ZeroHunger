// client/src/features/nutrition/components/TargetForm.jsx

import { useMemo, useState } from "react";
import { saveTargets, updateMyTargets } from "../services/nutritionService";

const initialForm = {
  age: "",
  gender: "male",
  heightCm: "",
  weightKg: "",
  activityLevel: "moderate",
  goal: "maintain",
};

export default function TargetForm({ existingTargets, onSaved }) {
  const initialValues = useMemo(() => {
    if (!existingTargets?.inputs) return initialForm;
    return {
      age: existingTargets.inputs.age ?? "",
      gender: existingTargets.inputs.gender ?? "male",
      heightCm: existingTargets.inputs.heightCm ?? "",
      weightKg: existingTargets.inputs.weightKg ?? "",
      activityLevel: existingTargets.inputs.activityLevel ?? "moderate",
      goal: existingTargets.inputs.goal ?? "maintain",
    };
  }, [existingTargets]);

  const [form, setForm] = useState(initialValues);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setLoading(true);
      setMessage("");
      setError("");

      const payload = {
        age: Number(form.age),
        gender: form.gender,
        heightCm: Number(form.heightCm),
        weightKg: Number(form.weightKg),
        activityLevel: form.activityLevel,
        goal: form.goal,
      };

      const response = existingTargets
        ? await updateMyTargets(payload)
        : await saveTargets(payload);

      setMessage(response?.message || "Targets saved successfully");
      if (onSaved) onSaved();
    } catch (err) {
      setError(err.message || "Failed to save targets");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={styles.card}>
      <div style={styles.cardHeader}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={styles.iconBox}>
            <svg viewBox="0 0 24 24" fill="white" style={{ width: 16, height: 16 }}>
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
            </svg>
          </div>
          <div>
            <h2 style={styles.cardTitle}>Nutrition Targets</h2>
            <p style={styles.cardSub}>Enter your details to calculate daily macros.</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={styles.formGrid2}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Age</label>
            <input
              type="number"
              name="age"
              value={form.age}
              onChange={handleChange}
              style={styles.input}
              placeholder="25"
              required
              onFocus={(e) => (e.target.style.borderColor = "#F97316")}
              onBlur={(e) => (e.target.style.borderColor = "#E7E5E4")}
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Gender</label>
            <select
              name="gender"
              value={form.gender}
              onChange={handleChange}
              style={styles.select}
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
        </div>

        <div style={styles.formGrid2}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Height (cm)</label>
            <input
              type="number"
              name="heightCm"
              value={form.heightCm}
              onChange={handleChange}
              style={styles.input}
              placeholder="170"
              required
              onFocus={(e) => (e.target.style.borderColor = "#F97316")}
              onBlur={(e) => (e.target.style.borderColor = "#E7E5E4")}
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Weight (kg)</label>
            <input
              type="number"
              name="weightKg"
              value={form.weightKg}
              onChange={handleChange}
              style={styles.input}
              placeholder="70"
              required
              onFocus={(e) => (e.target.style.borderColor = "#F97316")}
              onBlur={(e) => (e.target.style.borderColor = "#E7E5E4")}
            />
          </div>
        </div>

        <div style={styles.formGrid2}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Activity Level</label>
            <select
              name="activityLevel"
              value={form.activityLevel}
              onChange={handleChange}
              style={styles.select}
            >
              <option value="sedentary">Sedentary</option>
              <option value="light">Light</option>
              <option value="moderate">Moderate</option>
              <option value="active">Active</option>
              <option value="very_active">Very Active</option>
            </select>
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Goal</label>
            <select
              name="goal"
              value={form.goal}
              onChange={handleChange}
              style={styles.select}
            >
              <option value="lose">Lose Weight</option>
              <option value="maintain">Maintain</option>
              <option value="gain">Gain Weight</option>
            </select>
          </div>
        </div>

        <button type="submit" disabled={loading} style={{ ...styles.btn, opacity: loading ? 0.7 : 1 }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 16, height: 16 }}>
            <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v14a2 2 0 01-2 2z" />
            <polyline points="17 21 17 13 7 13 7 21" />
            <polyline points="7 3 7 8 15 8" />
          </svg>
          {loading ? "Saving..." : existingTargets ? "Update Targets" : "Save Targets"}
        </button>
      </form>

      {message && (
        <div style={styles.successMsg}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 15, height: 15, flexShrink: 0 }}>
            <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
          {message}
        </div>
      )}
      {error && (
        <div style={styles.errorMsg}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 15, height: 15, flexShrink: 0 }}>
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          {error}
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
  formGrid2: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 14,
    marginBottom: 14,
  },
  formGroup: {
    display: "flex",
    flexDirection: "column",
    gap: 5,
  },
  label: {
    fontSize: 12,
    fontWeight: 600,
    color: "#78716C",
  },
  input: {
    background: "#FAFAF9",
    border: "1.5px solid #E7E5E4",
    borderRadius: 10,
    padding: "11px 14px",
    fontSize: 14,
    color: "#1C1917",
    outline: "none",
    fontFamily: "inherit",
    transition: "border 0.15s",
    width: "100%",
    boxSizing: "border-box",
  },
  select: {
    background: "#FAFAF9",
    border: "1.5px solid #E7E5E4",
    borderRadius: 10,
    padding: "11px 14px",
    fontSize: 14,
    color: "#1C1917",
    outline: "none",
    fontFamily: "inherit",
    cursor: "pointer",
    width: "100%",
    boxSizing: "border-box",
    appearance: "none",
  },
  btn: {
    width: "100%",
    background: "#1C1917",
    color: "white",
    border: "none",
    borderRadius: 12,
    padding: "13px 20px",
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: "inherit",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 4,
  },
  successMsg: {
    background: "#F0FDF4",
    border: "1px solid #BBF7D0",
    borderRadius: 10,
    padding: "10px 14px",
    color: "#16A34A",
    fontSize: 13,
    fontWeight: 600,
    marginTop: 12,
    display: "flex",
    alignItems: "center",
    gap: 7,
  },
  errorMsg: {
    background: "#FEF2F2",
    border: "1px solid #FECACA",
    borderRadius: 10,
    padding: "10px 14px",
    color: "#DC2626",
    fontSize: 13,
    fontWeight: 600,
    marginTop: 12,
    display: "flex",
    alignItems: "center",
    gap: 7,
  },
};