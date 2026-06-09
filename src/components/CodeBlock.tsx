import { useState } from "react";
import { Check, Copy } from "lucide-react";

interface CodeBlockProps {
  code: string;
  label?: string;
  variant?: "before" | "after" | "neutral";
}

export function CodeBlock({ code, label, variant = "neutral" }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const borderColor =
    variant === "before"
      ? "border-red-800/40"
      : variant === "after"
      ? "border-emerald-800/40"
      : "border-gray-700/40";

  const labelColor =
    variant === "before"
      ? "text-red-400 bg-red-950/40"
      : variant === "after"
      ? "text-emerald-400 bg-emerald-950/40"
      : "text-gray-400 bg-gray-800/40";

  return (
    <div className={`rounded-lg border ${borderColor} overflow-hidden`}>
      {label && (
        <div className={`flex items-center justify-between px-3 py-1.5 text-xs font-semibold ${labelColor}`}>
          <span>{label}</span>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 opacity-60 hover:opacity-100 transition-opacity"
            title="Copy code"
          >
            {copied ? (
              <>
                <Check size={11} />
                <span>Copied</span>
              </>
            ) : (
              <>
                <Copy size={11} />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      )}
      <pre className="overflow-x-auto p-3 bg-gray-950/60 text-xs leading-relaxed">
        <code className="text-gray-200 font-mono whitespace-pre">{code}</code>
      </pre>
    </div>
  );
}
