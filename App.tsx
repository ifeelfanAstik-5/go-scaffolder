
import React, { useState } from 'react';
import { ProjectConfig, GeneratedFile, GenerationState } from './types';
import { generateGoProject } from './services/geminiService';
import { 
  Terminal, 
  FolderPlus, 
  Code2, 
  CheckCircle2, 
  Copy, 
  Download, 
  Loader2,
  ChevronRight,
  ChevronDown,
  FileCode,
  Box,
  Layers,
  Database,
  Cloud,
  FileJson,
  Layout
} from 'lucide-react';

const ARCHITECTURES = [
  { id: 'Standard', name: 'Standard Layout', description: 'GitHub standard project layout (cmd/, internal/, pkg/)', icon: Layers },
  { id: 'Clean', name: 'Clean Architecture', description: 'Domain-driven design with layers (domain, usecase, delivery)', icon: Box },
  { id: 'Flat', name: 'Flat Structure', description: 'Simple, flat file structure for small projects', icon: Layout },
];

const FEATURES = [
  { id: 'sql', name: 'SQL Database (GORM)', icon: Database },
  { id: 'rest', name: 'REST API (Gin)', icon: Cloud },
  { id: 'grpc', name: 'gRPC Support', icon: Terminal },
  { id: 'docker', name: 'Docker & Compose', icon: FileJson },
  { id: 'env', name: 'Env Configuration', icon: Code2 },
  { id: 'testing', name: 'Unit Testing Setup', icon: CheckCircle2 },
];

const App: React.FC = () => {
  const [config, setConfig] = useState<ProjectConfig>({
    projectName: 'my-go-app',
    moduleName: 'github.com/username/my-go-app',
    architecture: 'Standard',
    features: ['rest', 'env'],
  });

  const [state, setState] = useState<GenerationState>({
    isGenerating: false,
    error: null,
    files: [],
  });

  const [selectedFilePath, setSelectedFilePath] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    setState({ ...state, isGenerating: true, error: null });
    try {
      const result = await generateGoProject(config);
      setState({ isGenerating: false, files: result, error: null });
      if (result.length > 0) {
        setSelectedFilePath(result[0].path);
      }
    } catch (err: any) {
      setState({ ...state, isGenerating: false, error: err.message });
    }
  };

  const handleCopyCode = () => {
    const file = state.files.find(f => f.path === selectedFilePath);
    if (file) {
      navigator.clipboard.writeText(file.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownloadZip = () => {
    // In a real app, we'd use jszip or similar, but for this demo 
    // we'll just show a success message or handle as needed
    alert("In a production environment, this would download a ZIP of your project files.");
  };

  const selectedFile = state.files.find(f => f.path === selectedFilePath);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-slate-900 border-b border-slate-800 p-4 sticky top-0 z-10 shadow-xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-sky-500 p-2 rounded-lg">
              <Terminal className="text-white w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight">GoScaffold <span className="text-sky-400">Pro</span></h1>
              <p className="text-xs text-slate-400">Intelligent Golang Project Generator</p>
            </div>
          </div>
          <button 
            onClick={handleGenerate}
            disabled={state.isGenerating}
            className="bg-sky-600 hover:bg-sky-500 disabled:bg-slate-700 text-white px-6 py-2.5 rounded-full font-semibold flex items-center gap-2 transition-all shadow-lg active:scale-95"
          >
            {state.isGenerating ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <FolderPlus className="w-4 h-4" />
            )}
            {state.isGenerating ? 'Synthesizing Project...' : 'Generate Project'}
          </button>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden">
        {/* Configuration Sidebar */}
        <aside className="w-full md:w-80 bg-slate-900/50 border-r border-slate-800 overflow-y-auto p-6 space-y-8 scrollbar-hide">
          <section>
            <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Identity</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Project Name</label>
                <input 
                  type="text"
                  value={config.projectName}
                  onChange={(e) => setConfig({ ...config, projectName: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all"
                  placeholder="my-cool-app"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Module Name</label>
                <input 
                  type="text"
                  value={config.moduleName}
                  onChange={(e) => setConfig({ ...config, moduleName: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all"
                  placeholder="github.com/user/repo"
                />
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Architecture</h2>
            <div className="space-y-3">
              {ARCHITECTURES.map((arch) => (
                <button
                  key={arch.id}
                  onClick={() => setConfig({ ...config, architecture: arch.id as any })}
                  className={`w-full text-left p-3 rounded-xl border transition-all ${
                    config.architecture === arch.id 
                    ? 'bg-sky-500/10 border-sky-500' 
                    : 'bg-slate-800/50 border-slate-700 hover:border-slate-500'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-1">
                    <arch.icon className={`w-4 h-4 ${config.architecture === arch.id ? 'text-sky-400' : 'text-slate-400'}`} />
                    <span className="text-sm font-semibold text-white">{arch.name}</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">{arch.description}</p>
                </button>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Features</h2>
            <div className="grid grid-cols-1 gap-2">
              {FEATURES.map((feat) => (
                <label 
                  key={feat.id}
                  className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                    config.features.includes(feat.id)
                    ? 'bg-slate-800 border-sky-500/50'
                    : 'bg-slate-900/30 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <input 
                    type="checkbox"
                    className="hidden"
                    checked={config.features.includes(feat.id)}
                    onChange={() => {
                      if (config.features.includes(feat.id)) {
                        setConfig({ ...config, features: config.features.filter(f => f !== feat.id) });
                      } else {
                        setConfig({ ...config, features: [...config.features, feat.id] });
                      }
                    }}
                  />
                  <feat.icon className={`w-4 h-4 ${config.features.includes(feat.id) ? 'text-sky-400' : 'text-slate-500'}`} />
                  <span className={`text-sm ${config.features.includes(feat.id) ? 'text-white' : 'text-slate-400'}`}>{feat.name}</span>
                  {config.features.includes(feat.id) && <CheckCircle2 className="w-3.5 h-3.5 text-sky-400 ml-auto" />}
                </label>
              ))}
            </div>
          </section>
        </aside>

        {/* Content Area */}
        <div className="flex-1 flex flex-col bg-slate-950 relative">
          {state.files.length === 0 && !state.isGenerating && (
            <div className="flex-1 flex items-center justify-center p-8 text-center">
              <div className="max-w-md">
                <div className="bg-slate-900 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
                  <Code2 className="w-10 h-10 text-sky-500" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-3">Ready to Scaffold?</h2>
                <p className="text-slate-400 mb-8 leading-relaxed">
                  Configure your project identity and architecture on the left, then hit "Generate" to build a production-ready Go project structure.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-900 rounded-xl border border-slate-800">
                    <p className="text-sky-400 font-bold text-xl mb-1">100%</p>
                    <p className="text-xs text-slate-500 uppercase tracking-tighter">Idiomatic Go</p>
                  </div>
                  <div className="p-4 bg-slate-900 rounded-xl border border-slate-800">
                    <p className="text-sky-400 font-bold text-xl mb-1">JSON</p>
                    <p className="text-xs text-slate-500 uppercase tracking-tighter">Ready Output</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {state.isGenerating && (
            <div className="absolute inset-0 z-20 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center">
              <div className="text-center">
                <Loader2 className="w-12 h-12 text-sky-500 animate-spin mx-auto mb-4" />
                <p className="text-lg font-medium text-white">Gemini is thinking...</p>
                <p className="text-sm text-slate-400">Architecting your Golang project based on your preferences</p>
              </div>
            </div>
          )}

          {state.files.length > 0 && (
            <div className="flex-1 flex overflow-hidden">
              {/* File Explorer */}
              <div className="w-64 bg-slate-900/40 border-r border-slate-800 overflow-y-auto">
                <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Files</h3>
                  <button onClick={handleDownloadZip} className="text-slate-400 hover:text-white transition-colors">
                    <Download className="w-4 h-4" />
                  </button>
                </div>
                <div className="p-2">
                  {state.files.map((file) => (
                    <button
                      key={file.path}
                      onClick={() => setSelectedFilePath(file.path)}
                      className={`w-full text-left flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm mb-0.5 transition-all ${
                        selectedFilePath === file.path 
                        ? 'bg-sky-500/10 text-sky-400' 
                        : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                      }`}
                    >
                      <FileCode className="w-4 h-4 flex-shrink-0" />
                      <span className="truncate">{file.path}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Code Preview */}
              <div className="flex-1 flex flex-col overflow-hidden">
                <div className="bg-slate-900 p-3 border-b border-slate-800 flex items-center justify-between px-6">
                  <div className="flex items-center gap-3">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50"></div>
                    </div>
                    <span className="text-xs text-slate-400 font-mono ml-4">{selectedFilePath}</span>
                  </div>
                  <button 
                    onClick={handleCopyCode}
                    className="flex items-center gap-2 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-lg transition-all active:scale-95"
                  >
                    {copied ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />
                        <span className="text-green-400">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Code</span>
                      </>
                    )}
                  </button>
                </div>
                <div className="flex-1 overflow-auto bg-[#0a0f1a] p-6 font-mono text-sm leading-relaxed scrollbar-thin">
                  <pre className="text-slate-300">
                    <code>{selectedFile?.content}</code>
                  </pre>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer / Status Bar */}
      <footer className="bg-slate-900 border-t border-slate-800 px-6 py-2 flex items-center justify-between text-[10px] text-slate-500 font-mono">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]"></span>
            <span>SYSTEM READY</span>
          </div>
          <div className="flex items-center gap-2 uppercase">
            <Layers className="w-3 h-3" />
            <span>ARCH: {config.architecture}</span>
          </div>
          <div className="flex items-center gap-2 uppercase">
            <Code2 className="w-3 h-3" />
            <span>GO VERSION: 1.21+</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span>{state.files.length} FILES GENERATED</span>
          <span>GEMINI-3-PRO-PREVIEW</span>
        </div>
      </footer>
    </div>
  );
};

export default App;
