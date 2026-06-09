import { useState } from 'react';
import { AlertTriangle, CheckCircle, ChevronDown, ChevronUp, Bug, Wrench, Zap } from 'lucide-react';

interface Issue {
  id: number;
  severity: 'critical' | 'major' | 'improvement';
  title: string;
  file: string;
  description: string;
  problem: string;
  solution: string;
}

const issues: Issue[] = [
  {
    id: 1,
    severity: 'critical',
    title: 'GitHub Actions: JDK version incompatible with AGP 9.1.1',
    file: '.github/workflows/android-build.yml',
    description: 'Your build.gradle uses AGP 9.1.1 which requires JDK 21, but the workflow uses JDK 17.',
    problem: 'AGP 9.x requires JDK 21 minimum. The CI build will fail with compilation errors.',
    solution: 'Updated to JDK 21 with Temurin distribution and upgraded all actions to v4.',
  },
  {
    id: 2,
    severity: 'critical',
    title: 'Missing debug.keystore in CI environment',
    file: '.github/workflows/android-build.yml',
    description: 'The debug build type references a debug.keystore file that doesn\'t exist in CI.',
    problem: 'Build fails with "Keystore file not found" because debug.keystore is not committed to repo.',
    solution: 'Added a step to generate a debug keystore before building, or use the default debug signing.',
  },
  {
    id: 3,
    severity: 'critical',
    title: 'Missing .env file causes Secrets plugin failure',
    file: 'app/build.gradle.kts',
    description: 'The Secrets Gradle Plugin expects a .env file, which doesn\'t exist in CI.',
    problem: 'Build fails with "Could not read .env" since the secrets plugin requires it.',
    solution: 'Added a CI step to copy .env.example to .env before building.',
  },
  {
    id: 4,
    severity: 'major',
    title: 'DashboardScreen SensorCard composable has truncated code',
    file: 'app/src/main/java/com/example/ui/DashboardScreen.kt',
    description: 'The SensorCard composable has incomplete conditional expressions and missing closing braces.',
    problem: 'Conditions like `it > 30f || it` and `it` are truncated, causing compile errors. The comparison operators (<) were likely stripped out.',
    solution: 'Fixed all truncated conditions: temperature (>30 or <10), humidity (>65), pressure (<1000 or >1050).',
  },
  {
    id: 5,
    severity: 'major',
    title: 'Missing Type.kt typography file',
    file: 'app/src/main/java/com/example/ui/theme/Type.kt',
    description: 'Theme.kt references a `Typography` variable but the Type.kt file is missing from the repo.',
    problem: 'Compilation fails because the Typography object is undefined.',
    solution: 'Created a proper Type.kt with Material 3 typography defaults.',
  },
  {
    id: 6,
    severity: 'improvement',
    title: 'GitHub Actions: Upload release APK and create GitHub Release',
    file: '.github/workflows/android-build.yml',
    description: 'The current workflow only builds a debug APK and uploads as artifact.',
    problem: 'No automatic release creation or signed APK generation.',
    solution: 'Added release build with tag-based triggering and automatic GitHub Release creation.',
  },
  {
    id: 7,
    severity: 'improvement',
    title: 'Add Gradle caching for faster CI builds',
    file: '.github/workflows/android-build.yml',
    description: 'Builds download all dependencies every time.',
    problem: 'CI builds are slow because Gradle dependencies are not cached between runs.',
    solution: 'Added proper Gradle caching with setup-java cache parameter and explicit cache step.',
  },
  {
    id: 8,
    severity: 'improvement',
    title: 'RetrofitClient creates new instances on every poll',
    file: 'app/src/main/java/com/example/api/RetrofitClient.kt',
    description: 'Each poll cycle creates a new Retrofit instance for the same URL.',
    problem: 'Unnecessary object creation and potential memory overhead.',
    solution: 'Added a URL-based cache so the same Retrofit instance is reused for the same base URL.',
  },
];

const severityConfig = {
  critical: { icon: Bug, color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20', label: 'Critical' },
  major: { icon: AlertTriangle, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20', label: 'Major' },
  improvement: { icon: Zap, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20', label: 'Enhancement' },
};

function IssueCard({ issue }: { issue: Issue }) {
  const [expanded, setExpanded] = useState(false);
  const config = severityConfig[issue.severity];
  const SeverityIcon = config.icon;

  return (
    <div className={`rounded-2xl border ${config.border} bg-white/[0.02] overflow-hidden transition-all duration-300`}>
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-start gap-4 p-6 text-left hover:bg-white/[0.02] transition-colors"
      >
        <div className={`w-10 h-10 rounded-xl ${config.bg} flex items-center justify-center shrink-0 mt-0.5`}>
          <SeverityIcon className={`w-5 h-5 ${config.color}`} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-xs font-bold uppercase tracking-wider ${config.color}`}>{config.label}</span>
          </div>
          <h3 className="text-white font-semibold text-lg mb-1">{issue.title}</h3>
          <p className="text-white/30 text-sm font-mono">{issue.file}</p>
        </div>
        <div className="shrink-0 mt-2">
          {expanded ? (
            <ChevronUp className="w-5 h-5 text-white/30" />
          ) : (
            <ChevronDown className="w-5 h-5 text-white/30" />
          )}
        </div>
      </button>

      {expanded && (
        <div className="px-6 pb-6 space-y-4 border-t border-white/5 pt-4 ml-14">
          <p className="text-white/50 text-sm">{issue.description}</p>
          <div className="flex items-start gap-3 p-4 rounded-xl bg-red-500/5 border border-red-500/10">
            <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <div>
              <span className="text-xs font-bold text-red-400 uppercase tracking-wider">Problem</span>
              <p className="text-white/50 text-sm mt-1">{issue.problem}</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Solution</span>
              <p className="text-white/50 text-sm mt-1">{issue.solution}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function IssuesSection() {
  const criticalCount = issues.filter(i => i.severity === 'critical').length;
  const majorCount = issues.filter(i => i.severity === 'major').length;
  const improvementCount = issues.filter(i => i.severity === 'improvement').length;

  return (
    <section id="issues" className="py-32 relative">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm font-medium mb-6">
            <Wrench className="w-4 h-4" />
            Issues Found & Fixed
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="text-white">{issues.length} issues</span>
            <span className="text-white/40"> identified</span>
          </h2>
          <p className="text-lg text-white/40 max-w-2xl mx-auto mb-8">
            A thorough review of your codebase revealed these issues preventing clean builds and optimal performance.
          </p>

          {/* Stats */}
          <div className="flex items-center justify-center gap-6 flex-wrap">
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/20">
              <Bug className="w-4 h-4 text-red-400" />
              <span className="text-red-400 font-bold">{criticalCount}</span>
              <span className="text-red-400/60 text-sm">Critical</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/10 border border-amber-500/20">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span className="text-amber-400 font-bold">{majorCount}</span>
              <span className="text-amber-400/60 text-sm">Major</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-500/10 border border-blue-500/20">
              <Zap className="w-4 h-4 text-blue-400" />
              <span className="text-blue-400 font-bold">{improvementCount}</span>
              <span className="text-blue-400/60 text-sm">Enhancements</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {issues.map((issue) => (
            <IssueCard key={issue.id} issue={issue} />
          ))}
        </div>
      </div>
    </section>
  );
}
