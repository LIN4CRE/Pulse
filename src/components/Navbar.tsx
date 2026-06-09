import { useState, useEffect } from 'react';
import { Activity, Menu, X } from 'lucide-react';

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
    </svg>
  );
}


interface NavbarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const navLinks = [
  { id: 'features', label: 'Features' },
  { id: 'issues', label: 'Fixes' },
  { id: 'architecture', label: 'Architecture' },
  { id: 'code', label: 'Code' },
  { id: 'workflow', label: 'CI/CD' },
];

export default function Navbar({ activeSection, onSectionChange }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            onSectionChange(entry.target.id);
          }
        });
      },
      { threshold: 0.3 }
    );

    navLinks.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [onSectionChange]);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMobileOpen(false);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#0F172A]/90 backdrop-blur-xl border-b border-white/5 shadow-lg shadow-black/20'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <button onClick={() => scrollTo('hero')} className="flex items-center gap-2.5 group">
          <div className="relative">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/20 group-hover:shadow-violet-500/40 transition-shadow">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 blur-lg opacity-30 group-hover:opacity-50 transition-opacity" />
          </div>
          <span className="text-xl font-bold tracking-tight">Pulse</span>
        </button>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => scrollTo(id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeSection === id
                  ? 'text-white bg-white/10'
                  : 'text-white/50 hover:text-white/80 hover:bg-white/5'
              }`}
            >
              {label}
            </button>
          ))}
          <a
            href="https://github.com/LIN4CRE/Pulse"
            target="_blank"
            rel="noopener noreferrer"
            className="ml-4 flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-sm font-medium text-white/70 hover:text-white hover:bg-white/10 transition-all"
          >
            <GithubIcon className="w-4 h-4" />
            GitHub
          </a>
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-[#0F172A]/95 backdrop-blur-xl border-t border-white/5 px-6 py-4 space-y-1">
          {navLinks.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => scrollTo(id)}
              className={`block w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                activeSection === id
                  ? 'text-white bg-white/10'
                  : 'text-white/50 hover:text-white/80 hover:bg-white/5'
              }`}
            >
              {label}
            </button>
          ))}
          <a
            href="https://github.com/LIN4CRE/Pulse"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium text-white/50 hover:text-white hover:bg-white/5 transition-all"
          >
            <GithubIcon className="w-4 h-4" />
            GitHub
          </a>
        </div>
      )}
    </nav>
  );
}
