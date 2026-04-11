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

  const goalColors = { lose: "#EF4444", maintain: "#F97316", gain: "#16A34A" };

  return (
    <div style={S.card}>
      <div style={S.header}>
        <div style={S.headerLeft}>
          <div style={S.iconBox}>
            <svg viewBox="0 0 24 24" fill="white" width="16" height="16">
              <circle cx="12" cy="8" r="4" />
              <path d="M20 21a8 8 0 10-16 0" />
            </svg>
          </div>
          <div>
            <h2 style={S.title}>Nutrition Targets</h2>
            <p style={S.sub}>Set your daily macro goals.</p>
          </div>
        </div>
        <span style={S.proTag}>Setup</span>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={S.grid2}>
          <Field label="Age">
            <input type="number" name="age" value={form.age} onChange={handleChange}
              style={S.input} placeholder="25" required />
          </Field>
          <Field label="Gender">
            <select name="gender" value={form.gender} onChange={handleChange} style={S.input}>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </Field>
        </div>
        <div style={S.grid2}>
          <Field label="Height (cm)">
            <input type="number" name="heightCm" value={form.heightCm} onChange={handleChange}
              style={S.input} placeholder="170" required />
          </Field>
          <Field label="Weight (kg)">
            <input type="number" name="weightKg" value={form.weightKg} onChange={handleChange}
              style={S.input} placeholder="70" required />
          </Field>
        </div>
        <div style={S.grid2}>
          <Field label="Activity Level">
            <select name="activityLevel" value={form.activityLevel} onChange={handleChange} style={S.input}>
              <option value="sedentary">Sedentary</option>
              <option value="light">Light</option>
              <option value="moderate">Moderate</option>
              <option value="active">Active</option>
              <option value="very_active">Very Active</option>
            </select>
          </Field>
          <Field label="Goal">
            <select name="goal" value={form.goal} onChange={handleChange}
              style={{ ...S.input, color: goalColors[form.goal] || "#1C1917", fontWeight: 700 }}>
              <option value="lose">🔻 Lose Weight</option>
              <option value="maintain">⚖️ Maintain</option>
              <option value="gain">📈 Gain Weight</option>
            </select>
          </Field>
        </div>

        <button type="submit" disabled={loading} style={{ ...S.btn, opacity: loading ? 0.7 : 1 }}>
          {loading ? "Saving..." : existingTargets ? "Update Targets" : "Save Targets"}
        </button>
      </form>

      {message && <Alert type="success">{message}</Alert>}
      {error && <Alert type="error">{error}</Alert>}
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
      <label style={S.label}>{label}</label>
      {children}
    </div>
  );
}

function Alert({ type, children }) {
  const isSuccess = type === "success";
  return (
    <div style={{
      marginTop: 12,
      padding: "10px 14px",
      borderRadius: 10,
      fontSize: 13,
      fontWeight: 600,
      display: "flex",
      alignItems: "center",
      gap: 7,
      background: isSuccess ? "#F0FDF4" : "#FEF2F2",
      border: `1px solid ${isSuccess ? "#BBF7D0" : "#FECACA"}`,
      color: isSuccess ? "#16A34A" : "#DC2626",
    }}>
      {children}
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
    marginBottom: 18,
  },
  headerLeft: {
    display: "flex",
    alignItems: "center",
    gap: 10,
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
  grid2: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 12,
    marginBottom: 12,
  },
  label: {
    fontSize: 11,
    fontWeight: 700,
    color: "#A8A29E",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  },
  input: {
    background: "#FAFAF9",
    border: "1.5px solid #F5E6D0",
    borderRadius: 10,
    padding: "10px 12px",
    fontSize: 13,
    color: "#1C1917",
    outline: "none",
    fontFamily: "inherit",
    width: "100%",
    boxSizing: "border-box",
    transition: "border 0.15s",
    appearance: "none",
  },
  btn: {
    width: "100%",
    background: "linear-gradient(135deg, #F97316, #EA580C)",
    color: "white",
    border: "none",
    borderRadius: 12,
    padding: "12px 20px",
    fontSize: 14,
    fontWeight: 700,
    cursor: "pointer",
    fontFamily: "inherit",
    marginTop: 4,
    boxShadow: "0 4px 14px rgba(249,115,22,0.35)",
    letterSpacing: "0.01em",
  },
};