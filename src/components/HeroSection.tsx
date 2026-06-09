import { AlertTriangle, CheckCircle2, Clock, FileSearch } from "lucide-react";
import { summaryStats } from "../data/auditData";

export function HeroSection() {
  const auditDate = "June 2025";

  return (
    <section className="relative overflow-hidden bg-gray-950 border-b border-gray-800">
      {/* Background grid */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(139,92,246,0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(139,92,246,0.5) 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Gradient orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-purple-600/8 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        <div className="max-w-4xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-violet-950/60 border border-violet-700/40 rounded-full px-4 py-1.5 mb-6">
            <FileSearch size={13} className="text-violet-400" />
            <span className="text-violet-300 text-xs font-semibold tracking-wider uppercase">
              Comprehensive Repository Audit
            </span>
          </div>

          {/* Title */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight mb-4 tracking-tight">
            Pulse Android
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-purple-400 to-fuchsia-400">
              Audit & Refactoring
            </span>
          </h1>

          <p className="text-lg text-gray-300 max-w-2xl mb-8 leading-relaxed">
            A comprehensive review of the{" "}
            <a
              href="https://github.com/LIN4CRE/Pulse"
              target="_blank"
              rel="noopener noreferrer"
              className="text-violet-400 hover:text-violet-300 underline underline-offset-2 font-medium"
            >
              LIN4CRE/Pulse
            </a>{" "}
            Android repository — identifying, documenting, and resolving all known defects, architectural
            inconsistencies, security vulnerabilities, and code quality issues. Every finding is tracked from
            discovery to resolution.
          </p>

          {/* Meta info */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 mb-12">
            <div className="flex items-center gap-2">
              <Clock size={14} />
              <span>Audit Date: {auditDate}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">•</div>
            <div className="flex items-center gap-2">
              <span>Language: Kotlin 100%</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">•</div>
            <div className="flex items-center gap-2">
              <span>Framework: Jetpack Compose + MVVM</span>
            </div>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <StatCard
              label="Total Findings"
              value={summaryStats.totalFindings}
              color="violet"
              icon={<FileSearch size={14} />}
            />
            <StatCard
              label="Critical"
              value={summaryStats.critical}
              color="red"
              icon={<AlertTriangle size={14} />}
            />
            <StatCard
              label="High"
              value={summaryStats.high}
              color="orange"
            />
            <StatCard
              label="Medium"
              value={summaryStats.medium}
              color="amber"
            />
            <StatCard
              label="Low / Info"
              value={summaryStats.low + summaryStats.info}
              color="blue"
            />
            <StatCard
              label="All Resolved"
              value="100%"
              color="emerald"
              icon={<CheckCircle2 size={14} />}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function StatCard({
  label,
  value,
  color,
  icon,
}: {
  label: string;
  value: number | string;
  color: string;
  icon?: React.ReactNode;
}) {
  const colorMap: Record<string, string> = {
    violet: "border-violet-500/30 bg-violet-950/30 text-violet-300",
    red: "border-red-500/30 bg-red-950/30 text-red-300",
    orange: "border-orange-500/30 bg-orange-950/30 text-orange-300",
    amber: "border-amber-500/30 bg-amber-950/30 text-amber-300",
    blue: "border-blue-500/30 bg-blue-950/30 text-blue-300",
    emerald: "border-emerald-500/30 bg-emerald-950/30 text-emerald-300",
  };

  return (
    <div className={`rounded-xl border p-4 ${colorMap[color]}`}>
      <div className="flex items-center gap-1.5 mb-2 opacity-70">
        {icon}
        <span className="text-xs font-medium uppercase tracking-wider">{label}</span>
      </div>
      <div className="text-2xl font-black">{value}</div>
    </div>
  );
}
