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
    <div className="rounded-2xl bg-white p-6 shadow-lg">
      <h2 className="text-xl font-semibold text-gray-800">Food Search + Calculate</h2>
      <p className="mt-1 text-sm text-gray-500">Search foods, calculate nutrition, and add to today's intake.</p>

      <form onSubmit={handleSearch} className="mt-5 flex flex-col gap-3 md:flex-row">
        <input
          type="text"
          placeholder="Search food like chicken breast"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-orange-400"
          required
        />
        <button
          type="submit"
          disabled={loadingSearch}
          className="rounded-xl bg-orange-500 px-5 py-3 font-semibold text-white shadow-md hover:bg-orange-600 disabled:opacity-70"
        >
          {loadingSearch ? "Searching..." : "Search"}
        </button>
      </form>

      {searchResults.length > 0 ? (
        <div className="mt-5 rounded-xl bg-orange-50 p-4">
          <h3 className="mb-3 text-sm font-semibold text-gray-700">Search Results</h3>
          <div className="space-y-2">
            {searchResults.slice(0, 5).map((item, index) => (
              <button
                key={`${item.name || "food"}-${index}`}
                type="button"
                onClick={() => setFoodForm((prev) => ({ ...prev, food: item.name || "" }))}
                className="flex w-full items-center justify-between rounded-lg bg-white px-3 py-2 text-left text-sm shadow-sm transition hover:bg-orange-100"
              >
                <span className="font-medium text-gray-700">{item.name || "Unknown food"}</span>
                <span className="text-gray-500">{Math.round(Number(item.calories || 0))} kcal</span>
              </button>
            ))}
          </div>
        </div>
      ) : null}

      <form onSubmit={handleCalculate} className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="md:col-span-1">
          <label className="mb-1 block text-sm font-medium text-gray-700">Food</label>
          <input
            type="text"
            name="food"
            value={foodForm.food}
            onChange={handleFoodFormChange}
            className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-orange-400"
            placeholder="e.g. rice"
            required
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Quantity</label>
          <input
            type="number"
            name="quantity"
            value={foodForm.quantity}
            onChange={handleFoodFormChange}
            className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-orange-400"
            min="1"
            required
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Measure</label>
          <select
            name="measure"
            value={foodForm.measure}
            onChange={handleFoodFormChange}
            className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-orange-400"
          >
            <option value="g">Grams</option>
            <option value="cup">Cup</option>
          </select>
        </div>

        <div className="md:col-span-3">
          <button
            type="submit"
            disabled={loadingCalculate}
            className="w-full rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 px-4 py-3 font-semibold text-white shadow-md transition hover:opacity-95 disabled:opacity-70"
          >
            {loadingCalculate ? "Calculating..." : "Calculate Nutrition"}
          </button>
        </div>
      </form>

      {calculatedFood ? (
        <div className="mt-5 rounded-2xl bg-orange-50 p-4">
          <h3 className="text-lg font-semibold text-gray-800">Calculated Food Nutrition</h3>

          <div className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-3">
            <div className="rounded-xl bg-white p-3 shadow-sm">
              <p className="text-xs text-gray-500">Calories</p>
              <p className="text-lg font-semibold text-gray-800">{calculatedFood.calories}</p>
            </div>
            <div className="rounded-xl bg-white p-3 shadow-sm">
              <p className="text-xs text-gray-500">Protein</p>
              <p className="text-lg font-semibold text-gray-800">{calculatedFood.proteinG} g</p>
            </div>
            <div className="rounded-xl bg-white p-3 shadow-sm">
              <p className="text-xs text-gray-500">Carbs</p>
              <p className="text-lg font-semibold text-gray-800">{calculatedFood.carbsG} g</p>
            </div>
            <div className="rounded-xl bg-white p-3 shadow-sm">
              <p className="text-xs text-gray-500">Fat</p>
              <p className="text-lg font-semibold text-gray-800">{calculatedFood.fatG} g</p>
            </div>
            <div className="rounded-xl bg-white p-3 shadow-sm">
              <p className="text-xs text-gray-500">Sugar</p>
              <p className="text-lg font-semibold text-gray-800">{calculatedFood.sugarG || 0} g</p>
            </div>
            <div className="rounded-xl bg-white p-3 shadow-sm">
              <p className="text-xs text-gray-500">Sat Fat</p>
              <p className="text-lg font-semibold text-gray-800">{calculatedFood.satFatG || 0} g</p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleAddIntake}
            disabled={loadingAdd}
            className="mt-4 w-full rounded-xl bg-orange-600 px-4 py-3 font-semibold text-white shadow-md hover:bg-orange-700 disabled:opacity-70"
          >
            {loadingAdd ? "Adding..." : "Add Intake"}
          </button>
        </div>
      ) : null}

      {message ? <p className="mt-4 text-sm font-medium text-green-600">{message}</p> : null}
      {error ? <p className="mt-4 text-sm font-medium text-red-600">{error}</p> : null}
    </div>
  );
}