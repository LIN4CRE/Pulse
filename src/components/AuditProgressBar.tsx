import { summaryStats } from "../data/auditData";

export function AuditProgressBar() {
  const total = summaryStats.totalFindings;
  const resolved =
    summaryStats.fixed + summaryStats.refactored + summaryStats.removed + summaryStats.added;
  const pct = Math.round((resolved / total) * 100);

  return (
    <div className="bg-gray-900 border-b border-gray-800/60 px-4 py-2">
      <div className="max-w-7xl mx-auto flex items-center gap-4">
        <span className="text-xs text-gray-400 font-medium flex-shrink-0">
          Audit Progress
        </span>
        <div className="flex-1 h-1.5 bg-gray-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-violet-500 to-emerald-500 rounded-full transition-all"
            style={{ width: `${pct}%` }}
          />
        </div>
        <span className="text-xs font-bold text-emerald-400 flex-shrink-0">
          {resolved}/{total} resolved ({pct}%)
        </span>
        <div className="hidden sm:flex items-center gap-3 flex-shrink-0 text-xs">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-500" />
            <span className="text-gray-500">{summaryStats.critical} Critical</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-orange-500" />
            <span className="text-gray-500">{summaryStats.high} High</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <span className="text-gray-500">{summaryStats.medium} Medium</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-blue-500" />
            <span className="text-gray-500">{summaryStats.low + summaryStats.info} Low/Info</span>
          </span>
        </div>
      </div>
    </div>
  );
}
