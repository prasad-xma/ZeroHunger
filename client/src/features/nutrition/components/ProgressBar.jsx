// client/src/features/nutrition/components/ProgressBar.jsx

export default function ProgressBar({ label, value = 0, target = 0, percent = 0, unit = "" }) {
  const safePercent = Math.max(0, Math.min(percent, 100));

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-gray-700">{label}</span>
        <span className="text-gray-600">
          {value}
          {unit} / {target}
          {unit} ({percent}%)
        </span>
      </div>

      <div className="h-3 w-full overflow-hidden rounded-full bg-orange-100">
        <div
          className="h-full rounded-full bg-gradient-to-r from-orange-400 to-orange-600 transition-all duration-300"
          style={{ width: `${safePercent}%` }}
        />
      </div>
    </div>
  );
}