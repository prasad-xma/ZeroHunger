// client/src/features/nutrition/components/IntakeListCard.jsx

export default function IntakeListCard({ summary }) {
  const intake = summary?.intake || {};

  const items = [
    { label: "Calories", value: intake.calories || 0, unit: "" },
    { label: "Protein", value: intake.proteinG || 0, unit: " g" },
    { label: "Carbs", value: intake.carbsG || 0, unit: " g" },
    { label: "Fat", value: intake.fatG || 0, unit: " g" },
    { label: "Sugar", value: intake.sugarG || 0, unit: " g" },
    { label: "Sat Fat", value: intake.satFatG || 0, unit: " g" },
  ];

  return (
    <div className="rounded-2xl bg-white p-6 shadow-lg">
      <h2 className="text-xl font-semibold text-gray-800">Today's Intake List</h2>
      <p className="mt-1 text-sm text-gray-500">Current totals saved for today.</p>

      <div className="mt-5 space-y-3">
        {items.map((item) => (
          <div
            key={item.label}
            className="flex items-center justify-between rounded-xl bg-orange-50 px-4 py-3"
          >
            <span className="font-medium text-gray-700">{item.label}</span>
            <span className="font-semibold text-gray-800">
              {item.value}
              {item.unit}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}