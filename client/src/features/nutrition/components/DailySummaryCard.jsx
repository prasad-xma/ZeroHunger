// client/src/features/nutrition/components/DailySummaryCard.jsx

import ProgressBar from "./ProgressBar";

export default function DailySummaryCard({ summary }) {
  const intake = summary?.intake || {};
  const targets = summary?.targets || {};
  const percentages = summary?.percentages || {};

  return (
    <div className="rounded-2xl bg-white p-6 shadow-lg">
      <h2 className="text-xl font-semibold text-gray-800">Daily Summary</h2>
      <p className="mt-1 text-sm text-gray-500">Today's intake compared with your latest targets.</p>

      <div className="mt-5 space-y-5">
        <ProgressBar
          label="Calories"
          value={intake.calories || 0}
          target={targets.tdeeCalories || 0}
          percent={percentages.calories || 0}
        />

        <ProgressBar
          label="Protein"
          value={intake.proteinG || 0}
          target={targets.proteinG || 0}
          percent={percentages.protein || 0}
          unit="g"
        />

        <ProgressBar
          label="Carbs"
          value={intake.carbsG || 0}
          target={targets.carbsG || 0}
          percent={percentages.carbs || 0}
          unit="g"
        />

        <ProgressBar
          label="Fat"
          value={intake.fatG || 0}
          target={targets.fatG || 0}
          percent={percentages.fat || 0}
          unit="g"
        />
      </div>
    </div>
  );
}