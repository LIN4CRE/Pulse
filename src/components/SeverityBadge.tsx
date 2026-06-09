import type { Severity, Status } from "../data/auditData";

export function SeverityBadge({ severity }: { severity: Severity }) {
  const map: Record<Severity, { label: string; className: string }> = {
    critical: {
      label: "CRITICAL",
      className: "bg-red-950/60 text-red-300 border border-red-700/50",
    },
    high: {
      label: "HIGH",
      className: "bg-orange-950/60 text-orange-300 border border-orange-700/50",
    },
    medium: {
      label: "MEDIUM",
      className: "bg-amber-950/60 text-amber-300 border border-amber-700/50",
    },
    low: {
      label: "LOW",
      className: "bg-blue-950/60 text-blue-300 border border-blue-700/50",
    },
    info: {
      label: "INFO",
      className: "bg-gray-800/60 text-gray-300 border border-gray-600/50",
    },
  };

  const { label, className } = map[severity];
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold tracking-widest ${className}`}>
      {label}
    </span>
  );
}

export function StatusBadge({ status }: { status: Status }) {
  const map: Record<Status, { label: string; className: string; dot: string }> = {
    fixed: {
      label: "Fixed",
      className: "bg-emerald-950/60 text-emerald-300 border border-emerald-700/50",
      dot: "bg-emerald-400",
    },
    refactored: {
      label: "Refactored",
      className: "bg-violet-950/60 text-violet-300 border border-violet-700/50",
      dot: "bg-violet-400",
    },
    removed: {
      label: "Removed",
      className: "bg-red-950/40 text-red-300 border border-red-800/40",
      dot: "bg-red-400",
    },
    added: {
      label: "Added",
      className: "bg-blue-950/60 text-blue-300 border border-blue-700/50",
      dot: "bg-blue-400",
    },
    optimized: {
      label: "Optimized",
      className: "bg-cyan-950/60 text-cyan-300 border border-cyan-700/50",
      dot: "bg-cyan-400",
    },
  };

  const { label, className, dot } = map[status];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-semibold ${className}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
      {label}
    </span>
  );
}

export function CategoryBadge({ category }: { category: string }) {
  const colorMap: Record<string, string> = {
    Security: "bg-red-950/40 text-red-400 border-red-800/40",
    Build: "bg-orange-950/40 text-orange-400 border-orange-800/40",
    Architecture: "bg-violet-950/40 text-violet-400 border-violet-800/40",
    Versioning: "bg-amber-950/40 text-amber-400 border-amber-800/40",
    "Code Quality": "bg-blue-950/40 text-blue-400 border-blue-800/40",
    Testing: "bg-emerald-950/40 text-emerald-400 border-emerald-800/40",
    Documentation: "bg-gray-800/60 text-gray-400 border-gray-700/40",
    "CI/CD": "bg-purple-950/40 text-purple-400 border-purple-800/40",
  };

  const className = colorMap[category] ?? "bg-gray-800/60 text-gray-400 border-gray-700/40";
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${className}`}>
      {category}
    </span>
  );
}
