import React from 'react';
import { Copy, Check } from 'lucide-react';

interface CodeViewerProps {
  code: string;
}

export const CodeViewer: React.FC<CodeViewerProps> = ({ code }) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative w-full h-full bg-slate-900 rounded-lg overflow-hidden flex flex-col shadow-inner">
      <div className="flex items-center justify-between px-4 py-2 bg-slate-800 border-b border-slate-700">
        <span className="text-xs font-mono text-slate-400">generated_viz.html</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2 py-1 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-700 rounded transition-colors"
        >
          {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
          {copied ? 'Copied!' : 'Copy Code'}
        </button>
      </div>
      <div className="flex-1 overflow-auto p-4">
        <pre className="text-sm font-mono text-slate-200 leading-relaxed whitespace-pre-wrap break-words">
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
};