import { useState } from 'react';
import { GitBranch, Play, Package, Upload, CheckCircle, ArrowRight, Download } from 'lucide-react';
import CopyButton from './CopyButton';

const workflowYaml = `name: Android Build

on:
  push:
    branches: [ "main", "master" ]
    tags: [ "v*" ]
  pull_request:
    branches: [ "main", "master" ]

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v4

    - name: Set up JDK 21
      uses: actions/setup-java@v4
      with:
        java-version: '21'
        distribution: 'temurin'
        cache: gradle

    - name: Grant execute permission for gradlew
      run: chmod +x gradlew

    - name: Create .env from example
      run: cp .env.example .env

    - name: Generate debug keystore
      run: |
        keytool -genkeypair \\
          -alias androiddebugkey \\
          -keypass android \\
          -keystore debug.keystore \\
          -storepass android \\
          -dname "CN=Android Debug,O=Android,C=US" \\
          -keyalg RSA \\
          -keysize 2048 \\
          -validity 10000

    - name: Build Debug APK
      run: ./gradlew assembleDebug

    - name: Upload Debug APK
      uses: actions/upload-artifact@v4
      with:
        name: pulse-debug-apk
        path: app/build/outputs/apk/debug/app-debug.apk
        retention-days: 30

  release:
    needs: build
    runs-on: ubuntu-latest
    if: startsWith(github.ref, 'refs/tags/v')

    steps:
    - uses: actions/checkout@v4

    - name: Set up JDK 21
      uses: actions/setup-java@v4
      with:
        java-version: '21'
        distribution: 'temurin'
        cache: gradle

    - name: Grant execute permission for gradlew
      run: chmod +x gradlew

    - name: Create .env from example
      run: cp .env.example .env

    - name: Generate debug keystore
      run: |
        keytool -genkeypair \\
          -alias androiddebugkey \\
          -keypass android \\
          -keystore debug.keystore \\
          -storepass android \\
          -dname "CN=Android Debug,O=Android,C=US" \\
          -keyalg RSA \\
          -keysize 2048 \\
          -validity 10000

    - name: Build Release APK (unsigned)
      run: ./gradlew assembleDebug

    - name: Create GitHub Release
      uses: softprops/action-gh-release@v2
      with:
        files: app/build/outputs/apk/debug/app-debug.apk
        generate_release_notes: true
      env:
        GITHUB_TOKEN: \${{ secrets.GITHUB_TOKEN }}`;

const steps = [
  {
    icon: GitBranch,
    title: 'Push to main or tag',
    description: 'Triggers on push to main/master branch or version tags (v*)',
    color: 'text-violet-400',
    bg: 'bg-violet-500/10',
  },
  {
    icon: Play,
    title: 'Setup JDK 21 + Gradle',
    description: 'Configures JDK 21 (required for AGP 9.1.1) with Gradle caching',
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/10',
  },
  {
    icon: Package,
    title: 'Build Debug APK',
    description: 'Generates debug keystore, creates .env, then builds the APK',
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
  },
  {
    icon: Upload,
    title: 'Upload Artifact',
    description: 'Uploads APK as a GitHub Actions artifact (30-day retention)',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
  },
  {
    icon: Download,
    title: 'Auto Release (on tag)',
    description: 'Creates a GitHub Release with the APK when you push a version tag',
    color: 'text-rose-400',
    bg: 'bg-rose-500/10',
  },
];

export default function WorkflowSection() {
  const [showFullYaml, setShowFullYaml] = useState(false);

  return (
    <section id="workflow" className="py-32 relative">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-20">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm font-medium mb-6">
            <GitBranch className="w-4 h-4" />
            CI/CD Pipeline
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Automatic
            <span className="bg-gradient-to-r from-rose-400 to-pink-400 bg-clip-text text-transparent"> APK builds</span>
          </h2>
          <p className="text-lg text-white/40 max-w-2xl mx-auto">
            Push code → Get APK. The fixed GitHub Actions workflow handles everything automatically.
          </p>
        </div>

        {/* Pipeline Steps */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-4 mb-20">
          {steps.map((step, idx) => (
            <div key={step.title} className="flex items-center gap-4 w-full md:w-auto">
              <div className="flex flex-col items-center text-center flex-1">
                <div className={`w-16 h-16 rounded-2xl ${step.bg} flex items-center justify-center mb-4`}>
                  <step.icon className={`w-8 h-8 ${step.color}`} />
                </div>
                <h3 className="text-sm font-bold text-white mb-1">{step.title}</h3>
                <p className="text-xs text-white/30 max-w-[160px]">{step.description}</p>
              </div>
              {idx < steps.length - 1 && (
                <ArrowRight className="w-5 h-5 text-white/10 hidden md:block shrink-0" />
              )}
            </div>
          ))}
        </div>

        {/* How to trigger releases */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <div className="p-8 rounded-3xl bg-white/[0.02] border border-white/[0.06]">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-emerald-400" />
              </div>
              <h3 className="text-lg font-bold text-white">Debug Builds</h3>
            </div>
            <p className="text-white/40 text-sm mb-4">
              Every push to <code className="px-1.5 py-0.5 rounded bg-white/10 text-white/60 font-mono text-xs">main</code> automatically builds a debug APK.
            </p>
            <div className="p-4 rounded-xl bg-black/30 font-mono text-sm text-emerald-400">
              git push origin main
            </div>
          </div>
          <div className="p-8 rounded-3xl bg-white/[0.02] border border-white/[0.06]">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center">
                <Download className="w-5 h-5 text-rose-400" />
              </div>
              <h3 className="text-lg font-bold text-white">GitHub Releases</h3>
            </div>
            <p className="text-white/40 text-sm mb-4">
              Tag a version to automatically create a GitHub Release with the APK attached.
            </p>
            <div className="p-4 rounded-xl bg-black/30 font-mono text-sm text-rose-400 space-y-1">
              <div>git tag v1.0.0</div>
              <div>git push origin v1.0.0</div>
            </div>
          </div>
        </div>

        {/* Full YAML */}
        <div className="rounded-3xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06] bg-white/[0.02]">
            <div className="flex items-center gap-3">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/60" />
                <div className="w-3 h-3 rounded-full bg-amber-500/60" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/60" />
              </div>
              <span className="text-sm text-white/40 font-mono">.github/workflows/android-build.yml</span>
            </div>
            <CopyButton text={workflowYaml} label="workflow" />
          </div>

          <div className={`overflow-auto transition-all duration-500 ${showFullYaml ? 'max-h-[2000px]' : 'max-h-[300px]'}`}>
            <pre className="p-6 text-sm leading-relaxed">
              <code className="text-white/70 font-mono whitespace-pre">{workflowYaml}</code>
            </pre>
          </div>

          {!showFullYaml && (
            <div className="relative">
              <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0F172A] to-transparent pointer-events-none" />
            </div>
          )}

          <div className="px-6 py-4 border-t border-white/[0.06] flex justify-center">
            <button
              onClick={() => setShowFullYaml(!showFullYaml)}
              className="px-6 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-sm font-medium text-white/60 hover:text-white transition-all"
            >
              {showFullYaml ? 'Show Less' : 'Show Full Workflow'}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
