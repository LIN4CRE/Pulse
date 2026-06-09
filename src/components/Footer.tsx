import { Activity, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="py-16 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/20">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-lg font-bold text-white">Pulse</span>
              <p className="text-xs text-white/30">Smart Sensor Dashboard</p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <a
              href="https://github.com/LIN4CRE/Pulse"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-white/30 hover:text-white/60 transition-colors"
            >
              GitHub
            </a>
            <a
              href="https://github.com/LIN4CRE/Pulse/actions"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-white/30 hover:text-white/60 transition-colors"
            >
              CI/CD
            </a>
            <a
              href="https://github.com/LIN4CRE/Pulse/releases"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-white/30 hover:text-white/60 transition-colors"
            >
              Releases
            </a>
          </div>

          <p className="flex items-center gap-1.5 text-sm text-white/20">
            Made with <Heart className="w-3.5 h-3.5 text-rose-400" /> for Pulse
          </p>
        </div>
      </div>
    </footer>
  );
}
