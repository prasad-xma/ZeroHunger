// client/src/features/nutrition/components/FoodSearchCard.jsx

import { useState } from "react";
import { addIntake, calculateFood, searchFoods } from "../services/nutritionService";

const initialFoodForm = {
  food: "",
  quantity: 100,
  measure: "g",
};

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
      setError("");
      setMessage("");
      const response = await searchFoods(searchQuery);
      setSearchResults(response?.data?.items || []);
    } catch (err) {
      setError(err.message || "Failed to search foods");
    } finally {
      setLoadingSearch(false);
    }
  }

  function handleFoodFormChange(e) {
    const { name, value } = e.target;
    setFoodForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleCalculate(e) {
    e.preventDefault();
    try {
      setLoadingCalculate(true);
      setError("");
      setMessage("");
      const payload = {
        food: foodForm.food,
        quantity: Number(foodForm.quantity),
        measure: foodForm.measure,
      };
      const response = await calculateFood(payload);
      setCalculatedFood(response?.data || null);
    } catch (err) {
      setError(err.message || "Failed to calculate food nutrition");
    } finally {
      setLoadingCalculate(false);
    }
  }

  async function handleAddIntake() {
    if (!calculatedFood) return;
    try {
      setLoadingAdd(true);
      setError("");
      setMessage("");
      const payload = {
        calories: calculatedFood.calories,
        proteinG: calculatedFood.proteinG,
        carbsG: calculatedFood.carbsG,
        fatG: calculatedFood.fatG,
        sugarG: calculatedFood.sugarG || 0,
        satFatG: calculatedFood.satFatG || 0,
      };
      const response = await addIntake(payload);
      setMessage(response?.message || "Food added to intake");
      if (onIntakeAdded) onIntakeAdded();
    } catch (err) {
      setError(err.message || "Failed to add intake");
    } finally {
      setLoadingAdd(false);
    }
  }

  return (
    <div style={styles.card}>
      <div style={styles.cardHeader}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={styles.iconBox}>
            <svg viewBox="0 0 24 24" fill="white" style={{ width: 16, height: 16 }}>
              <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
            </svg>
          </div>
          <div>
            <h2 style={styles.cardTitle}>Food Search + Calculate</h2>
            <p style={styles.cardSub}>Search foods, calculate nutrition, and log intake.</p>
          </div>
        </div>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} style={styles.searchRow}>
        <div style={{ flex: 1, position: "relative" }}>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="#A8A29E"
            strokeWidth="2"
            style={styles.searchIcon}
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input
            type="text"
            placeholder="Search food like chicken breast..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={styles.searchInput}
            required
            onFocus={(e) => (e.target.style.borderColor = "#F97316")}
            onBlur={(e) => (e.target.style.borderColor = "#E7E5E4")}
          />
        </div>
        <button type="submit" disabled={loadingSearch} style={styles.searchBtn}>
          {loadingSearch ? (
            "Searching..."
          ) : (
            <>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 15, height: 15 }}>
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
              Search
            </>
          )}
        </button>
      </form>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <div style={styles.resultsBox}>
          <div style={styles.resultsLabel}>Search results</div>
          {searchResults.slice(0, 5).map((item, index) => (
            <button
              key={`${item.name || "food"}-${index}`}
              type="button"
              onClick={() => setFoodForm((prev) => ({ ...prev, food: item.name || "" }))}
              style={{
                ...styles.resultItem,
                ...(foodForm.food === item.name ? styles.resultItemActive : {}),
              }}
            >
              <span style={styles.resultName}>{item.name || "Unknown food"}</span>
              <span
                style={{
                  ...styles.resultCal,
                  ...(foodForm.food === item.name ? styles.resultCalActive : {}),
                }}
              >
                {Math.round(Number(item.calories || 0))} kcal
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Calculate Form */}
      <div style={styles.sectionLabel}>Calculate Nutrition</div>
      <form onSubmit={handleCalculate}>
        <div style={styles.calcRow}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Food item</label>
            <input
              type="text"
              name="food"
              value={foodForm.food}
              onChange={handleFoodFormChange}
              style={styles.input}
              placeholder="e.g. rice"
              required
              onFocus={(e) => (e.target.style.borderColor = "#F97316")}
              onBlur={(e) => (e.target.style.borderColor = "#E7E5E4")}
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Quantity</label>
            <input
              type="number"
              name="quantity"
              value={foodForm.quantity}
              onChange={handleFoodFormChange}
              style={styles.input}
              min="1"
              required
              onFocus={(e) => (e.target.style.borderColor = "#F97316")}
              onBlur={(e) => (e.target.style.borderColor = "#E7E5E4")}
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Measure</label>
            <select
              name="measure"
              value={foodForm.measure}
              onChange={handleFoodFormChange}
              style={styles.select}
            >
              <option value="g">Grams</option>
              <option value="cup">Cup</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={loadingCalculate}
          style={{ ...styles.calcBtn, opacity: loadingCalculate ? 0.7 : 1 }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 16, height: 16 }}>
            <rect x="4" y="2" width="16" height="20" rx="2" />
            <line x1="8" y1="6" x2="16" y2="6" />
            <line x1="8" y1="10" x2="16" y2="10" />
            <line x1="8" y1="14" x2="11" y2="14" />
          </svg>
          {loadingCalculate ? "Calculating..." : "Calculate Nutrition"}
        </button>
      </form>

      {/* Calculated Result */}
      {calculatedFood && (
        <>
          <div style={styles.divider} />
          <div style={styles.calcResult}>
            <div style={styles.calcResultTitle}>
              <svg viewBox="0 0 24 24" fill="#F97316" style={{ width: 16, height: 16 }}>
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
              </svg>
              Calculated Nutrition — {foodForm.quantity}{foodForm.measure} of {foodForm.food}
            </div>

            <div style={styles.calcGrid}>
              {[
                { label: "Calories", value: calculatedFood.calories, unit: "", highlight: true },
                { label: "Protein", value: calculatedFood.proteinG, unit: "g" },
                { label: "Carbs", value: calculatedFood.carbsG, unit: "g" },
                { label: "Fat", value: calculatedFood.fatG, unit: "g" },
                { label: "Sugar", value: calculatedFood.sugarG || 0, unit: "g" },
                { label: "Sat Fat", value: calculatedFood.satFatG || 0, unit: "g" },
              ].map((item) => (
                <div
                  key={item.label}
                  style={{
                    ...styles.calcItem,
                    ...(item.highlight ? styles.calcItemHighlight : {}),
                  }}
                >
                  <div
                    style={{
                      ...styles.calcItemVal,
                      ...(item.highlight ? { color: "#F97316" } : {}),
                    }}
                  >
                    {item.value}
                    <span style={styles.calcItemUnit}>{item.unit}</span>
                  </div>
                  <div style={styles.calcItemLabel}>{item.label}</div>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={handleAddIntake}
              disabled={loadingAdd}
              style={{ ...styles.addBtn, opacity: loadingAdd ? 0.7 : 1 }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 16, height: 16 }}>
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              {loadingAdd ? "Adding..." : "Add to Today's Intake"}
            </button>
          </div>
        </>
      )}

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
  searchRow: {
    display: "flex",
    gap: 10,
    marginBottom: 16,
  },
  searchIcon: {
    position: "absolute",
    left: 13,
    top: "50%",
    transform: "translateY(-50%)",
    width: 16,
    height: 16,
    pointerEvents: "none",
  },
  searchInput: {
    background: "#FAFAF9",
    border: "1.5px solid #E7E5E4",
    borderRadius: 10,
    padding: "11px 14px 11px 38px",
    fontSize: 14,
    color: "#1C1917",
    outline: "none",
    fontFamily: "inherit",
    transition: "border 0.15s",
    width: "100%",
    boxSizing: "border-box",
  },
  searchBtn: {
    background: "#F97316",
    color: "white",
    border: "none",
    borderRadius: 10,
    padding: "11px 20px",
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: "inherit",
    whiteSpace: "nowrap",
    display: "flex",
    alignItems: "center",
    gap: 7,
  },
  resultsBox: {
    background: "#FFF7ED",
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  resultsLabel: {
    fontSize: 11,
    fontWeight: 700,
    color: "#A8A29E",
    letterSpacing: "0.07em",
    textTransform: "uppercase",
    marginBottom: 10,
  },
  resultItem: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    background: "white",
    borderRadius: 9,
    padding: "10px 13px",
    marginBottom: 7,
    cursor: "pointer",
    border: "1px solid transparent",
    width: "100%",
    textAlign: "left",
    fontFamily: "inherit",
    transition: "border 0.15s",
  },
  resultItemActive: {
    borderColor: "#F97316",
    background: "#FFF7ED",
  },
  resultName: {
    fontSize: 13,
    fontWeight: 600,
    color: "#1C1917",
  },
  resultCal: {
    fontSize: 12,
    color: "#78716C",
    background: "#F5F5F4",
    padding: "3px 9px",
    borderRadius: 6,
    fontWeight: 600,
  },
  resultCalActive: {
    background: "#F97316",
    color: "white",
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: 700,
    color: "#A8A29E",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    marginBottom: 12,
  },
  calcRow: {
    display: "grid",
    gridTemplateColumns: "2fr 1fr 1fr",
    gap: 12,
    marginBottom: 12,
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
  calcBtn: {
    width: "100%",
    background: "transparent",
    color: "#78716C",
    border: "1.5px solid #E7E5E4",
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
  divider: {
    height: 1,
    background: "#F5F5F4",
    margin: "18px 0",
  },
  calcResult: {
    background: "#FFF7ED",
    borderRadius: 14,
    padding: 16,
    border: "2px solid #FFEDD5",
  },
  calcResultTitle: {
    fontSize: 13,
    fontWeight: 700,
    color: "#1C1917",
    marginBottom: 12,
    display: "flex",
    alignItems: "center",
    gap: 7,
  },
  calcGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: 8,
  },
  calcItem: {
    background: "white",
    borderRadius: 10,
    padding: 10,
    textAlign: "center",
    border: "1px solid #E7E5E4",
  },
  calcItemHighlight: {
    borderColor: "#FED7AA",
    background: "#FFF7ED",
  },
  calcItemVal: {
    fontFamily: "'Sora', 'Inter', sans-serif",
    fontSize: 16,
    fontWeight: 700,
    color: "#1C1917",
  },
  calcItemUnit: {
    fontSize: 12,
    fontWeight: 400,
    color: "#78716C",
    marginLeft: 2,
  },
  calcItemLabel: {
    fontSize: 10,
    color: "#A8A29E",
    marginTop: 2,
  },
  addBtn: {
    width: "100%",
    background: "#F97316",
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
    marginTop: 14,
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