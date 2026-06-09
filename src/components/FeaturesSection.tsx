import { Wifi, Shield, Zap, Eye, Smartphone, CloudOff } from 'lucide-react';

const features = [
  {
    icon: Wifi,
    title: 'Zero-Config Discovery',
    description: 'Automatic NSD (Network Service Discovery) finds your sensors on the local network without any setup.',
    color: 'from-violet-500 to-purple-600',
    bg: 'bg-violet-500/10',
  },
  {
    icon: Eye,
    title: 'Real-Time Monitoring',
    description: 'Live sensor data updates every second with smooth animations and trend indicators.',
    color: 'from-cyan-500 to-blue-600',
    bg: 'bg-cyan-500/10',
  },
  {
    icon: CloudOff,
    title: 'No Cloud Required',
    description: 'All data stays local. No external servers, no data harvesting, complete privacy.',
    color: 'from-emerald-500 to-green-600',
    bg: 'bg-emerald-500/10',
  },
  {
    icon: Shield,
    title: 'Offline Fallback',
    description: 'When connection drops, the app gracefully shows last known data while attempting reconnection.',
    color: 'from-amber-500 to-orange-600',
    bg: 'bg-amber-500/10',
  },
  {
    icon: Zap,
    title: 'Haptic Feedback',
    description: 'Subtle haptic responses for connection events create a tactile, responsive experience.',
    color: 'from-rose-500 to-pink-600',
    bg: 'bg-rose-500/10',
  },
  {
    icon: Smartphone,
    title: 'Material 3 Design',
    description: 'Built with Jetpack Compose and Material 3 for a modern, fluid "Dark Space" aesthetic.',
    color: 'from-indigo-500 to-violet-600',
    bg: 'bg-indigo-500/10',
  },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="py-32 relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <span className="inline-block px-4 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-sm font-medium mb-6">
            Features
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Everything you need for
            <br />
            <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
              sensor monitoring
            </span>
          </h2>
          <p className="text-lg text-white/40 max-w-2xl mx-auto">
            Pulse combines powerful features with a beautiful interface to give you complete visibility into your environment.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group relative p-8 rounded-3xl bg-white/[0.02] border border-white/[0.06] hover:border-white/10 hover:bg-white/[0.04] transition-all duration-500"
            >
              <div className={`w-14 h-14 rounded-2xl ${feature.bg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className="w-7 h-7 text-white/80" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">{feature.title}</h3>
              <p className="text-white/40 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
