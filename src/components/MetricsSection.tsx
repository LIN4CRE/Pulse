import { TrendingDown, TrendingUp, BarChart3 } from "lucide-react";
import { metrics } from "../data/auditData";

export function MetricsSection() {
  return (
    <section id="metrics" className="bg-gray-900/40 border-y border-gray-800 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-950/60 border border-emerald-800/40">
              <BarChart3 size={15} className="text-emerald-400" />
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Quality Metrics</h2>
          </div>
          <p className="text-gray-400 max-w-2xl">
            Measurable improvements across security, build reliability, performance, and code quality
            resulting from the audit and refactoring effort.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {metrics.map((metric) => (
            <MetricCard key={metric.label} metric={metric} />
          ))}
        </div>
      </div>
    </section>
  );
}

function MetricCard({ metric }: { metric: (typeof metrics)[number] }) {
  const improved = metric.positive
    ? metric.label === "Critical Issues Resolved" ||
      metric.label === "High Severity Issues Resolved" ||
      metric.label === "Security Vulnerabilities" ||
      metric.label === "Unused/Dead Dependencies" ||
      metric.label === "Version Catalog Entries"
      ? metric.after < metric.before
      : metric.after > metric.before
    : false;

  const Arrow = improved ? TrendingUp : TrendingDown;
  const arrowColor = improved ? "text-emerald-400" : "text-red-400";

  // Is this a "lower is better" metric?
  const lowerIsBetter =
    metric.label === "Critical Issues Resolved" ||
    metric.label === "High Severity Issues Resolved" ||
    metric.label === "Security Vulnerabilities" ||
    metric.label === "Unused/Dead Dependencies" ||
    metric.label === "Version Catalog Entries";

  const change = metric.after - metric.before;
  const changePrefix = change > 0 ? "+" : "";
  const changeLabel = `${changePrefix}${change}${metric.unit ?? ""}`;
  const isPositiveChange = lowerIsBetter ? change < 0 : change > 0;

  return (
    <div className="bg-gray-950/60 border border-gray-800/60 rounded-xl p-5 hover:border-gray-700/60 transition-colors">
      <div className="flex items-start justify-between mb-4">
        <span className="text-xs text-gray-400 font-medium leading-tight max-w-[130px]">{metric.label}</span>
        <Arrow size={14} className={arrowColor} />
      </div>

      {/* Before → After */}
      <div className="flex items-end gap-2 mb-3">
        <div className="text-center">
          <div className="text-lg font-bold text-gray-500 line-through">
            {metric.before}
            {metric.unit}
          </div>
          <div className="text-xs text-gray-600 mt-0.5">Before</div>
        </div>
        <div className="text-gray-600 mb-4">→</div>
        <div className="text-center">
          <div className="text-2xl font-black text-white">
            {metric.after}
            {metric.unit}
          </div>
          <div className="text-xs text-gray-500 mt-0.5">After</div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-3">
        <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
          {lowerIsBetter ? (
            <div
              className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full transition-all"
              style={{
                width: metric.before === 0 ? "100%" : `${((metric.before - metric.after) / metric.before) * 100}%`,
              }}
            />
          ) : (
            <div
              className="h-full bg-gradient-to-r from-violet-600 to-violet-400 rounded-full transition-all"
              style={{
                width: metric.before === 0 && metric.after > 0
                  ? "100%"
                  : metric.after === 0
                  ? "0%"
                  : `${Math.min((metric.after / Math.max(metric.before, metric.after)) * 100, 100)}%`,
              }}
            />
          )}
        </div>
      </div>

      {/* Change badge */}
      <div
        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold ${
          isPositiveChange
            ? "bg-emerald-950/60 text-emerald-400 border border-emerald-800/40"
            : "bg-red-950/60 text-red-400 border border-red-800/40"
        }`}
      >
        {changeLabel} • {metric.improvement}
      </div>
    </div>
  );
}
