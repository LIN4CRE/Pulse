import { CheckCircle2, GitBranch, RefreshCw, Rocket, Shield, Tag, Workflow } from "lucide-react";
import { workflowJobs } from "../data/auditData";
import { CodeBlock } from "./CodeBlock";

const CI_YAML = `name: CI — Pull Request Quality Gate

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  quality-gate:
    name: Lint, Test & Build
    runs-on: ubuntu-latest
    timeout-minutes: 30

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Setup JDK 17 (Temurin)
        uses: actions/setup-java@v4
        with:
          java-version: "17"
          distribution: temurin
          cache: gradle

      - name: Grant Gradle execution permission
        run: chmod +x ./gradlew

      - name: Run ktlint format check
        run: ./gradlew ktlintCheck

      - name: Run Android Lint
        run: ./gradlew lint

      - name: Execute unit tests
        run: ./gradlew testDebugUnitTest

      - name: Upload test results
        uses: actions/upload-artifact@v4
        if: always()
        with:
          name: test-results
          path: app/build/reports/tests/
          retention-days: 30

      - name: Build debug APK
        run: ./gradlew assembleDebug

      - name: Upload debug APK
        uses: actions/upload-artifact@v4
        with:
          name: debug-apk
          path: app/build/outputs/apk/debug/*.apk
          retention-days: 7`;

const RELEASE_YAML = `name: Release — Signed APK & GitHub Release

on:
  push:
    tags:
      - "v*.*.*"

jobs:
  release:
    name: Build, Sign & Publish
    runs-on: ubuntu-latest
    timeout-minutes: 45
    permissions:
      contents: write

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Setup JDK 17 (Temurin)
        uses: actions/setup-java@v4
        with:
          java-version: "17"
          distribution: temurin
          cache: gradle

      - name: Grant Gradle execution permission
        run: chmod +x ./gradlew

      - name: Decode keystore from base64 secret
        run: |
          echo "\${{ secrets.KEYSTORE_BASE64 }}" | base64 --decode > keystore.jks

      - name: Run full test suite
        run: ./gradlew testReleaseUnitTest

      - name: Build signed release APK
        env:
          KEYSTORE_PATH: \${{ github.workspace }}/keystore.jks
          STORE_PASSWORD: \${{ secrets.STORE_PASSWORD }}
          KEY_PASSWORD: \${{ secrets.KEY_PASSWORD }}
        run: ./gradlew assembleRelease

      - name: Generate APK checksum
        run: |
          sha256sum app/build/outputs/apk/release/*.apk > apk.sha256

      - name: Securely delete keystore
        if: always()
        run: rm -f keystore.jks

      - name: Create GitHub Release
        uses: softprops/action-gh-release@v2
        with:
          files: |
            app/build/outputs/apk/release/*.apk
            apk.sha256
          generate_release_notes: true
          draft: false`;

export function CiCdSection() {
  return (
    <section id="cicd" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-purple-950/60 border border-purple-800/40">
            <Workflow size={15} className="text-purple-400" />
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">CI/CD Workflows</h2>
        </div>
        <p className="text-gray-400 max-w-2xl">
          Three production-grade GitHub Actions workflows were designed and implemented from scratch, as the
          repository had{" "}
          <span className="text-red-400 font-medium">zero automation</span> despite claiming CI/CD support in
          the README.
        </p>
      </div>

      {/* Before / After callout */}
      <div className="grid sm:grid-cols-2 gap-4 mb-12">
        <div className="bg-red-950/20 border border-red-900/30 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-red-500" />
            <span className="text-red-300 font-semibold text-sm">Before Audit</span>
          </div>
          <p className="text-gray-300 text-sm">No .github/workflows/ directory. Zero automation. All builds,
            tests, and releases performed manually with no quality gates.</p>
          <div className="mt-3 font-mono text-xs text-red-400 bg-red-950/40 rounded-lg px-3 py-2">
            $ ls .github/workflows/<br />
            ls: .github/workflows/: No such file or directory
          </div>
        </div>
        <div className="bg-emerald-950/20 border border-emerald-900/30 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-emerald-300 font-semibold text-sm">After Refactoring</span>
          </div>
          <p className="text-gray-300 text-sm">3 production-grade workflows. Every PR auto-validated.
            Every release automatically signed and published. Weekly dependency maintenance.</p>
          <div className="mt-3 font-mono text-xs text-emerald-400 bg-emerald-950/40 rounded-lg px-3 py-2">
            .github/workflows/<br />
            ├── ci.yml<br />
            ├── release.yml<br />
            └── dependency-update.yml
          </div>
        </div>
      </div>

      {/* Workflow cards */}
      <div className="grid lg:grid-cols-3 gap-6 mb-12">
        {workflowJobs.map((job, i) => (
          <WorkflowCard key={i} job={job} index={i} />
        ))}
      </div>

      {/* Full YAML previews */}
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
            <Shield size={16} className="text-violet-400" />
            ci.yml — Full Workflow
          </h3>
          <CodeBlock code={CI_YAML} label="ci.yml" variant="after" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
            <Rocket size={16} className="text-orange-400" />
            release.yml — Full Workflow
          </h3>
          <CodeBlock code={RELEASE_YAML} label="release.yml" variant="after" />
        </div>
      </div>
    </section>
  );
}

function WorkflowCard({ job, index }: { job: (typeof workflowJobs)[number]; index: number }) {
  const icons = [Shield, Rocket, RefreshCw];
  const colors = [
    { bg: "bg-violet-950/40 border-violet-800/40", icon: "text-violet-400", trigger: "bg-violet-950/40 text-violet-300" },
    { bg: "bg-orange-950/40 border-orange-800/40", icon: "text-orange-400", trigger: "bg-orange-950/40 text-orange-300" },
    { bg: "bg-blue-950/40 border-blue-800/40", icon: "text-blue-400", trigger: "bg-blue-950/40 text-blue-300" },
  ];

  const Icon = icons[index];
  const color = colors[index];

  return (
    <div className="bg-gray-900/60 border border-gray-800/60 rounded-xl p-5 hover:border-gray-700/60 transition-colors">
      {/* Header */}
      <div className="flex items-start gap-3 mb-4">
        <div className={`flex-shrink-0 w-9 h-9 rounded-lg border flex items-center justify-center ${color.bg}`}>
          <Icon size={16} className={color.icon} />
        </div>
        <div>
          <h3 className="text-sm font-bold text-white leading-tight">{job.name}</h3>
        </div>
      </div>

      {/* Triggers */}
      <div className="mb-4">
        <div className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <Tag size={10} />
          Triggers
        </div>
        <div className="space-y-1">
          {job.trigger.map((t, i) => (
            <div key={i} className={`text-xs font-mono px-2 py-1 rounded ${color.trigger}`}>
              {t}
            </div>
          ))}
        </div>
      </div>

      {/* Steps */}
      <div>
        <div className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <GitBranch size={10} />
          Steps ({job.steps.length})
        </div>
        <ol className="space-y-1.5">
          {job.steps.map((step, i) => (
            <li key={i} className="flex items-start gap-2">
              <CheckCircle2 size={12} className="text-emerald-500 flex-shrink-0 mt-0.5" />
              <span className="text-xs text-gray-300">{step}</span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
