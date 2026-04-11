// client/src/features/nutrition/components/WeeklySummaryCard.jsx

export default function WeeklySummaryCard({ weeklySummary = [] }) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-lg">
      <h2 className="text-xl font-semibold text-gray-800">Weekly Summary</h2>
      <p className="mt-1 text-sm text-gray-500">Last 7 days intake totals for chart-ready data.</p>

      <div className="mt-5 space-y-3">
        {weeklySummary.length > 0 ? (
          weeklySummary.map((item) => (
            <div
              key={item.dateKey}
              className="grid grid-cols-2 gap-3 rounded-xl bg-orange-50 px-4 py-3 text-sm md:grid-cols-4"
            >
              <div>
                <p className="text-xs text-gray-500">Date</p>
                <p className="font-semibold text-gray-800">{item.dateKey}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Calories</p>
                <p className="font-semibold text-gray-800">{item.calories}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Protein</p>
                <p className="font-semibold text-gray-800">{item.proteinG} g</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Carbs</p>
                <p className="font-semibold text-gray-800">{item.carbsG} g</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-500">No weekly data available.</p>
        )}
      </div>
    </div>
  );
}