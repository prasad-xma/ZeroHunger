// client/src/features/nutrition/components/FoodSearchCard.jsx

import { useState } from "react";
import { addIntake, calculateFood, searchFoods } from "../services/nutritionService";

const initialFoodForm = { food: "", quantity: 100, measure: "g" };

export default function FoodSearchCard({ onIntakeAdded }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [foodForm, setFoodForm] = useState(initialFoodForm);
  const [calculatedFood, setCalculatedFood] = useState(null);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [loadingCalculate, setLoadingCalculate] = useState(false);
  const [loadingAdd, setLoadingAdd] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSearch(e) {
    e.preventDefault();
    try {
      setLoadingSearch(true);
      setError(""); setMessage("");
      const response = await searchFoods(searchQuery);
      setSearchResults(response?.data?.items || []);
    } catch (err) {
      setError(err.message || "Failed to search foods");
    } finally { setLoadingSearch(false); }
  }

  function handleFoodFormChange(e) {
    const { name, value } = e.target;
    setFoodForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleCalculate(e) {
    e.preventDefault();
    try {
      setLoadingCalculate(true);
      setError(""); setMessage("");
      const response = await calculateFood({
        food: foodForm.food, quantity: Number(foodForm.quantity), measure: foodForm.measure,
      });
      setCalculatedFood(response?.data || null);
    } catch (err) {
      setError(err.message || "Failed to calculate food nutrition");
    } finally { setLoadingCalculate(false); }
  }

  async function handleAddIntake() {
    if (!calculatedFood) return;
    try {
      setLoadingAdd(true);
      setError(""); setMessage("");
      const response = await addIntake({
        calories: calculatedFood.calories,
        proteinG: calculatedFood.proteinG,
        carbsG: calculatedFood.carbsG,
        fatG: calculatedFood.fatG,
        sugarG: calculatedFood.sugarG || 0,
        satFatG: calculatedFood.satFatG || 0,
      });
      setMessage(response?.message || "Food added to intake");
      if (onIntakeAdded) onIntakeAdded();
    } catch (err) {
      setError(err.message || "Failed to add intake");
    } finally { setLoadingAdd(false); }
  }

  const nutRows = calculatedFood
    ? [
        { label: "Calories", value: calculatedFood.calories, unit: "kcal", color: "#F97316", bg: "#FFF0E0" },
        { label: "Protein", value: calculatedFood.proteinG, unit: "g", color: "#8B5CF6", bg: "#F5F3FF" },
        { label: "Carbs", value: calculatedFood.carbsG, unit: "g", color: "#3B82F6", bg: "#EFF6FF" },
        { label: "Fat", value: calculatedFood.fatG, unit: "g", color: "#10B981", bg: "#ECFDF5" },
        { label: "Sugar", value: calculatedFood.sugarG || 0, unit: "g", color: "#F59E0B", bg: "#FFFBEB" },
        { label: "Sat Fat", value: calculatedFood.satFatG || 0, unit: "g", color: "#EF4444", bg: "#FEF2F2" },
      ]
    : [];

  return (
    <div style={S.card}>
      {/* Header */}
      <div style={S.header}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={S.iconBox}>
            <svg viewBox="0 0 24 24" fill="white" width="16" height="16">
              <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
            </svg>
          </div>
          <div>
            <h2 style={S.title}>Food Search + Calculate</h2>
            <p style={S.sub}>Search, calculate & log your meals.</p>
          </div>
        </div>
        <span style={S.updatedTag}>Updated</span>
      </div>

      {/* Search bar */}
      <form onSubmit={handleSearch} style={S.searchRow}>
        <div style={{ flex: 1, position: "relative" }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="#C4B5A0" strokeWidth="2"
            style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", width: 15, height: 15, pointerEvents: "none" }}>
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
          </svg>
          <input
            type="text"
            placeholder="Search food like chicken breast..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ ...S.input, paddingLeft: 36 }}
            required
          />
        </div>
        <button type="submit" disabled={loadingSearch} style={S.searchBtn}>
          {loadingSearch ? "..." : "Search"}
        </button>
      </form>

      {/* Search results */}
      {searchResults.length > 0 && (
        <div style={S.resultBox}>
          <div style={S.sectionLabel}>Search results</div>
          {searchResults.slice(0, 5).map((item, i) => (
            <button
              key={`${item.name}-${i}`}
              type="button"
              onClick={() => setFoodForm((prev) => ({ ...prev, food: item.name || "" }))}
              style={{
                ...S.resultItem,
                ...(foodForm.food === item.name ? S.resultItemActive : {}),
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{
                  ...S.resultNum,
                  background: foodForm.food === item.name ? "#F97316" : "#FFF0E0",
                  color: foodForm.food === item.name ? "white" : "#F97316",
                }}>
                  {i + 1}
                </div>
                <span style={S.resultName}>{item.name || "Unknown food"}</span>
              </div>
              <span style={{
                ...S.resultCal,
                background: foodForm.food === item.name ? "#F97316" : "#FFF0E0",
                color: foodForm.food === item.name ? "white" : "#EA580C",
              }}>
                {Math.round(Number(item.calories || 0))} kcal
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Calculate form */}
      <div style={{ marginTop: 18 }}>
        <div style={S.sectionLabel}>Calculate Nutrition</div>
        <form onSubmit={handleCalculate}>
          <div style={S.calcGrid}>
            <div>
              <label style={S.fieldLabel}>Food Item</label>
              <input type="text" name="food" value={foodForm.food} onChange={handleFoodFormChange}
                style={S.input} placeholder="e.g. rice" required />
            </div>
            <div>
              <label style={S.fieldLabel}>Quantity</label>
              <input type="number" name="quantity" value={foodForm.quantity} onChange={handleFoodFormChange}
                style={S.input} min="1" required />
            </div>
            <div>
              <label style={S.fieldLabel}>Measure</label>
              <select name="measure" value={foodForm.measure} onChange={handleFoodFormChange} style={S.input}>
                <option value="g">Grams</option>
                <option value="cup">Cup</option>
              </select>
            </div>
          </div>
          <button type="submit" disabled={loadingCalculate}
            style={{ ...S.calcBtn, opacity: loadingCalculate ? 0.7 : 1 }}>
            {loadingCalculate ? "Calculating..." : "⚡ Calculate Nutrition"}
          </button>
        </form>
      </div>

      {/* Results */}
      {calculatedFood && (
        <div style={S.resultPanel}>
          <div style={S.resultPanelHeader}>
            <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
              <span style={{ fontSize: 15 }}>✅</span>
              <span style={{ fontWeight: 700, fontSize: 13, color: "#1C1917" }}>
                Nutrition for {foodForm.quantity}{foodForm.measure} of {foodForm.food}
              </span>
            </div>
            <span style={S.proTag}>Calculated</span>
          </div>

          <div style={S.nutGrid}>
            {nutRows.map((n) => (
              <div key={n.label} style={{ ...S.nutItem, background: n.bg, border: `1px solid ${n.color}22` }}>
                <div style={{ ...S.nutVal, color: n.color }}>{n.value}<span style={S.nutUnit}>{n.unit}</span></div>
                <div style={S.nutLabel}>{n.label}</div>
              </div>
            ))}
          </div>

          <button type="button" onClick={handleAddIntake} disabled={loadingAdd}
            style={{ ...S.addBtn, opacity: loadingAdd ? 0.7 : 1 }}>
            {loadingAdd ? "Adding..." : "+ Add to Today's Intake"}
          </button>
        </div>
      )}

      {message && <Alert type="success">{message}</Alert>}
      {error && <Alert type="error">{error}</Alert>}
    </div>
  );
}

function Alert({ type, children }) {
  const ok = type === "success";
  return (
    <div style={{
      marginTop: 12, padding: "10px 14px", borderRadius: 10, fontSize: 13, fontWeight: 600,
      background: ok ? "#F0FDF4" : "#FEF2F2",
      border: `1px solid ${ok ? "#BBF7D0" : "#FECACA"}`,
      color: ok ? "#16A34A" : "#DC2626",
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
  updatedTag: {
    fontSize: 11,
    fontWeight: 700,
    background: "#DCFCE7",
    color: "#16A34A",
    borderRadius: 20,
    padding: "3px 10px",
  },
  proTag: {
    fontSize: 11,
    fontWeight: 700,
    background: "#FFF0E0",
    color: "#EA580C",
    borderRadius: 20,
    padding: "3px 10px",
  },
  searchRow: {
    display: "flex",
    gap: 10,
    marginBottom: 0,
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
    appearance: "none",
  },
  searchBtn: {
    background: "#F97316",
    color: "white",
    border: "none",
    borderRadius: 10,
    padding: "10px 20px",
    fontSize: 13,
    fontWeight: 700,
    cursor: "pointer",
    fontFamily: "inherit",
    whiteSpace: "nowrap",
    boxShadow: "0 3px 10px rgba(249,115,22,0.3)",
  },
  resultBox: {
    background: "#FFFBF5",
    border: "1px solid #F5E6D0",
    borderRadius: 12,
    padding: 12,
    marginTop: 14,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: 700,
    color: "#C4B5A0",
    textTransform: "uppercase",
    letterSpacing: "0.07em",
    marginBottom: 10,
  },
  resultItem: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    background: "white",
    borderRadius: 9,
    padding: "9px 12px",
    marginBottom: 7,
    cursor: "pointer",
    border: "1px solid transparent",
    width: "100%",
    textAlign: "left",
    fontFamily: "inherit",
    transition: "border 0.12s",
  },
  resultItemActive: {
    borderColor: "#F97316",
    background: "#FFF7EE",
  },
  resultNum: {
    width: 22,
    height: 22,
    borderRadius: "50%",
    fontSize: 11,
    fontWeight: 700,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  resultName: {
    fontSize: 13,
    fontWeight: 600,
    color: "#1C1917",
  },
  resultCal: {
    fontSize: 11,
    fontWeight: 700,
    borderRadius: 8,
    padding: "3px 9px",
  },
  calcGrid: {
    display: "grid",
    gridTemplateColumns: "2fr 1fr 1fr",
    gap: 10,
    marginBottom: 12,
  },
  fieldLabel: {
    display: "block",
    fontSize: 11,
    fontWeight: 700,
    color: "#A8A29E",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    marginBottom: 5,
  },
  calcBtn: {
    width: "100%",
    background: "white",
    color: "#F97316",
    border: "1.5px solid #F5E6D0",
    borderRadius: 10,
    padding: "11px 20px",
    fontSize: 13,
    fontWeight: 700,
    cursor: "pointer",
    fontFamily: "inherit",
  },
  resultPanel: {
    background: "#FFFBF5",
    border: "1.5px solid #F5E6D0",
    borderRadius: 14,
    padding: 16,
    marginTop: 16,
  },
  resultPanelHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  nutGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3,1fr)",
    gap: 8,
    marginBottom: 14,
  },
  nutItem: {
    borderRadius: 10,
    padding: "10px 10px 8px",
    textAlign: "center",
  },
  nutVal: {
    fontFamily: "'Sora', sans-serif",
    fontSize: 17,
    fontWeight: 800,
    lineHeight: 1.1,
  },
  nutUnit: {
    fontSize: 11,
    fontWeight: 400,
    marginLeft: 2,
  },
  nutLabel: {
    fontSize: 10,
    color: "#A8A29E",
    marginTop: 3,
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: "0.04em",
  },
  addBtn: {
    width: "100%",
    background: "linear-gradient(135deg,#F97316,#EA580C)",
    color: "white",
    border: "none",
    borderRadius: 11,
    padding: "12px 20px",
    fontSize: 13,
    fontWeight: 700,
    cursor: "pointer",
    fontFamily: "inherit",
    boxShadow: "0 4px 14px rgba(249,115,22,0.35)",
  },
};