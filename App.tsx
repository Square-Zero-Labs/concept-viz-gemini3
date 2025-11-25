import React, { useState } from 'react';
import { generateVisualization } from './services/geminiService';
import { VisualizationResponse, ViewMode } from './types';
import { Button } from './components/Button';
import { Visualizer } from './components/Visualizer';
import { CodeViewer } from './components/CodeViewer';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  Code, 
  Eye, 
  Download, 
  Search, 
  Zap, 
  Lightbulb,
  Maximize2,
  Minimize2,
  ChevronUp,
  ChevronDown,
  Info
} from 'lucide-react';

const SUGGESTIONS = [
  "Fourier Series",
  "Quaternion Rotation",
  "Pathfinding A* Algorithm",
  "Lorenz Attractor",
  "Double Pendulum Chaos",
  "Eigenvectors and Eigenvalues"
];

const App: React.FC = () => {
  const [concept, setConcept] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<VisualizationResponse | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.VISUALIZATION);
  const [hasSearched, setHasSearched] = useState(false);
  const [showExplanation, setShowExplanation] = useState(true);

  const handleGenerate = async (e?: React.FormEvent, suggestion?: string) => {
    if (e) e.preventDefault();
    const query = suggestion || concept;
    
    if (!query.trim()) return;

    setConcept(query);
    setIsLoading(true);
    setError(null);
    setHasSearched(true);
    setViewMode(ViewMode.VISUALIZATION);
    // Reset explanation visibility on new generation
    setShowExplanation(true);

    try {
      const result = await generateVisualization(query);
      setData(result);
    } catch (err: any) {
      setError(err.message || "Failed to generate visualization. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = () => {
    if (!data) return;
    const blob = new Blob([data.html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${data.title.replace(/\s+/g, '_').toLowerCase()}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="h-screen w-screen bg-slate-900 text-slate-100 flex flex-col overflow-hidden">
      
      {/* Dynamic Header */}
      <motion.nav 
        layout
        className={`z-50 border-b border-slate-800 bg-slate-900/80 backdrop-blur-md flex items-center justify-between transition-all duration-500 ${hasSearched ? 'px-4 py-3 h-16' : 'h-0 opacity-0 overflow-hidden pointer-events-none'}`}
      >
         <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-cyan-400 cursor-pointer" onClick={() => { setHasSearched(false); setData(null); setConcept(''); }}>
              <Zap className="h-5 w-5 fill-current" />
              <span className="font-bold text-lg tracking-tight text-white">Concept<span className="text-cyan-400">Viz</span></span>
            </div>

            {hasSearched && (
              <form onSubmit={(e) => handleGenerate(e)} className="relative group w-96 hidden md:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input
                  type="text"
                  value={concept}
                  onChange={(e) => setConcept(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-full pl-9 pr-4 py-1.5 text-sm text-slate-200 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all placeholder:text-slate-600"
                  placeholder="Visualize another concept..."
                />
              </form>
            )}
         </div>

         <div className="flex items-center gap-2">
            {data && (
              <>
                <div className="flex bg-slate-800 rounded-lg p-1 border border-slate-700">
                  <button onClick={() => setViewMode(ViewMode.VISUALIZATION)} className={`px-3 py-1 rounded text-xs font-medium transition-colors ${viewMode === ViewMode.VISUALIZATION ? 'bg-cyan-500/10 text-cyan-400' : 'text-slate-400 hover:text-slate-200'}`}>Visual</button>
                  <button onClick={() => setViewMode(ViewMode.CODE)} className={`px-3 py-1 rounded text-xs font-medium transition-colors ${viewMode === ViewMode.CODE ? 'bg-cyan-500/10 text-cyan-400' : 'text-slate-400 hover:text-slate-200'}`}>Code</button>
                </div>
                <Button variant="ghost" size="sm" onClick={handleExport} title="Download HTML">
                  <Download size={18} />
                </Button>
              </>
            )}
         </div>
      </motion.nav>

      <main className="flex-1 relative w-full h-full flex flex-col items-center justify-center">
        
        {/* Landing State */}
        <AnimatePresence>
          {!hasSearched && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50, scale: 0.95 }}
              transition={{ duration: 0.5 }}
              className="max-w-3xl w-full px-6 flex flex-col items-center text-center z-10"
            >
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="mb-8 p-4 bg-cyan-500/10 rounded-full ring-1 ring-cyan-500/30"
              >
                <Zap className="h-12 w-12 text-cyan-400 fill-current" />
              </motion.div>
              
              <h1 className="text-5xl sm:text-7xl font-bold text-white mb-6 tracking-tight">
                See the <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">math</span>.
              </h1>
              <p className="text-xl text-slate-400 mb-12 max-w-2xl font-light">
                Describe a concept. Get an interactive, code-generated visualization instantly. 
              </p>

              <div className="w-full max-w-xl relative group">
                <form onSubmit={(e) => handleGenerate(e)} className="relative z-10">
                   <input
                     type="text"
                     value={concept}
                     onChange={(e) => setConcept(e.target.value)}
                     placeholder="e.g. Fourier Transform, Sorting Algorithms..."
                     className="w-full bg-slate-800/50 backdrop-blur border border-slate-700 rounded-2xl pl-6 pr-32 py-5 text-lg text-white placeholder-slate-500 shadow-2xl focus:outline-none focus:border-cyan-500/50 focus:ring-4 focus:ring-cyan-500/10 transition-all"
                     autoFocus
                   />
                   <div className="absolute right-2 top-2 bottom-2">
                     <Button type="submit" className="h-full rounded-xl" disabled={!concept.trim()}>
                        Generate
                     </Button>
                   </div>
                </form>
                {/* Glow effect behind search */}
                <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
              </div>

              <div className="mt-10 flex flex-wrap justify-center gap-3">
                {SUGGESTIONS.map((s, i) => (
                  <motion.button
                    key={s}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + i * 0.1 }}
                    onClick={() => handleGenerate(undefined, s)}
                    className="px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-full text-sm text-slate-400 hover:text-cyan-400 hover:border-cyan-500/30 transition-all"
                  >
                    {s}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loading State */}
        <AnimatePresence>
          {isLoading && (
             <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/90 backdrop-blur-sm z-40"
             >
               <div className="relative">
                 <div className="h-16 w-16 rounded-full border-t-2 border-b-2 border-cyan-400 animate-spin"></div>
                 <div className="absolute inset-0 flex items-center justify-center">
                   <Sparkles className="h-6 w-6 text-cyan-400 animate-pulse" />
                 </div>
               </div>
               <p className="mt-8 text-cyan-400 font-mono text-sm tracking-widest uppercase animate-pulse">Computing Visualization...</p>
             </motion.div>
          )}
        </AnimatePresence>

        {/* Visualization / Content Area */}
        {hasSearched && !isLoading && data && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="w-full h-full relative flex flex-col"
          >
            {/* Main Content */}
            <div className="flex-1 w-full h-full relative overflow-hidden bg-slate-950">
               {viewMode === ViewMode.VISUALIZATION ? (
                 <Visualizer htmlContent={data.html} title={data.title} />
               ) : (
                 <div className="h-full overflow-auto p-4 md:p-8 max-w-5xl mx-auto">
                    <CodeViewer code={data.html} />
                 </div>
               )}
            </div>

            {/* Explanation Overlay Panel - Draggable-ish/Toggleable */}
            {viewMode === ViewMode.VISUALIZATION && (
              <motion.div 
                initial={{ opacity: 0, y: 50 }}
                animate={{ 
                  opacity: 1, 
                  y: 0,
                  height: showExplanation ? 'auto' : '48px',
                }}
                className="absolute bottom-6 left-6 right-6 md:left-auto md:right-6 md:w-96 bg-slate-900/90 backdrop-blur-md border border-slate-700 rounded-xl shadow-2xl overflow-hidden z-30 flex flex-col"
              >
                  <div 
                    className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-white/5 border-b border-white/5"
                    onClick={() => setShowExplanation(!showExplanation)}
                  >
                    <div className="flex items-center gap-2">
                      <Info size={16} className="text-cyan-400" />
                      <h3 className="font-semibold text-white text-sm">{data.title}</h3>
                    </div>
                    {showExplanation ? <ChevronDown size={16} className="text-slate-400" /> : <ChevronUp size={16} className="text-slate-400" />}
                  </div>

                  <AnimatePresence>
                    {showExplanation && (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="p-4 pt-2 text-sm text-slate-300 leading-relaxed"
                      >
                         {data.explanation}
                      </motion.div>
                    )}
                  </AnimatePresence>
              </motion.div>
            )}
          </motion.div>
        )}
        
        {/* Error State */}
        {error && (
            <div className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none">
                <div className="bg-red-500/10 border border-red-500/50 text-red-200 px-6 py-4 rounded-xl backdrop-blur-md pointer-events-auto max-w-md text-center">
                    <p className="font-semibold mb-2">Error Generating Visualization</p>
                    <p className="text-sm opacity-80">{error}</p>
                    <Button variant="outline" className="mt-4 border-red-500/30 text-red-300 hover:bg-red-500/20" onClick={() => handleGenerate()}>Try Again</Button>
                </div>
            </div>
        )}

      </main>
    </div>
  );
};

export default App;