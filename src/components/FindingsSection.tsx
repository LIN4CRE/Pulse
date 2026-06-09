import { useState } from "react";
import { ChevronDown, ChevronRight, FileCode, Zap } from "lucide-react";
import { findings, type Finding, type Severity } from "../data/auditData";
import { SeverityBadge, StatusBadge, CategoryBadge } from "./SeverityBadge";
import { CodeBlock } from "./CodeBlock";

const SEVERITY_ORDER: Severity[] = ["critical", "high", "medium", "low", "info"];

export function FindingsSection() {
  const [filter, setFilter] = useState<Severity | "all">("all");
  const [expandedId, setExpandedId] = useState<string | null>("C-001");

  const filtered =
    filter === "all"
      ? [...findings].sort(
          (a, b) => SEVERITY_ORDER.indexOf(a.severity) - SEVERITY_ORDER.indexOf(b.severity)
        )
      : findings.filter((f) => f.severity === filter);

  const filterCounts: Record<string, number> = {
    all: findings.length,
    critical: findings.filter((f) => f.severity === "critical").length,
    high: findings.filter((f) => f.severity === "high").length,
    medium: findings.filter((f) => f.severity === "medium").length,
    low: findings.filter((f) => f.severity === "low").length,
    info: findings.filter((f) => f.severity === "info").length,
  };

  return (
    <section id="findings" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-red-950/60 border border-red-800/40">
            <Zap size={15} className="text-red-400" />
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Audit Findings</h2>
        </div>
        <p className="text-gray-400 max-w-2xl">
          Every defect, vulnerability, and code quality issue discovered during the audit, with before/after
          code comparisons and documented impact. All findings have been resolved.
        </p>
      </div>

      {/* Filter bar */}
      <div className="flex flex-wrap gap-2 mb-8">
        {(["all", "critical", "high", "medium", "low", "info"] as const).map((sev) => (
          <FilterButton
            key={sev}
            label={sev === "all" ? "All" : sev.charAt(0).toUpperCase() + sev.slice(1)}
            count={filterCounts[sev]}
            active={filter === sev}
            severity={sev}
            onClick={() => setFilter(sev)}
          />
        ))}
      </div>

      {/* Findings list */}
      <div className="space-y-3">
        {filtered.map((finding) => (
          <FindingCard
            key={finding.id}
            finding={finding}
            expanded={expandedId === finding.id}
            onToggle={() => setExpandedId(expandedId === finding.id ? null : finding.id)}
          />
        ))}
      </div>
    </section>
  );
}

function FilterButton({
  label,
  count,
  active,
  severity,
  onClick,
}: {
  label: string;
  count: number;
  active: boolean;
  severity: string;
  onClick: () => void;
}) {
  const activeColors: Record<string, string> = {
    all: "bg-violet-700 border-violet-600 text-white",
    critical: "bg-red-700 border-red-600 text-white",
    high: "bg-orange-700 border-orange-600 text-white",
    medium: "bg-amber-700 border-amber-600 text-white",
    low: "bg-blue-700 border-blue-600 text-white",
    info: "bg-gray-600 border-gray-500 text-white",
  };

  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg border text-sm font-medium transition-all ${
        active
          ? activeColors[severity]
          : "border-gray-700/60 text-gray-400 hover:text-gray-200 hover:border-gray-600 bg-gray-900/40"
      }`}
    >
      {label}
      <span
        className={`text-xs px-1.5 py-0.5 rounded font-bold ${
          active ? "bg-white/20 text-white" : "bg-gray-800 text-gray-400"
        }`}
      >
        {count}
      </span>
    </button>
  );
}

function FindingCard({
  finding,
  expanded,
  onToggle,
}: {
  finding: Finding;
  expanded: boolean;
  onToggle: () => void;
}) {
  const severityLeft: Record<string, string> = {
    critical: "border-l-red-500",
    high: "border-l-orange-500",
    medium: "border-l-amber-500",
    low: "border-l-blue-500",
    info: "border-l-gray-500",
  };

  return (
    <div
      className={`bg-gray-900/60 border border-gray-800/60 border-l-4 ${severityLeft[finding.severity]} rounded-xl overflow-hidden transition-all duration-200`}
    >
      {/* Card header — always visible */}
      <button
        className="w-full text-left px-5 py-4 flex items-start gap-4 hover:bg-gray-800/30 transition-colors group"
        onClick={onToggle}
      >
        <div className="flex-shrink-0 mt-0.5">
          {expanded ? (
            <ChevronDown size={16} className="text-gray-400 group-hover:text-gray-200 transition-colors" />
          ) : (
            <ChevronRight size={16} className="text-gray-400 group-hover:text-gray-200 transition-colors" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="text-xs text-gray-500 font-mono font-semibold">{finding.id}</span>
            <SeverityBadge severity={finding.severity} />
            <StatusBadge status={finding.status} />
            <CategoryBadge category={finding.category} />
          </div>
          <h3 className="text-sm font-semibold text-gray-100 leading-snug">{finding.title}</h3>
          <div className="flex items-center gap-1.5 mt-1.5">
            <FileCode size={11} className="text-gray-500 flex-shrink-0" />
            <span className="text-xs text-gray-500 font-mono truncate">{finding.file}</span>
          </div>
        </div>
      </button>

      {/* Expanded content */}
      {expanded && (
        <div className="px-5 pb-5 space-y-5 border-t border-gray-800/60">
          {/* Description */}
          <div className="pt-4">
            <p className="text-sm text-gray-300 leading-relaxed">{finding.description}</p>
          </div>

          {/* Code diff */}
          <div className="grid sm:grid-cols-2 gap-3">
            <CodeBlock code={finding.before} label="Before (Defective)" variant="before" />
            <CodeBlock code={finding.after} label="After (Resolved)" variant="after" />
          </div>

          {/* Impact */}
          <div className="flex items-start gap-3 bg-emerald-950/20 border border-emerald-900/30 rounded-lg px-4 py-3">
            <div className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2" />
            <div>
              <span className="text-xs text-emerald-400 font-semibold uppercase tracking-wider">
                Resolution Impact
              </span>
              <p className="text-sm text-gray-300 mt-0.5">{finding.impact}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
