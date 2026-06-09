import { useState, useEffect } from "react";
import {
  BarChart3,
  FileSearch,
  FlaskConical,
  Layers,
  Menu,
  Package,
  Shield,
  Trophy,
  Workflow,
  X,
} from "lucide-react";

const navItems = [
  { id: "findings", label: "Findings", icon: FileSearch, count: "24" },
  { id: "metrics", label: "Metrics", icon: BarChart3 },
  { id: "architecture", label: "Architecture", icon: Layers },
  { id: "cicd", label: "CI / CD", icon: Workflow, badge: "NEW" },
  { id: "versioncatalog", label: "Dependencies", icon: Package },
  { id: "testing", label: "Testing", icon: FlaskConical },
  { id: "security", label: "Security", icon: Shield },
  { id: "summary", label: "Summary", icon: Trophy },
];

export function NavSidebar() {
  const [activeSection, setActiveSection] = useState("findings");
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-20% 0px -70% 0px" }
    );

    navItems.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      setMobileOpen(false);
    }
  };

  return (
    <>
      {/* Mobile toggle */}
      <button
        className="fixed bottom-6 right-6 z-50 lg:hidden w-12 h-12 bg-violet-700 hover:bg-violet-600 rounded-full shadow-lg shadow-violet-900/40 flex items-center justify-center text-white transition-colors"
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label="Toggle navigation"
      >
        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <nav
        className={`fixed top-16 right-0 h-[calc(100vh-64px)] z-40 w-60 bg-gray-950/95 backdrop-blur-md border-l border-gray-800 transform transition-transform duration-200 overflow-y-auto
          ${mobileOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"}`}
      >
        <div className="p-4">
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-2">
            Contents
          </div>
          <ul className="space-y-0.5">
            {navItems.map(({ id, label, icon: Icon, count, badge }) => (
              <li key={id}>
                <button
                  onClick={() => scrollTo(id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all text-left ${
                    activeSection === id
                      ? "bg-violet-950/60 text-violet-300 border border-violet-800/40"
                      : "text-gray-400 hover:text-gray-200 hover:bg-gray-800/40"
                  }`}
                >
                  <Icon
                    size={14}
                    className={activeSection === id ? "text-violet-400" : "text-gray-500"}
                  />
                  <span className="flex-1">{label}</span>
                  {count && (
                    <span className="text-xs bg-gray-800 text-gray-400 px-1.5 py-0.5 rounded font-bold">
                      {count}
                    </span>
                  )}
                  {badge && (
                    <span className="text-xs bg-emerald-950/60 text-emerald-400 border border-emerald-800/40 px-1.5 py-0.5 rounded font-bold">
                      {badge}
                    </span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Quick stats */}
        <div className="p-4 border-t border-gray-800/60 mt-2">
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-2">
            At a Glance
          </div>
          <div className="space-y-2">
            {[
              { label: "Critical fixed", value: "6 / 6", color: "text-emerald-400" },
              { label: "High fixed", value: "8 / 8", color: "text-emerald-400" },
              { label: "Build status", value: "✓ Passing", color: "text-emerald-400" },
              { label: "Coverage", value: "85%+", color: "text-violet-400" },
            ].map((s) => (
              <div key={s.label} className="flex items-center justify-between px-2">
                <span className="text-xs text-gray-500">{s.label}</span>
                <span className={`text-xs font-semibold ${s.color}`}>{s.value}</span>
              </div>
            ))}
          </div>
        </div>
      </nav>
    </>
  );
}
