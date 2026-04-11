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

      const response = existingTargets ? await updateMyTargets(payload) : await saveTargets(payload);

      setMessage(response?.message || "Targets saved successfully");
      if (onSaved) onSaved();
    } catch (err) {
      setError(err.message || "Failed to save targets");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-2xl bg-white p-6 shadow-lg">
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Nutrition Target Form</h2>
        <p className="mt-1 text-sm text-gray-500">Enter your details to save your nutrition targets.</p>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Age</label>
          <input
            type="number"
            name="age"
            value={form.age}
            onChange={handleChange}
            className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-orange-400"
            required
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Gender</label>
          <select
            name="gender"
            value={form.gender}
            onChange={handleChange}
            className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-orange-400"
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Height (cm)</label>
          <input
            type="number"
            name="heightCm"
            value={form.heightCm}
            onChange={handleChange}
            className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-orange-400"
            required
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Weight (kg)</label>
          <input
            type="number"
            name="weightKg"
            value={form.weightKg}
            onChange={handleChange}
            className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-orange-400"
            required
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Activity Level</label>
          <select
            name="activityLevel"
            value={form.activityLevel}
            onChange={handleChange}
            className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-orange-400"
          >
            <option value="sedentary">Sedentary</option>
            <option value="light">Light</option>
            <option value="moderate">Moderate</option>
            <option value="active">Active</option>
            <option value="very_active">Very Active</option>
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Goal</label>
          <select
            name="goal"
            value={form.goal}
            onChange={handleChange}
            className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-orange-400"
          >
            <option value="lose">Lose</option>
            <option value="maintain">Maintain</option>
            <option value="gain">Gain</option>
          </select>
        </div>

        <div className="md:col-span-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 px-4 py-3 font-semibold text-white shadow-md transition hover:opacity-95 disabled:opacity-70"
          >
            {loading ? "Saving..." : existingTargets ? "Update Targets" : "Save Targets"}
          </button>
        </div>
      </form>

      {message ? <p className="mt-4 text-sm font-medium text-green-600">{message}</p> : null}
      {error ? <p className="mt-4 text-sm font-medium text-red-600">{error}</p> : null}
    </div>
  );
}