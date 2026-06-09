import { Activity, Wifi, Thermometer, Droplets, Wind, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';

function PulsingDot({ color, delay }: { color: string; delay: number }) {
  return (
    <span className="relative flex h-3 w-3">
      <span
        className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${color}`}
        style={{ animationDelay: `${delay}ms` }}
      />
      <span className={`relative inline-flex rounded-full h-3 w-3 ${color}`} />
    </span>
  );
}

function FloatingCard({ icon: Icon, label, value, unit, color, x, y, delay }: {
  icon: React.ElementType;
  label: string;
  value: string;
  unit: string;
  color: string;
  x: string;
  y: string;
  delay: number;
}) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div
      className={`absolute ${x} ${y} transition-all duration-1000 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl min-w-[140px]">
        <div className="flex items-center gap-2 mb-2">
          <div className={`w-8 h-8 rounded-lg ${color} flex items-center justify-center`}>
            <Icon className="w-4 h-4 text-white" />
          </div>
          <span className="text-xs text-white/40 font-medium">{label}</span>
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-bold text-white">{value}</span>
          <span className="text-sm text-white/40">{unit}</span>
        </div>
      </div>
    </div>
  );
}

export default function HeroSection() {
  const [temp, setTemp] = useState(23.4);
  const [hum, setHum] = useState(58);

  useEffect(() => {
    const interval = setInterval(() => {
      setTemp(prev => +(prev + (Math.random() - 0.5) * 0.3).toFixed(1));
      setHum(prev => Math.max(40, Math.min(80, prev + Math.round((Math.random() - 0.5) * 2))));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0F172A] via-[#1E1B4B] to-[#0F172A]" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl" />
      <div className="absolute top-1/3 right-1/3 w-64 h-64 bg-fuchsia-600/5 rounded-full blur-3xl" />

      {/* Grid Pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
        {/* Status Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8">
          <PulsingDot color="bg-emerald-400" delay={0} />
          <span className="text-sm text-white/60 font-medium">Real-time Sensor Dashboard</span>
        </div>

        {/* Main Title */}
        <h1 className="text-6xl md:text-8xl font-bold tracking-tight mb-6">
          <span className="bg-gradient-to-r from-white via-white to-white/60 bg-clip-text text-transparent">
            Pulse
          </span>
        </h1>
        <p className="text-xl md:text-2xl text-white/40 max-w-2xl mx-auto mb-4 leading-relaxed">
          Automatically discover local servers and display real-time sensor data in a sleek, WiFi-connected dashboard.
        </p>
        <p className="text-sm text-white/25 max-w-xl mx-auto mb-12">
          Built with Kotlin • Jetpack Compose • Material 3 • Zero-Config Discovery
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-16">
          <a
            href="https://github.com/LIN4CRE/Pulse"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 transition-all hover:-translate-y-0.5"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
            View on GitHub
          </a>
          <button
            onClick={() => document.getElementById('issues')?.scrollIntoView({ behavior: 'smooth' })}
            className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-semibold hover:bg-white/10 transition-all hover:-translate-y-0.5"
          >
            <Activity className="w-5 h-5" />
            View Fixes & Improvements
          </button>
        </div>

        {/* Floating sensor cards */}
        <div className="relative h-48 md:h-64 hidden md:block">
          <FloatingCard
            icon={Thermometer}
            label="Temperature"
            value={temp.toFixed(1)}
            unit="°C"
            color="bg-rose-500/80"
            x="left-[5%]"
            y="top-0"
            delay={200}
          />
          <FloatingCard
            icon={Droplets}
            label="Humidity"
            value={`${hum}`}
            unit="%"
            color="bg-cyan-500/80"
            x="left-[35%]"
            y="top-8"
            delay={400}
          />
          <FloatingCard
            icon={Wind}
            label="Pressure"
            value="1013"
            unit="hPa"
            color="bg-emerald-500/80"
            x="right-[30%]"
            y="top-4"
            delay={600}
          />
          <FloatingCard
            icon={Sun}
            label="Light"
            value="342"
            unit="lx"
            color="bg-amber-500/80"
            x="right-[2%]"
            y="top-0"
            delay={800}
          />
          <div className="absolute left-1/2 -translate-x-1/2 bottom-0">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20">
              <Wifi className="w-4 h-4 text-emerald-400" />
              <span className="text-sm text-emerald-400 font-medium">Auto-discovered via NSD</span>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 rounded-full border-2 border-white/20 flex items-start justify-center p-2">
          <div className="w-1.5 h-3 rounded-full bg-white/40 animate-pulse" />
        </div>
      </div>
    </section>
  );
}
