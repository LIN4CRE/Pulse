import { useState } from 'react';
import { Code, FileCode, FilePlus, FileEdit, ChevronRight } from 'lucide-react';
import { codeFiles } from '../data/codeFiles';
import CopyButton from './CopyButton';

export default function CodeSection() {
  const [selectedFile, setSelectedFile] = useState(codeFiles[0].id);
  const currentFile = codeFiles.find(f => f.id === selectedFile) || codeFiles[0];

  return (
    <section id="code" className="py-32 relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium mb-6">
            <Code className="w-4 h-4" />
            Fixed Source Code
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready-to-use
            <span className="bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent"> fixed code</span>
          </h2>
          <p className="text-lg text-white/40 max-w-2xl mx-auto">
            Copy these files directly into your repository. All issues have been fixed and improvements applied.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* File List */}
          <div className="lg:w-80 shrink-0">
            <div className="sticky top-24 space-y-2">
              {codeFiles.map((file) => (
                <button
                  key={file.id}
                  onClick={() => setSelectedFile(file.id)}
                  className={`w-full flex items-start gap-3 p-4 rounded-2xl text-left transition-all duration-200 ${
                    selectedFile === file.id
                      ? 'bg-white/10 border border-white/10'
                      : 'hover:bg-white/[0.03] border border-transparent'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                    file.isNew
                      ? 'bg-emerald-500/20'
                      : file.isModified
                      ? 'bg-amber-500/20'
                      : 'bg-white/10'
                  }`}>
                    {file.isNew ? (
                      <FilePlus className="w-4 h-4 text-emerald-400" />
                    ) : file.isModified ? (
                      <FileEdit className="w-4 h-4 text-amber-400" />
                    ) : (
                      <FileCode className="w-4 h-4 text-white/40" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-white truncate">{file.name}</span>
                      {file.isNew && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 uppercase">New</span>
                      )}
                      {file.isModified && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 uppercase">Fixed</span>
                      )}
                    </div>
                    <p className="text-xs text-white/30 mt-1 line-clamp-2">{file.description}</p>
                  </div>
                  <ChevronRight className={`w-4 h-4 shrink-0 mt-1 transition-colors ${
                    selectedFile === file.id ? 'text-white/40' : 'text-white/10'
                  }`} />
                </button>
              ))}
            </div>
          </div>

          {/* Code Display */}
          <div className="flex-1 min-w-0">
            <div className="rounded-3xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06] bg-white/[0.02]">
                <div className="flex items-center gap-3">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/60" />
                    <div className="w-3 h-3 rounded-full bg-amber-500/60" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500/60" />
                  </div>
                  <span className="text-sm text-white/40 font-mono">{currentFile.path}</span>
                </div>
                <CopyButton text={currentFile.code} label={currentFile.name} />
              </div>

              {/* Code */}
              <div className="overflow-auto max-h-[600px]">
                <pre className="p-6 text-sm leading-relaxed">
                  <code className="text-white/70 font-mono whitespace-pre">
                    {currentFile.code}
                  </code>
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
