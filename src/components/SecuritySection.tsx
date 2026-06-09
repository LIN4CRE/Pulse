import { AlertTriangle, Lock, Shield, ShieldAlert, ShieldCheck } from "lucide-react";

const securityItems = [
  {
    id: "SEC-1",
    title: "Hardcoded Keystore Path Fallback",
    severity: "Critical",
    resolution: "Fixed — env var required; build fails fast if absent",
    color: "red",
    icon: "critical",
  },
  {
    id: "SEC-2",
    title: "Code Obfuscation Disabled in Production",
    severity: "Critical",
    resolution: "Fixed — R8 + ProGuard enabled with proper keep rules",
    color: "red",
    icon: "critical",
  },
  {
    id: "SEC-3",
    title: "Full HTTP Body Logging in Production",
    severity: "High",
    resolution: "Fixed — logging gated behind BuildConfig.DEBUG check",
    color: "orange",
    icon: "high",
  },
  {
    id: "SEC-4",
    title: "Outdated OkHttp 4.10.0 with TLS improvements missed",
    severity: "High",
    resolution: "Fixed — upgraded to 4.12.0 (current stable)",
    color: "orange",
    icon: "high",
  },
  {
    id: "SEC-5",
    title: ".gitignore missing *.jks and .env entries",
    severity: "Medium",
    resolution: "Fixed — all secret file patterns added",
    color: "amber",
    icon: "medium",
  },
  {
    id: "SEC-6",
    title: "No SECURITY.md / vulnerability disclosure policy",
    severity: "Low",
    resolution: "Added — 90-day responsible disclosure policy",
    color: "blue",
    icon: "low",
  },
];

const networkSecurityConfig = `<!-- network_security_config.xml -->
<network-security-config>
  <base-config cleartextTrafficPermitted="false">
    <trust-anchors>
      <certificates src="system" />
    </trust-anchors>
  </base-config>

  <!-- Allow cleartext for local LAN sensors only -->
  <domain-config cleartextTrafficPermitted="true">
    <domain includeSubdomains="true">192.168.0.0</domain>
    <domain includeSubdomains="true">10.0.0.0</domain>
    <domain includeSubdomains="true">172.16.0.0</domain>
  </domain-config>
</network-security-config>`;

const envExample = `# .env.example — Template for required environment variables
# Copy this to .env and fill in your values
# NEVER commit .env to version control

# Sensor server connection
SENSOR_BASE_URL=http://192.168.1.100:8080

# Release signing (required for ./gradlew assembleRelease)
# Set KEYSTORE_BASE64 in GitHub Secrets for CI
KEYSTORE_PATH=
STORE_PASSWORD=
KEY_PASSWORD=`;

export function SecuritySection() {
  return (
    <section id="security" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-red-950/60 border border-red-800/40">
            <Shield size={15} className="text-red-400" />
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Security Audit</h2>
        </div>
        <p className="text-gray-400 max-w-2xl">
          Six security findings were identified and resolved, ranging from production data exposure to
          credential management vulnerabilities. All findings are fully remediated.
        </p>
      </div>

      {/* Summary banner */}
      <div className="bg-emerald-950/20 border border-emerald-900/30 rounded-xl p-5 mb-10 flex items-center gap-4">
        <ShieldCheck size={32} className="text-emerald-400 flex-shrink-0" />
        <div>
          <div className="text-emerald-300 font-bold text-sm mb-0.5">Security Status: All Clear</div>
          <div className="text-gray-300 text-sm">
            All 6 security vulnerabilities identified during the audit have been fully resolved. The
            application is now hardened for production distribution.
          </div>
        </div>
      </div>

      {/* Security findings grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
        {securityItems.map((item) => (
          <SecurityCard key={item.id} item={item} />
        ))}
      </div>

      {/* Network security config */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div>
          <h3 className="text-base font-bold text-white mb-3 flex items-center gap-2">
            <Lock size={14} className="text-violet-400" />
            Network Security Configuration
          </h3>
          <p className="text-sm text-gray-400 mb-4">
            A network security config was added to block cleartext traffic globally while allowing local
            LAN connections (required for sensor discovery over HTTP).
          </p>
          <div className="bg-gray-950/60 border border-gray-800/60 rounded-xl overflow-hidden">
            <div className="px-3 py-1.5 bg-emerald-950/40 text-xs font-semibold text-emerald-400">
              network_security_config.xml (Added)
            </div>
            <pre className="overflow-x-auto p-4 text-xs font-mono text-gray-200 leading-relaxed whitespace-pre">
              {networkSecurityConfig}
            </pre>
          </div>
        </div>

        <div>
          <h3 className="text-base font-bold text-white mb-3 flex items-center gap-2">
            <AlertTriangle size={14} className="text-amber-400" />
            Environment Variable Template
          </h3>
          <p className="text-sm text-gray-400 mb-4">
            A .env.example file was committed with placeholder values so developers know exactly which
            environment variables are required — without exposing actual secrets.
          </p>
          <div className="bg-gray-950/60 border border-gray-800/60 rounded-xl overflow-hidden">
            <div className="px-3 py-1.5 bg-emerald-950/40 text-xs font-semibold text-emerald-400">
              .env.example (Added)
            </div>
            <pre className="overflow-x-auto p-4 text-xs font-mono text-gray-200 leading-relaxed whitespace-pre">
              {envExample}
            </pre>
          </div>
        </div>
      </div>
    </section>
  );
}

function SecurityCard({ item }: { item: (typeof securityItems)[number] }) {
  const colorMap: Record<string, { border: string; badge: string; icon: string }> = {
    red: {
      border: "border-l-red-500",
      badge: "bg-red-950/60 text-red-300 border-red-700/50",
      icon: "text-red-400",
    },
    orange: {
      border: "border-l-orange-500",
      badge: "bg-orange-950/60 text-orange-300 border-orange-700/50",
      icon: "text-orange-400",
    },
    amber: {
      border: "border-l-amber-500",
      badge: "bg-amber-950/60 text-amber-300 border-amber-700/50",
      icon: "text-amber-400",
    },
    blue: {
      border: "border-l-blue-500",
      badge: "bg-blue-950/60 text-blue-300 border-blue-700/50",
      icon: "text-blue-400",
    },
  };

  const c = colorMap[item.color];

  return (
    <div
      className={`bg-gray-900/60 border border-gray-800/60 border-l-4 ${c.border} rounded-xl p-4 hover:border-gray-700/60 transition-colors`}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <ShieldAlert size={16} className={c.icon} />
        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold tracking-wider border ${c.badge}`}>
          {item.severity}
        </span>
      </div>

      <div className="text-xs font-mono text-gray-500 mb-1">{item.id}</div>
      <h3 className="text-sm font-semibold text-white mb-3 leading-snug">{item.title}</h3>

      <div className="flex items-start gap-2 bg-emerald-950/20 border border-emerald-900/30 rounded-lg px-3 py-2">
        <ShieldCheck size={11} className="text-emerald-400 flex-shrink-0 mt-0.5" />
        <span className="text-xs text-gray-300">{item.resolution}</span>
      </div>
    </div>
  );
}
