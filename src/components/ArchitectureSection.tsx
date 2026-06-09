import { ArrowRight, CheckCircle2, Database, Globe, Layers, Smartphone, X } from "lucide-react";

interface ArchItem {
  layer: string;
  before: string[];
  after: string[];
  icon: React.ReactNode;
}

const architecture: ArchItem[] = [
  {
    layer: "Presentation Layer",
    icon: <Smartphone size={14} />,
    before: [
      "MutableStateFlow exposed publicly",
      "GlobalScope coroutines used",
      "Network calls in Activity",
      "No UiState sealed class",
    ],
    after: [
      "Read-only StateFlow exposed",
      "viewModelScope everywhere",
      "Clean ViewModel delegation",
      "UiState: Loading / Success / Error",
    ],
  },
  {
    layer: "Domain / ViewModel",
    icon: <Layers size={14} />,
    before: [
      "Direct Retrofit API calls",
      "No error handling",
      "Manual object instantiation",
      "No DI / no testability",
    ],
    after: [
      "Repository-abstracted calls",
      "runCatching + Result<T>",
      "ViewModelFactory with DI",
      "Fully unit-testable with fakes",
    ],
  },
  {
    layer: "Data / Repository",
    icon: <Database size={14} />,
    before: [
      "No repository layer exists",
      "Room accessed on main thread",
      "No fallback migration strategy",
      "Magic string DB names",
    ],
    after: [
      "SensorRepository interface + impl",
      "Dispatchers.IO for all DB calls",
      "fallbackToDestructiveMigration",
      "AppConstants.DATABASE_NAME",
    ],
  },
  {
    layer: "Network Layer",
    icon: <Globe size={14} />,
    before: [
      "OkHttp 4.10.0 (2022 — outdated)",
      "Logging in production builds",
      "object RetrofitClient singleton",
      "No timeout configuration",
    ],
    after: [
      "OkHttp 4.12.0 (current stable)",
      "Logging DEBUG-builds only",
      "Injected OkHttpClient factory",
      "15s connect / 30s read timeout",
    ],
  },
];

const refactoredFiles = [
  {
    path: "app/build.gradle.kts",
    changes: "compileSdk fix, minify enabled, R8 + shrinkResources, namespace corrected",
  },
  {
    path: "gradle/libs.versions.toml",
    changes: "AGP 8.10.1, Kotlin 2.1.21, KSP aligned, version deduplication, 11 versions removed",
  },
  {
    path: "app/proguard-rules.pro",
    changes: "Added Moshi, Retrofit, Room, OkHttp keep rules; source debug attributes preserved",
  },
  {
    path: "viewmodel/SensorViewModel.kt",
    changes: "MutableStateFlow encapsulated, GlobalScope removed, repository injected, UiState added",
  },
  {
    path: "data/SensorRepository.kt",
    changes: "Interface + Impl created, runCatching wrapping, Timber logging",
  },
  {
    path: "data/local/AppDatabase.kt",
    changes: "applicationContext used, migration strategy added, IO dispatcher enforced",
  },
  {
    path: "network/NetworkModule.kt",
    changes: "Logging interceptor wrapped in BuildConfig.DEBUG check, timeouts added",
  },
  {
    path: "discovery/NsdDiscoveryManager.kt",
    changes: "Empty error callbacks filled, retry logic with exponential backoff, onCleared cleanup",
  },
  {
    path: "AppConstants.kt",
    changes: "New file — centralized magic strings and numeric constants",
  },
  {
    path: "di/AppModule.kt",
    changes: "New file — manual DI container with lazy initialization",
  },
  {
    path: ".github/workflows/ci.yml",
    changes: "New file — PR quality gate workflow",
  },
  {
    path: ".github/workflows/release.yml",
    changes: "New file — tag-triggered signed release workflow",
  },
  {
    path: ".github/workflows/dependency-update.yml",
    changes: "New file — weekly automated dependency maintenance",
  },
  {
    path: ".editorconfig",
    changes: "New file — consistent code style across all editors",
  },
  {
    path: ".gitignore",
    changes: "Added .env, *.jks, *.keystore, local.properties, release/ directory entries",
  },
  {
    path: "README.md",
    changes: "Placeholder screenshots replaced, broken release URL fixed, architecture diagram added",
  },
  {
    path: ".env.example",
    changes: "New file — template for all required environment variables",
  },
  {
    path: ".github/CONTRIBUTING.md",
    changes: "New file — contributor guidelines and development setup",
  },
  {
    path: ".github/SECURITY.md",
    changes: "New file — vulnerability disclosure policy",
  },
  {
    path: ".github/PULL_REQUEST_TEMPLATE.md",
    changes: "New file — PR checklist template",
  },
];

export function ArchitectureSection() {
  return (
    <section id="architecture" className="bg-gray-900/40 border-y border-gray-800 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-violet-950/60 border border-violet-800/40">
              <Layers size={15} className="text-violet-400" />
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Architecture Refactoring</h2>
          </div>
          <p className="text-gray-400 max-w-2xl">
            Layer-by-layer architectural improvements enforcing Clean Architecture, MVVM with proper UDF, and
            testability throughout the Android application.
          </p>
        </div>

        {/* Architecture layers */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {architecture.map((item) => (
            <ArchCard key={item.layer} item={item} />
          ))}
        </div>

        {/* MVVM data flow diagram */}
        <div className="bg-gray-950/60 border border-gray-800/60 rounded-xl p-6 mb-12">
          <h3 className="text-sm font-bold text-white mb-6 text-center uppercase tracking-wider">
            Refactored MVVM Data Flow
          </h3>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 flex-wrap">
            {[
              { label: "UI / Compose", sub: "collectAsStateWithLifecycle()", color: "border-violet-700/50 bg-violet-950/30 text-violet-300" },
              { label: "ViewModel", sub: "StateFlow + viewModelScope", color: "border-blue-700/50 bg-blue-950/30 text-blue-300" },
              { label: "Repository", sub: "Interface + Result<T>", color: "border-emerald-700/50 bg-emerald-950/30 text-emerald-300" },
              { label: "Remote API", sub: "Retrofit + OkHttp", color: "border-orange-700/50 bg-orange-950/30 text-orange-300" },
              { label: "Local DB", sub: "Room + Dispatchers.IO", color: "border-amber-700/50 bg-amber-950/30 text-amber-300" },
            ].map((node, i, arr) => (
              <div key={node.label} className="flex items-center gap-3">
                <div className={`border rounded-xl px-4 py-3 text-center min-w-[130px] ${node.color}`}>
                  <div className="text-xs font-bold">{node.label}</div>
                  <div className="text-xs opacity-70 mt-0.5">{node.sub}</div>
                </div>
                {i < arr.length - 1 && (
                  <ArrowRight size={16} className="text-gray-600 flex-shrink-0" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Changed files table */}
        <div>
          <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
            <CheckCircle2 size={15} className="text-emerald-400" />
            All Modified / Created Files ({refactoredFiles.length})
          </h3>
          <div className="bg-gray-950/60 border border-gray-800/60 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-800/60">
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider w-1/3">
                      File
                    </th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Changes Applied
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {refactoredFiles.map((file, i) => (
                    <tr
                      key={file.path}
                      className={`border-b border-gray-800/30 last:border-0 hover:bg-gray-800/20 transition-colors ${
                        i % 2 === 0 ? "" : "bg-gray-900/20"
                      }`}
                    >
                      <td className="px-5 py-3">
                        <code className="text-xs text-violet-400 font-mono">{file.path}</code>
                      </td>
                      <td className="px-5 py-3 text-xs text-gray-300">{file.changes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ArchCard({ item }: { item: ArchItem }) {
  return (
    <div className="bg-gray-950/60 border border-gray-800/60 rounded-xl p-4 hover:border-gray-700/60 transition-colors">
      <div className="flex items-center gap-2 mb-4">
        <div className="flex items-center justify-center w-6 h-6 rounded bg-violet-950/60 border border-violet-800/40 text-violet-400">
          {item.icon}
        </div>
        <h3 className="text-xs font-bold text-white uppercase tracking-wide">{item.layer}</h3>
      </div>

      <div className="space-y-3">
        <div>
          <div className="flex items-center gap-1.5 mb-1.5">
            <X size={10} className="text-red-400" />
            <span className="text-xs text-red-400 font-semibold">Before</span>
          </div>
          <ul className="space-y-1">
            {item.before.map((b, i) => (
              <li key={i} className="text-xs text-gray-400 flex items-start gap-1.5">
                <span className="text-red-600 flex-shrink-0 mt-0.5">✗</span>
                {b}
              </li>
            ))}
          </ul>
        </div>

        <div className="border-t border-gray-800/60 pt-3">
          <div className="flex items-center gap-1.5 mb-1.5">
            <CheckCircle2 size={10} className="text-emerald-400" />
            <span className="text-xs text-emerald-400 font-semibold">After</span>
          </div>
          <ul className="space-y-1">
            {item.after.map((a, i) => (
              <li key={i} className="text-xs text-gray-300 flex items-start gap-1.5">
                <span className="text-emerald-500 flex-shrink-0 mt-0.5">✓</span>
                {a}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
