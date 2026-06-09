import { Layers, ArrowRight } from 'lucide-react';

const layers = [
  {
    name: 'UI Layer',
    desc: 'Jetpack Compose + Material 3',
    files: ['DashboardScreen.kt', 'Theme.kt', 'Color.kt', 'Type.kt'],
    color: 'from-violet-500 to-purple-600',
    bg: 'bg-violet-500/10',
    border: 'border-violet-500/20',
  },
  {
    name: 'ViewModel Layer',
    desc: 'MVVM with StateFlow',
    files: ['DashboardViewModel.kt', 'DashboardState'],
    color: 'from-cyan-500 to-blue-600',
    bg: 'bg-cyan-500/10',
    border: 'border-cyan-500/20',
  },
  {
    name: 'Network Layer',
    desc: 'Retrofit + OkHttp + Moshi',
    files: ['RetrofitClient.kt', 'SensorApi.kt', 'SensorData.kt'],
    color: 'from-emerald-500 to-green-600',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
  },
  {
    name: 'Discovery Layer',
    desc: 'Android NSD (mDNS/DNS-SD)',
    files: ['SensorDiscoveryManager.kt'],
    color: 'from-amber-500 to-orange-600',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/20',
  },
];

export default function ArchitectureSection() {
  return (
    <section id="architecture" className="py-32 relative">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-20">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm font-medium mb-6">
            <Layers className="w-4 h-4" />
            Architecture
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Clean
            <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent"> MVVM </span>
            Architecture
          </h2>
          <p className="text-lg text-white/40 max-w-2xl mx-auto">
            Pulse follows Android best practices with a clean separation of concerns across four distinct layers.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {layers.map((layer, idx) => (
            <div
              key={layer.name}
              className={`relative p-8 rounded-3xl bg-white/[0.02] border ${layer.border} group hover:bg-white/[0.04] transition-all duration-300`}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${layer.color} flex items-center justify-center text-white font-bold text-sm`}>
                  {idx + 1}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">{layer.name}</h3>
                  <p className="text-sm text-white/40">{layer.desc}</p>
                </div>
              </div>
              <div className="space-y-2 mt-4">
                {layer.files.map((file) => (
                  <div key={file} className="flex items-center gap-2 text-sm text-white/30">
                    <ArrowRight className="w-3 h-3 text-white/20" />
                    <code className="font-mono">{file}</code>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Data Flow */}
        <div className="mt-16 p-8 rounded-3xl bg-white/[0.02] border border-white/[0.06]">
          <h3 className="text-xl font-bold text-white mb-6 text-center">Data Flow</h3>
          <div className="flex flex-wrap items-center justify-center gap-3 text-sm">
            {[
              { label: 'Sensor Hardware', color: 'bg-amber-500/20 text-amber-400 border-amber-500/30' },
              { label: 'HTTP/WiFi', color: 'bg-white/10 text-white/40 border-white/10', isArrow: true },
              { label: 'NSD Discovery', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
              { label: '→', color: 'text-white/20', isArrow: true },
              { label: 'Retrofit API', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
              { label: '→', color: 'text-white/20', isArrow: true },
              { label: 'ViewModel', color: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30' },
              { label: '→', color: 'text-white/20', isArrow: true },
              { label: 'StateFlow', color: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30' },
              { label: '→', color: 'text-white/20', isArrow: true },
              { label: 'Compose UI', color: 'bg-violet-500/20 text-violet-400 border-violet-500/30' },
            ].map((item, i) =>
              item.isArrow ? (
                <span key={i} className={item.color}>
                  {item.label}
                </span>
              ) : (
                <span key={i} className={`px-3 py-1.5 rounded-lg border ${item.color} font-medium`}>
                  {item.label}
                </span>
              )
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
