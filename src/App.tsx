import { Header } from "./components/Header";
import { AuditProgressBar } from "./components/AuditProgressBar";
import { HeroSection } from "./components/HeroSection";
import { FindingsSection } from "./components/FindingsSection";
import { MetricsSection } from "./components/MetricsSection";
import { ArchitectureSection } from "./components/ArchitectureSection";
import { CiCdSection } from "./components/CiCdSection";
import { VersionCatalogSection } from "./components/VersionCatalogSection";
import { TestingSection } from "./components/TestingSection";
import { SecuritySection } from "./components/SecuritySection";
import { SummarySection } from "./components/SummarySection";
import { NavSidebar } from "./components/NavSidebar";

export default function App() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Header />

      <div className="flex">
        {/* Main content — offset for sidebar on large screens */}
        <main className="flex-1 lg:mr-60 min-w-0">
          <AuditProgressBar />
          <HeroSection />
          <FindingsSection />
          <MetricsSection />
          <ArchitectureSection />
          <CiCdSection />
          <VersionCatalogSection />
          <TestingSection />
          <SecuritySection />
          <SummarySection />

          {/* Footer */}
          <footer className="border-t border-gray-800 py-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-sm text-gray-500">
                  Pulse Android Repository — Comprehensive Audit & Refactoring Report
                </div>
                <div className="flex items-center gap-4 text-xs text-gray-600">
                  <span>Kotlin · Jetpack Compose · MVVM · Room · Retrofit</span>
                  <a
                    href="https://github.com/LIN4CRE/Pulse"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-violet-500 hover:text-violet-400 transition-colors font-medium"
                  >
                    github.com/LIN4CRE/Pulse
                  </a>
                </div>
              </div>
            </div>
          </footer>
        </main>

        {/* Navigation sidebar */}
        <NavSidebar />
      </div>
    </div>
  );
}
