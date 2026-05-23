import { useState, useEffect, useRef, useMemo, FormEvent } from 'react';
import { 
  Activity, 
  Database, 
  Sparkles, 
  Cpu, 
  Layers, 
  Terminal, 
  User, 
  Plus, 
  Trash2, 
  Play, 
  Pause, 
  Download, 
  Search, 
  AlertTriangle, 
  CheckCircle, 
  RefreshCw, 
  Heart, 
  Smile, 
  FileText, 
  Sliders, 
  Shield, 
  Zap,
  Volume2,
  VolumeX,
  PlusCircle,
  DatabaseZap,
  Info,
  ExternalLink
} from 'lucide-react';

// Types for our telemetry logs
interface LogEntry {
  id: string;
  timestamp: string;
  type: 'INFO' | 'PIPE' | 'DATA' | 'WARN' | 'ERROR';
  message: string;
}

// Types for user mood entry (persisted in localStorage)
interface MoodEntry {
  id: string;
  vibe: string;
  intensity: number;
  notes: string;
  timestamp: string;
}

export default function App() {
  // Sound FX and Mute controller
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Active view tab state: 'telemetry' | 'ai' | 'sqlite' | 'wearable' | 'emotional'
  const [activeTab, setActiveTab] = useState<'telemetry' | 'ai' | 'sqlite' | 'wearable' | 'emotional'>('telemetry');

  // Unified telemetry logs
  const [logs, setLogs] = useState<LogEntry[]>([
    { id: '1', timestamp: '14:22:01', type: 'INFO', message: 'Wearable ingestion service synchronized with device: AppleWatch_9_42A' },
    { id: '2', timestamp: '14:22:05', type: 'PIPE', message: 'Gemini API: Prompting structured wellness insights for user_id: 84491' },
    { id: '3', timestamp: '14:22:09', type: 'DATA', message: 'SQLite: Vacuuming mood_logs table (4.2ms)' },
    { id: '4', timestamp: '14:22:15', type: 'INFO', message: 'Token refresh successful for service account: admin@wellnessos.ai' },
    { id: '5', timestamp: '14:22:20', type: 'WARN', message: 'Bluetooth latency spike detected on node_3 (320ms)' },
    { id: '6', timestamp: '14:22:25', type: 'PIPE', message: 'AI Response received: Wellness score updated (88/100)' },
    { id: '7', timestamp: '14:22:30', type: 'DATA', message: 'New entry in activities table: session_id_9921_type_running' },
    { id: '8', timestamp: '14:22:42', type: 'INFO', message: 'Broadcasting real-time update to Flutter client via WebSocket: f_client_92' },
  ]);

  // Is telemetry simulation active (continuous inbound flux)
  const [simActive, setSimActive] = useState<boolean>(true);

  // General control states
  const [serviceStatus, setServiceStatus] = useState<'Operational' | 'Maintenance' | 'Degraded'>('Operational');
  const [apiLatency, setApiLatency] = useState<number>(42);
  const [bpmInput, setBpmInput] = useState<number>(72);
  const [wearableState, setWearableState] = useState<string>('AppleWatch_9_42A');

  // Database count values
  const [dbUserLogs, setDbUserLogs] = useState<number>(1249112);
  const [dbMoodIndices, setDbMoodIndices] = useState<number>(84204);
  const [dbWearableBuffer, setDbWearableBuffer] = useState<number>(12.5);

  // AI Generation configuration
  const [reportFileName, setReportFileName] = useState<string>('wellness_report_v4.pdf');
  const [aiAccuracy, setAiAccuracy] = useState<number>(94);
  const [isGeneratingReport, setIsGeneratingReport] = useState<boolean>(false);
  const [reportProgress, setReportProgress] = useState<number>(94);

  // AI Pipeline Sandbox Model simulation fields
  const [geminiPrompt, setGeminiPrompt] = useState<string>('Analyze sleep patterns and high cardiac elevation during mid-day sprint.');
  const [geminiTemperature, setGeminiTemperature] = useState<number>(0.15);
  const [geminiSafetyLevel, setGeminiSafetyLevel] = useState<string>('BLOCK_MEDIUM_AND_ABOVE');
  const [geminiIsQuerying, setGeminiIsQuerying] = useState<boolean>(false);
  const [customResponseJSON, setCustomResponseJSON] = useState<string | null>(null);

  // SQLite Schema Sandbox migration state & lists
  const [activeTables, setActiveTables] = useState<Array<{ name: string; rows: number; status: string }>>([
    { name: 'users', rows: 4210, status: 'synced' },
    { name: 'mood_logs', rows: 84204, status: 'live' },
    { name: 'wearable_buffers', rows: 15301, status: 'spooling' },
    { name: 'activities', rows: 1249112, status: 'indexed' },
    { name: 'system_vars', rows: 12, status: 'static' },
  ]);
  const [sqlQuery, setSqlQuery] = useState<string>('SELECT * FROM mood_logs ORDER BY intensity DESC LIMIT 5;');
  const [sqlQueryResult, setSqlQueryResult] = useState<any[] | null>(null);
  const [sqlQueryError, setSqlQueryError] = useState<string | null>(null);

  // Mood Logs Manager persistence
  const [moodLogs, setMoodLogs] = useState<MoodEntry[]>(() => {
    const saved = localStorage.getItem('sleek_mood_logs');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return []; }
    }
    return [
      { id: 'm1', vibe: 'Focused', intensity: 9, notes: 'Completed full backend schema design optimization sprint.', timestamp: '2026-05-23 09:30' },
      { id: 'm2', vibe: 'Calm', intensity: 7, notes: 'Morning mindfulness walk completed. Heartbeat rate remained nominal.', timestamp: '2026-05-23 08:15' },
    ];
  });
  const [newMoodVibe, setNewMoodVibe] = useState<string>('Focused');
  const [newMoodIntensity, setNewMoodIntensity] = useState<number>(8);
  const [newMoodNotes, setNewMoodNotes] = useState<string>('');

  // Device Sync stats
  const [batteryLevel, setBatteryLevel] = useState<number>(84);
  const [continuousWearableFlux, setContinuousWearableFlux] = useState<boolean>(true);

  // Generate beautiful sound clicks via AudioContext
  const playSound = (type: 'click' | 'success' | 'warn' | 'error') => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      if (type === 'click') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.08);
        gain.gain.setValueAtTime(0.04, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
        osc.start();
        osc.stop(ctx.currentTime + 0.1);
      } else if (type === 'success') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(440, ctx.currentTime);
        osc.frequency.setValueAtTime(880, ctx.currentTime + 0.08);
        gain.gain.setValueAtTime(0.05, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.22);
        osc.start();
        osc.stop(ctx.currentTime + 0.25);
      } else if (type === 'warn') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220, ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(110, ctx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.04, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.16);
        osc.start();
        osc.stop(ctx.currentTime + 0.17);
      } else if (type === 'error') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(150, ctx.currentTime);
        osc.frequency.setValueAtTime(120, ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.06, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
        osc.start();
        osc.stop(ctx.currentTime + 0.3);
      }
    } catch (e) {
      // Audio stream error handled silently
    }
  };

  // Helper function to append telemetry logs dynamically
  const addLog = (type: 'INFO' | 'PIPE' | 'DATA' | 'WARN' | 'ERROR', message: string) => {
    const formatTime = () => {
      const now = new Date();
      return now.toTimeString().split(' ')[0];
    };
    const newEntry: LogEntry = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: formatTime(),
      type,
      message,
    };
    setLogs(prev => {
      // Keep up to 50 logs for performance and cleanliness
      const list = [...prev, newEntry];
      if (list.length > 50) return list.slice(list.length - 50);
      return list;
    });
  };

  // Generate periodic background telemetry
  useEffect(() => {
    if (!simActive) return;

    const interval = setInterval(() => {
      // Fluctuate latency slightly
      setApiLatency(prev => {
        const delta = Math.floor(Math.random() * 5) - 2;
        const target = prev + delta;
        return Math.max(12, Math.min(180, target));
      });

      // Heartbeat pulse slightly changes
      if (continuousWearableFlux) {
        setBpmInput(prev => {
          const delta = Math.floor(Math.random() * 3) - 1;
          const target = prev + delta;
          return Math.max(55, Math.min(140, target));
        });
      }

      // Slowly increment SQLite writes
      setDbUserLogs(prev => prev + Math.floor(Math.random() * 4));
      if (Math.random() > 0.8) {
        setDbWearableBuffer(prev => {
          const inc = parseFloat((Math.random() * 0.1).toFixed(2));
          return parseFloat((prev + inc).toFixed(1));
        });
      }

      // Random logs to stream
      const logsTemplates = [
        { type: 'INFO', message: 'Broadcasting packet sync indices to Flutter clients' },
        { type: 'DATA', message: 'SQLite transaction commitment: synced mood telemetry frame' },
        { type: 'PIPE', message: 'Gemini ingestion pipeline parsed active mood sensor logs' },
        { type: 'INFO', message: 'Heart Rate activity threshold within stable band' },
        { type: 'WARN', message: 'Bluetooth RSSI level deviation registered on wrist receptor' },
      ];

      if (Math.random() > 0.7) {
        const log = logsTemplates[Math.floor(Math.random() * logsTemplates.length)];
        addLog(log.type as any, log.message);
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [simActive, continuousWearableFlux]);

  // Handle saving emotional state entry
  const handleAddMood = (e: FormEvent) => {
    e.preventDefault();
    if (!newMoodNotes.trim()) {
      playSound('error');
      alert('Please fill out the notes context for this emotional record.');
      return;
    }
    playSound('success');
    const now = new Date();
    const formattedDate = `${now.toISOString().slice(0, 10)} ${now.toTimeString().slice(0, 5)}`;
    const newItem: MoodEntry = {
      id: Math.random().toString(36).substr(2, 9),
      vibe: newMoodVibe,
      intensity: newMoodIntensity,
      notes: newMoodNotes,
      timestamp: formattedDate
    };

    const updated = [newItem, ...moodLogs];
    setMoodLogs(updated);
    localStorage.setItem('sleek_mood_logs', JSON.stringify(updated));

    // Update SQLite metrics dynamically
    setDbMoodIndices(prev => prev + 1);
    addLog('DATA', `SQLite: Ingested emotional vector entry (${newMoodVibe} - Level ${newMoodIntensity}) with auto-sentiment analyzer.`);
    setNewMoodNotes('');
  };

  // Delete mood log entry
  const handleDeleteMood = (id: string) => {
    playSound('warn');
    const filtered = moodLogs.filter(item => item.id !== id);
    setMoodLogs(filtered);
    localStorage.setItem('sleek_mood_logs', JSON.stringify(filtered));
    setDbMoodIndices(prev => Math.max(0, prev - 1));
    addLog('DATA', 'SQLite: Deprecated mood score and updated structural indices');
  };

  // Run dynamic simulated PDF wellness report generation
  const handleTriggerReportReport = () => {
    if (isGeneratingReport) return;
    playSound('success');
    setIsGeneratingReport(true);
    setReportProgress(0);
    addLog('PIPE', `Gemini Ingestion Flow: Initializing layout compiler for ${reportFileName}`);

    const interval = setInterval(() => {
      setReportProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsGeneratingReport(false);
          addLog('INFO', `Successfully compiled and dispatched model statistics summary to: /public/exports/${reportFileName}`);
          playSound('success');
          return 100;
        }
        return prev + 5;
      });
    }, 150);
  };

  // Simulated Custom SQL runner engine
  const handleExecuteSQL = (e?: FormEvent) => {
    if (e) e.preventDefault();
    playSound('click');
    setSqlQueryError(null);
    setSqlQueryResult(null);

    // simple offline parsing mock
    const queryLower = sqlQuery.toLowerCase().trim();

    if (queryLower.startsWith('select')) {
      if (queryLower.includes('mood_logs')) {
        // filter or map mock mood logs
        const results = moodLogs.slice(0, 5).map(m => ({
          id: m.id,
          vector_vibe: m.vibe,
          intensity: m.intensity,
          context_narrative: m.notes.length > 30 ? m.notes.slice(0, 30) + '...' : m.notes,
          captured_at: m.timestamp
        }));
        setSqlQueryResult(results);
        addLog('DATA', `SQLite query OK: Returned ${results.length} records matching criteria.`);
      } else if (queryLower.includes('users')) {
        setSqlQueryResult([
          { id: 84491, full_name: 'Sophia Rivers', role: 'Senior Integration Architect', verified: 1 },
          { id: 99120, full_name: 'Marcus Miller', role: 'Telemetry Lead', verified: 1 },
          { id: 10421, full_name: 'Dr. Evelyn Carter', role: 'Principal Bio-Informatics Specialist', verified: 0 }
        ]);
        addLog('DATA', 'SQLite query OK: Returned 3 active system profiles.');
      } else if (queryLower.includes('wearable_buffers')) {
        setSqlQueryResult([
          { session_id: 'S_Apple921', metric: 'BPM', frame_count: 4096, stream_rate_hz: 50 },
          { session_id: 'S_Apple921', metric: 'ACCEL_X', frame_count: 8192, stream_rate_hz: 100 },
          { session_id: 'S_Apple921', metric: 'PPG_STABLE', frame_count: 2048, stream_rate_hz: 25 }
        ]);
        addLog('DATA', 'SQLite query OK: Pulled 3 operational active raw memory channels.');
      } else {
        setSqlQueryResult([
          { sys_key: 'sqlite_wal_mode', sys_val: '1' },
          { sys_key: 'active_sensor_pipeline_version', sys_val: 'v4.1.2' },
          { sys_key: 'websocket_broadcaster_connected', sys_val: '92' }
        ]);
        addLog('DATA', 'SQLite query OK: Pulled core properties configurations table.');
      }
    } else if (queryLower.startsWith('vacuum') || queryLower.startsWith('optimize')) {
      addLog('DATA', 'SQLite command successful: VACUUM execution completed (3.1ms)');
      setSqlQueryResult([{ result_message: 'VACUUM command finished. Free memory reclaimed: 412 KB' }]);
    } else if (queryLower.startsWith('insert') || queryLower.startsWith('update')) {
      addLog('DATA', 'Executed write manipulation on SQLite instances.');
      setSqlQueryResult([{ rows_affected: 1, last_inserted_rowid: Math.floor(Math.random() * 10000) }]);
    } else {
      setSqlQueryError("Syntax Error: Unsupported keyword near token '" + sqlQuery.split(' ')[0] + "'. Only SELECT, VACUUM, INSERT, and UPDATE keywords are calibrated for this interactive control telemetry view.");
      playSound('error');
    }
  };

  // Run Simulated Gemini Model structured prompting
  const handleQueryGeminiPipeline = (e: FormEvent) => {
    e.preventDefault();
    if (!geminiPrompt.trim()) {
      playSound('error');
      return;
    }
    playSound('success');
    setGeminiIsQuerying(true);
    setCustomResponseJSON(null);
    addLog('PIPE', `Gemini API: Constructing prompt telemetry model with temperature: ${geminiTemperature}`);

    setTimeout(() => {
      setGeminiIsQuerying(false);
      playSound('success');
      
      const structuredOutput = {
        meta: {
          analyzed_prompt: geminiPrompt,
          processed_at: "2026-05-23T10:17:01Z",
          engine_flavor: "gemini-3.5-flash",
          confidence_score: (100 - (geminiTemperature * 12)).toFixed(1) + "%"
        },
        telemetry_classification: {
          detected_activity: geminiPrompt.toLowerCase().includes('run') || geminiPrompt.toLowerCase().includes('sprint') ? "HIGHRATE_EXERCISE" : "SEDENTARY_STRESS",
          stress_index: geminiPrompt.toLowerCase().includes('stress') || geminiPrompt.toLowerCase().includes('sprint') ? "8.4 / 10" : "3.1 / 10",
          cardiac_signature: "Sinus Tachycardia (Fluctuating range 110-142 BPM)",
          clinical_action_flag: false
        },
        gemini_prescriptive_insights: [
          "Autonomic nervous system activation is consistent with metabolic demand expansion.",
          "Suggest adjusting rest ratios to lower cortisol spikes and buffer sustained lactic accumulation.",
          "Optimize sleep schedules: sleep efficiency is simulated at 89.2% for nominal biological state."
        ]
      };

      setCustomResponseJSON(JSON.stringify(structuredOutput, null, 2));
      addLog('PIPE', `Gemini Ingestion Pipeline: Model returned structured JSON response successfully.`);
    }, 1800);
  };

  // Save telemetry log list to a local file
  const handleExportLogs = () => {
    playSound('click');
    const content = logs.map(l => `[${l.type}] ${l.timestamp} - ${l.message}`).join('\n');
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `wellness_os_telemetry_${Date.now()}.log`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    addLog('INFO', 'Exported telemetry console log history to localized text standard.');
  };

  // Immediate manual event injections
  const injectEvent = (type: string) => {
    if (type === 'latency') {
      playSound('warn');
      setApiLatency(342);
      addLog('WARN', 'Bluetooth latency spike injected on segment: node_3 (342ms latency)');
    } else if (type === 'vacuum') {
      playSound('success');
      addLog('DATA', 'Manual command executed: SQLite DB VACUUM fully optimized. Released 1.4MB disk allocation.');
    } else if (type === 'sync') {
      playSound('success');
      addLog('INFO', 'Successfully requested external secure token handshake validation for admin@wellnessos.ai');
    } else if (type === 'disconnect') {
      playSound('error');
      addLog('ERROR', 'Critically disconnected wearable device socket endpoint client protocol: AppleWatch_9_42A');
    }
  };

  // Statistics summaries
  const avgIntensity = useMemo(() => {
    if (moodLogs.length === 0) return 0;
    const sum = moodLogs.reduce((acc, curr) => acc + curr.intensity, 0);
    return parseFloat((sum / moodLogs.length).toFixed(1));
  }, [moodLogs]);

  const moodCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    moodLogs.forEach(entry => {
      counts[entry.vibe] = (counts[entry.vibe] || 0) + 1;
    });
    return counts;
  }, [moodLogs]);

  return (
    <div id="telemetry-dashboard-container" className="w-full min-h-screen bg-[#0A0E14] text-slate-300 flex flex-col lg:flex-row overflow-hidden font-sans">
      
      {/* SIDEBAR NAVIGATION PANEL */}
      <aside id="sidebar-panel" className="w-full lg:w-64 bg-[#0F141C] border-b lg:border-b-0 lg:border-r border-slate-800 flex flex-col flex-shrink-0 transition-all duration-300">
        
        {/* LOGO & SOUNDS ROW */}
        <div className="p-6 flex items-center justify-between border-b border-slate-800/60">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-600/20">
              <Activity className="w-4 h-4 text-white animate-pulse" />
            </div>
            <div>
              <span className="text-white font-bold tracking-tight text-lg">WellnessOS</span>
              <p className="text-[9px] text-slate-500 font-mono tracking-widest mt-[-2px]">V4.1 LIVE</p>
            </div>
          </div>

          {/* Sound FX state manager */}
          <button 
            id="mute-sound-btn"
            onClick={() => {
              setSoundEnabled(!soundEnabled);
              // play subtle sound before disabling if toggled back
              if (!soundEnabled) {
                setTimeout(() => playSound('click'), 50);
              }
            }}
            className={`p-1.5 rounded-md border transition-all ${soundEnabled ? 'border-indigo-500/20 text-indigo-400 bg-indigo-500/5 hover:bg-indigo-500/10' : 'border-slate-800 text-slate-500 hover:text-slate-400'}`}
            title={soundEnabled ? "Disable interface audio effects" : "Enable interface audio effects"}
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
          </button>
        </div>
        
        {/* MENU GROUPS */}
        <nav className="flex-1 px-4 py-6 space-y-7 overflow-y-auto">
          
          {/* SYSTEM INFRASTRUCTURE CATEGORY */}
          <div>
            <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest mb-3 px-2">
              System Infrastructure
            </div>
            <div className="space-y-1">
              <button 
                id="tab-telemetry-engine"
                onClick={() => { setActiveTab('telemetry'); playSound('click'); }}
                className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-medium flex items-center justify-between transition-all ${
                  activeTab === 'telemetry' 
                    ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/20' 
                    : 'text-slate-400 hover:bg-slate-800/50 hover:text-white border border-transparent'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className={`w-1.5 h-1.5 rounded-full ${activeTab === 'telemetry' ? 'bg-indigo-400' : 'bg-slate-600'}`}></div>
                  Telemetry Engine
                </div>
                {simActive && activeTab === 'telemetry' && (
                  <span className="flex h-1.5 w-1.5 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                  </span>
                )}
              </button>

              <button 
                id="tab-ai-ingestion"
                onClick={() => { setActiveTab('ai'); playSound('click'); }}
                className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-medium flex items-center gap-2.5 transition-all ${
                  activeTab === 'ai' 
                    ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/20' 
                    : 'text-slate-400 hover:bg-slate-800/50 hover:text-white border border-transparent'
                }`}
              >
                <div className={`w-1.5 h-1.5 rounded-full ${activeTab === 'ai' ? 'bg-indigo-400' : 'bg-slate-600'}`}></div>
                AI Ingestion Layer
              </button>

              <button 
                id="tab-sqlite-migrations"
                onClick={() => { setActiveTab('sqlite'); playSound('click'); }}
                className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-medium flex items-center gap-2.5 transition-all ${
                  activeTab === 'sqlite' 
                    ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/20' 
                    : 'text-slate-400 hover:bg-slate-800/50 hover:text-white border border-transparent'
                }`}
              >
                <div className={`w-1.5 h-1.5 rounded-full ${activeTab === 'sqlite' ? 'bg-indigo-400' : 'bg-slate-600'}`}></div>
                SQLite Migrations
              </button>
            </div>
          </div>
          
          {/* HEALTH MODULES CATEGORY */}
          <div>
            <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest mb-3 px-2">
              Health Modules
            </div>
            <div className="space-y-1">
              <button 
                id="tab-wearable-sync"
                onClick={() => { setActiveTab('wearable'); playSound('click'); }}
                className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-medium flex items-center gap-2.5 transition-all ${
                  activeTab === 'wearable' 
                    ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/20' 
                    : 'text-slate-400 hover:bg-slate-800/50 hover:text-white border border-transparent'
                }`}
              >
                <div className={`w-1.5 h-1.5 rounded-full ${activeTab === 'wearable' ? 'bg-indigo-400' : 'bg-slate-600'}`}></div>
                Wearable Sync
              </button>

              <button 
                id="tab-emotional-logs"
                onClick={() => { setActiveTab('emotional'); playSound('click'); }}
                className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-medium flex items-center justify-between transition-all ${
                  activeTab === 'emotional' 
                    ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/20' 
                    : 'text-slate-400 hover:bg-slate-800/50 hover:text-white border border-transparent'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className={`w-1.5 h-1.5 rounded-full ${activeTab === 'emotional' ? 'bg-indigo-400' : 'bg-slate-600'}`}></div>
                  Emotional Logs
                </div>
                {moodLogs.length > 0 && (
                  <span className="bg-indigo-500/20 text-indigo-300 text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-md">
                    {moodLogs.length}
                  </span>
                )}
              </button>
            </div>
          </div>
        </nav>
        
        {/* FOOTER USER PROFILE INFORMATION */}
        <div id="sidebar-user-footer" className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3 bg-slate-800/40 p-3 rounded-lg border border-slate-800">
            <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-xs font-bold text-emerald-950 shadow-md shadow-emerald-500/10">
              SR
            </div>
            <div className="flex-1 overflow-hidden">
              <div className="text-xs font-bold text-white truncate">S. Rivers</div>
              <div className="text-[10px] text-slate-500 font-mono">Senior Backend Eng</div>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN LAYOUT CANVAS */}
      <main id="main-content-canvas" className="flex-1 flex flex-col p-6 lg:p-8 overflow-y-auto max-w-7xl mx-auto w-full">
        
        {/* HEADER / TELEMETRY STATUS AND ACTIONS */}
        <header id="dashboard-header" className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl font-bold tracking-tight text-white">Backend Control Systems</h1>
              <span className="bg-[#141B26] border border-slate-800 text-slate-400 text-[10px] font-mono px-2 py-0.5 rounded uppercase">
                {activeTab}
              </span>
            </div>
            <p className="text-slate-400 text-xs sm:text-sm">
              Monitoring Gemini AI pipelines &amp; Flutter telemetry streams in active production containers.
            </p>
          </div>

          {/* ACTIVE STATUS SWITCHER & LATENCY MONITORS */}
          <div className="flex items-center gap-3 self-start sm:self-auto">
            {/* Status controller */}
            <div className="bg-[#141B26] border border-slate-800 p-1.5 rounded-lg flex items-center gap-1.5">
              <span className="text-[10px] font-mono text-slate-500 px-1">STATUS:</span>
              <select
                id="status-controller-select"
                value={serviceStatus}
                onChange={(e) => {
                  const status = e.target.value as any;
                  setServiceStatus(status);
                  if (status === 'Operational') {
                    playSound('success');
                    addLog('INFO', 'System reported state transition: ALL CORE PIPELINES OPERATIONAL');
                  } else if (status === 'Maintenance') {
                    playSound('warn');
                    addLog('WARN', 'System reporting switch to MAINTENANCE WINDOW: Rate limiting active');
                  } else {
                    playSound('error');
                    addLog('ERROR', 'System reported segment DEGRADED: Bluetooth queues spilling on node_3');
                  }
                }}
                className="bg-[#0A0E14] text-xs font-semibold text-slate-300 border border-slate-800 py-0.5 px-2 rounded focus:outline-none cursor-pointer focus:border-indigo-500"
              >
                <option value="Operational">🟢 Operational</option>
                <option value="Maintenance">🟡 Maintenance</option>
                <option value="Degraded">🔴 Degraded</option>
              </select>
            </div>

            {/* Dynamic Latency Widget */}
            <div className="bg-[#141B26] border border-slate-800 px-4 py-2 rounded-lg text-center min-w-[76px]">
              <div id="service-status-sub" className="text-[10px] text-indigo-400 uppercase font-mono tracking-wider font-bold">API Latency</div>
              <div id="latency-indicator-val" className={`text-lg font-mono font-bold ${apiLatency > 200 ? 'text-amber-400' : 'text-indigo-400'}`}>
                {apiLatency}ms
              </div>
            </div>
          </div>
        </header>

        {/* METRIC GRID PANEL - SHOWN MAINLY ON TELEMETRY ENGINE */}
        {activeTab === 'telemetry' && (
          <div id="metric-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            
            {/* CARD 1: WEARABLE INGESTION CHART */}
            <div id="card-wearable-ingestion" className="bg-[#141B26] rounded-xl p-5 border border-slate-800/90 shadow-xl flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-2">
                    <Heart className="w-4 h-4 text-rose-500 animate-pulse" />
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Wearable Ingestion</span>
                  </div>
                  <span className="text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded">
                    {simActive ? '82 req/s' : '0 req/s'}
                  </span>
                </div>
                
                {/* Simulated Influx Graph */}
                <div className="h-24 flex items-end gap-1.5 px-1 bg-[#0A0E14]/60 rounded-lg p-2 border border-slate-800 mb-4 group relative">
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-[#0F141C]/90 text-[10px] font-mono text-center px-2 py-1 transition-all rounded">
                    Heartbeat dynamic rate: {bpmInput} BPM. Bluetooth socket active.
                  </div>
                  <div style={{ height: '42%' }} className="flex-1 bg-indigo-500/40 rounded-t-sm transition-all duration-300"></div>
                  <div style={{ height: '58%' }} className="flex-1 bg-indigo-500/50 rounded-t-sm transition-all duration-300"></div>
                  <div style={{ height: '74%' }} className="flex-1 bg-indigo-500/60 rounded-t-sm transition-all duration-300"></div>
                  <div style={{ height: '48%' }} className="flex-1 bg-indigo-500/40 rounded-t-sm transition-all duration-300"></div>
                  <div style={{ height: '88%' }} className="flex-1 bg-indigo-500/80 rounded-t-sm transition-all duration-300"></div>
                  <div style={{ height: '62%' }} className="flex-1 bg-indigo-500/50 rounded-t-sm transition-all duration-300"></div>
                  <div style={{ height: `${Math.min(100, Math.max(10, (bpmInput - 40) * 1.1))}%` }} className="flex-1 bg-indigo-500 rounded-t-sm transition-all duration-300 shadow-md shadow-indigo-500/30"></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-400 flex items-center gap-1.5 font-bold">
                    <Heart className="w-3.5 h-3.5 text-rose-500 inline" /> BPM: {bpmInput} (Avg)
                  </span>
                  <span className="text-emerald-500">Bluetooth Active</span>
                </div>
                
                {/* Heart-rate manual simulation action button */}
                <div className="mt-4 pt-4 border-t border-slate-800/60 flex items-center justify-between">
                  <span id="active-state-indicator" className="text-[10px] text-slate-500 font-mono uppercase">Influx state:</span>
                  <button 
                    id="inject-bpm-pulse-btn"
                    onClick={() => {
                      playSound('success');
                      setBpmInput(114);
                      addLog('INFO', 'Simulated wearers sprint activity: heart rate surged to 114 BPM');
                    }}
                    className="text-[10px] border border-slate-800 text-slate-300 bg-slate-800/40 hover:bg-slate-800 hover:text-white px-2 py-1 rounded transition-all font-mono"
                  >
                    🚀 Trigger Cardiac Peak
                  </button>
                </div>
              </div>
            </div>

            {/* CARD 2: DATABASE CORES (SQLITE) */}
            <div id="card-database-sqlite" className="bg-[#141B26] rounded-xl p-5 border border-slate-800/90 shadow-xl flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-2">
                    <Database className="w-4 h-4 text-indigo-400" />
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Database (SQLite)</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono uppercase bg-slate-800 px-2 py-0.5 rounded">WAL Mode Enabled</span>
                </div>

                <div className="space-y-3 bg-[#0A0E14]/40 p-3 rounded-lg border border-slate-800/60">
                  <div className="flex justify-between items-center text-xs pb-1.5 border-b border-slate-800/55">
                    <span className="text-slate-400">User Activity Logs</span>
                    <span id="user-logs-cnt" className="font-mono text-white font-semibold transition-all">
                      {dbUserLogs.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs pb-1.5 border-b border-slate-800/55">
                    <span className="text-slate-400">Mood Vector Indices</span>
                    <span id="mood-vectors-cnt" className="font-mono text-white font-semibold">{dbMoodIndices.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">Wearable Buffers</span>
                    <span id="wearable-buffer-mb" className="font-mono text-white font-semibold">{dbWearableBuffer} MB</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between gap-3">
                <button 
                  id="optimise-database-card-btn"
                  onClick={() => {
                    playSound('success');
                    addLog('DATA', 'SQLite Optimize index parameters re-calculated for database mood_logs');
                  }}
                  className="w-full text-center text-[10px] border border-slate-800 hover:border-indigo-500/20 text-slate-400 hover:text-indigo-400 hover:bg-slate-800/30 py-1.5 rounded transition-all font-mono"
                >
                  ⚙️ Optimize DB Index
                </button>
              </div>
            </div>

            {/* CARD 3: AI PIPELINE (GEMINI) ANALYSIS */}
            <div id="card-ai-pipeline" className="bg-[#141B26] rounded-xl p-5 border border-slate-800/90 shadow-xl flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-indigo-400" />
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">AI Pipeline (Gemini)</span>
                  </div>
                  <span className="text-[10px] bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded font-mono uppercase">Structured Output</span>
                </div>

                <div className="flex items-center justify-center py-2.5">
                  <div className="relative">
                    <div className={`w-16 h-16 rounded-full border-4 border-slate-800 border-t-indigo-500 ${isGeneratingReport ? 'animate-spin' : 'animate-pulse'}`}></div>
                    <div className="absolute inset-0 flex items-center justify-center text-xs font-mono font-bold text-white">
                      {isGeneratingReport ? `${reportProgress}%` : `${aiAccuracy}%`}
                    </div>
                  </div>
                </div>

                <div className="text-center mt-2">
                  <input
                    id="report-filename-input"
                    type="text"
                    value={reportFileName}
                    onChange={(e) => setReportFileName(e.target.value)}
                    className="text-[11px] font-mono font-bold text-slate-300 bg-transparent text-center border-b border-dotted border-slate-700 hover:border-indigo-400 focus:outline-none focus:border-indigo-400 focus:text-white px-1 py-0.5"
                    placeholder="Enter report filename"
                    title="Change output file name"
                  />
                  <p className="text-[10px] text-slate-500 italic mt-1 font-mono">
                    {isGeneratingReport ? 'Compiling wellness vector parameters...' : 'Idle status. Configured & ready.'}
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/60 font-mono">
                <button 
                  id="trigger-pdf-compilation-btn"
                  onClick={handleTriggerReportReport}
                  disabled={isGeneratingReport}
                  className={`w-full text-center text-[10px] block border uppercase font-bold py-1.5 rounded transition-all cursor-pointer ${
                    isGeneratingReport 
                      ? 'border-indigo-500/20 bg-indigo-500/5 text-indigo-400 pointer-events-none' 
                      : 'border-indigo-500 hover:bg-indigo-600 hover:text-white text-indigo-400'
                  }`}
                >
                  {isGeneratingReport ? '🔄 Compiling PDF...' : '⚡ Generate Report'}
                </button>
              </div>
            </div>

          </div>
        )}

        {/* ========================================== */}
        {/* VIEW 1: TELEMETRY ENGINE VIEW CONTENT    */}
        {/* ========================================== */}
        {activeTab === 'telemetry' && (
          <div id="telemetry-view-content" className="space-y-6">
            
            {/* CONSOLE TELEMETRY LOGGER STREAM */}
            <div className="flex-1 flex flex-col bg-[#080B10] border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
              
              {/* Console header elements */}
              <div className="bg-slate-900/90 px-4 py-3 flex items-center justify-between border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="flex gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500/25 border border-red-500/40"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500/25 border border-amber-500/40"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/25 border border-emerald-500/40"></span>
                  </div>
                  <div className="h-4 w-[1px] bg-slate-800"></div>
                  <span className="text-[10px] font-mono font-bold text-indigo-400 uppercase tracking-widest flex items-center gap-2">
                    <Terminal className="w-3.5 h-3.5" /> Unified Telemetry Stream
                  </span>
                </div>

                <div className="flex items-center gap-2.5 font-mono">
                  {/* Toggle passive simulation flux */}
                  <label id="sim-toggle" className="inline-flex items-center gap-1.5 cursor-pointer text-[10px] text-slate-400 hover:text-white select-none">
                    <span className="text-[9px] text-slate-500 uppercase">Live Flux:</span>
                    <input 
                      type="checkbox" 
                      checked={simActive}
                      onChange={(e) => {
                        playSound('click');
                        setSimActive(e.target.checked);
                        addLog('INFO', e.target.checked ? 'Enabled telemetry live feed simulator' : 'Suspended real-time flux simulation pool');
                      }}
                      className="rounded bg-[#0A0E14] border-slate-800 text-indigo-500 focus:ring-0 focus:ring-offset-0 focus:outline-none w-3 h-3"
                    />
                  </label>

                  <div className="h-4 w-[1px] bg-slate-800"></div>

                  <button 
                    id="clear-logs-btn"
                    onClick={() => {
                      playSound('warn');
                      setLogs([]);
                    }}
                    className="p-1 text-slate-500 hover:text-slate-300 rounded hover:bg-slate-800 border border-transparent hover:border-slate-800 transition-all font-semibold"
                    title="Clear console logs"
                  >
                    <Trash2 className="w-3 h-3 text-slate-500" />
                  </button>

                  <button 
                    id="export-logs-btn"
                    onClick={handleExportLogs}
                    className="p-1 text-slate-500 hover:text-slate-300 rounded hover:bg-slate-800 border border-transparent hover:border-slate-800 transition-all font-semibold"
                    title="Export log stream payload"
                  >
                    <Download className="w-3 h-3 text-slate-400" />
                  </button>
                </div>
              </div>

              {/* Console log listing */}
              <div id="telemetry-logs-viewport" className="p-5 font-mono text-xs text-slate-300 min-h-[220px] max-h-[300px] overflow-y-auto space-y-1 bg-black/40">
                {logs.length === 0 ? (
                  <div className="h-32 flex flex-col items-center justify-center text-slate-500 italic text-[11px] font-mono">
                    <span>Console is currently empty. System awaiting hardware events or manual triggers...</span>
                  </div>
                ) : (
                  [...logs].reverse().map(log => {
                    let colorClass = 'text-slate-500';
                    let labelColor = 'text-slate-400';
                    if (log.type === 'INFO') {
                      colorClass = 'text-emerald-500 font-bold';
                      labelColor = 'text-emerald-400/90';
                    } else if (log.type === 'PIPE') {
                      colorClass = 'text-indigo-500 font-bold';
                      labelColor = 'text-indigo-400';
                    } else if (log.type === 'DATA') {
                      colorClass = 'text-cyan-500 font-bold';
                      labelColor = 'text-cyan-400';
                    } else if (log.type === 'WARN') {
                      colorClass = 'text-amber-500 font-bold';
                      labelColor = 'text-amber-400';
                    } else if (log.type === 'ERROR') {
                      colorClass = 'text-red-500 font-bold';
                      labelColor = 'text-red-400';
                    }

                    return (
                      <div key={log.id} className="flex gap-4 items-start py-0.5 border-b border-slate-900/40 hover:bg-slate-900/20 px-1 rounded transition-colors">
                        <span className={`text-[10px] uppercase tracking-wider select-none font-semibold ${colorClass}`}>
                          [{log.type}]
                        </span>
                        <span className="text-slate-600 font-mono select-none text-[10px]">{log.timestamp}</span>
                        <span className="text-slate-300 flex-1">{log.message}</span>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Event Injector Controls */}
              <div className="bg-slate-900/40 p-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 font-mono">
                <span className="text-[10px] text-slate-500 font-mono uppercase tracking-widest">
                  🔧 Manual Signal Injection:
                </span>
                <div className="flex flex-wrap gap-2">
                  <button 
                    id="inject-latency-btn"
                    onClick={() => injectEvent('latency')}
                    className="text-[9px] font-semibold border border-amber-500/25 text-amber-400 bg-amber-500/5 hover:bg-amber-500/10 px-2 py-1 rounded transition-all cursor-pointer"
                  >
                    ⚠️ Latency Spike
                  </button>
                  <button 
                    id="inject-vacuum-btn"
                    onClick={() => injectEvent('vacuum')}
                    className="text-[9px] font-semibold border border-cyan-500/25 text-cyan-400 bg-cyan-500/5 hover:bg-cyan-500/10 px-2 py-1 rounded transition-all cursor-pointer"
                  >
                    🧹 SQLite Vacuum
                  </button>
                  <button 
                    id="inject-sync-btn"
                    onClick={() => injectEvent('sync')}
                    className="text-[9px] font-semibold border border-emerald-500/25 text-emerald-400 bg-emerald-500/5 hover:bg-emerald-500/10 px-2 py-1 rounded transition-all cursor-pointer"
                  >
                    🔑 Token Sync
                  </button>
                  <button 
                    id="inject-disconnect-btn"
                    onClick={() => injectEvent('disconnect')}
                    className="text-[9px] font-semibold border border-red-500/25 text-red-500 bg-red-500/5 hover:bg-red-500/10 px-2 py-1 rounded transition-all cursor-pointer"
                  >
                    ⚡ Device Drop
                  </button>
                </div>
              </div>
            </div>

            {/* Quick architectural context card */}
            <div id="architectural-blueprint" className="bg-[#141B26] p-5 rounded-xl border border-slate-800/90 flex flex-col md:flex-row gap-6 items-center">
              <div className="bg-indigo-600/10 p-3.5 rounded-lg border border-indigo-500/20 text-indigo-400">
                <Layers className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <span className="text-[10px] font-mono text-indigo-400 uppercase tracking-widest">System Overview</span>
                <h4 className="text-white text-sm font-bold mb-1">Decentralized Healthcare Telemetry Framework</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  The dashboard intercepts background wearable sensors, routing telemetry feeds to a local reactive state compiler before launching modern structured prompt optimizations through client-side-orchestrated schemas.
                </p>
              </div>
              <div className="flex gap-4">
                <button
                  id="view-blueprints-docs-btn"
                  onClick={() => {
                    playSound('success');
                    addLog('INFO', 'Consulting design architecture specs: loaded workspace specifications version 4.1');
                    alert('WellnessOS 4.1 Telemetry Engine - Built with high-fidelity React, CSS grid architectures, and SQLite indices.');
                  }}
                  className="whitespace-nowrap text-xs border border-slate-700 hover:border-slate-500 hover:bg-slate-800 text-slate-300 px-3.5 py-1.5 rounded-lg transition-all"
                >
                  View Architecture Specs
                </button>
              </div>
            </div>

          </div>
        )}

        {/* ========================================== */}
        {/* VIEW 2: AI INGESTION LAYER SANDBOX        */}
        {/* ========================================== */}
        {activeTab === 'ai' && (
          <div id="ai-ingestion-view" className="space-y-6">
            <div className="bg-[#141B26] rounded-xl p-6 border border-slate-800/90 shadow-xl">
              <div className="flex items-center gap-3 mb-4 pb-4 border-b border-slate-800/60">
                <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-lg border border-indigo-500/20">
                  <Sparkles className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-base">Gemini Structuring Layer Configuration</h3>
                  <p className="text-slate-400 text-xs font-mono">Simulate automated prompting schema conversions</p>
                </div>
              </div>

              <form onSubmit={handleQueryGeminiPipeline} className="space-y-4 font-mono">
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wide">
                    System Instruction Template Payload:
                  </label>
                  <textarea
                    id="system-instruction-textarea"
                    value={geminiPrompt}
                    onChange={(e) => setGeminiPrompt(e.target.value)}
                    rows={3}
                    className="w-full text-xs font-mono bg-[#0A0E14] text-slate-200 p-3 rounded-lg border border-slate-800 focus:outline-none focus:border-indigo-500 transition-colors"
                    placeholder="Enter system prompts parsing commands..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Temperature:</label>
                      <span className="text-xs text-indigo-400">{geminiTemperature}</span>
                    </div>
                    <input
                      id="gemini-temp-slider"
                      type="range"
                      min="0.0"
                      max="1.0"
                      step="0.05"
                      value={geminiTemperature}
                      onChange={(e) => {
                        playSound('click');
                        setGeminiTemperature(parseFloat(e.target.value));
                      }}
                      className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                    />
                    <span className="text-[9px] text-slate-500">Lower temperature ensures highly structured outputs.</span>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase tracking-widest">Safety Thresholds:</label>
                    <select
                      id="gemini-safety-select"
                      value={geminiSafetyLevel}
                      onChange={(e) => {
                        playSound('click');
                        setGeminiSafetyLevel(e.target.value);
                        addLog('PIPE', `Gemini safety levels re-calibrated: ${e.target.value}`);
                      }}
                      className="w-full text-xs bg-[#0A0E14] text-slate-300 p-2 rounded border border-slate-800 focus:outline-none focus:border-indigo-500"
                    >
                      <option value="BLOCK_MEDIUM_AND_ABOVE">BLOCK_MEDIUM_AND_ABOVE</option>
                      <option value="BLOCK_LOW_AND_NOT_SAFE">BLOCK_LOW_AND_NOT_SAFE</option>
                      <option value="BLOCK_NONE">BLOCK_NONE</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase tracking-widest">Pipeline Target Node:</label>
                    <div className="text-slate-300 font-semibold bg-[#212429]/30 border border-slate-800 px-3 py-1.5 rounded text-xs select-none flex items-center gap-2">
                      <Cpu className="w-3.5 h-3.5 text-indigo-400 animate-spin" />
                      <span>gemini-3.5-flash (active)</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800/40 flex justify-end gap-3">
                  <button
                    id="reset-prompt-btn"
                    type="button"
                    onClick={() => {
                      playSound('warn');
                      setGeminiPrompt('Analyze sleep patterns and high cardiac elevation during mid-day sprint.');
                      setGeminiTemperature(0.15);
                      setCustomResponseJSON(null);
                    }}
                    className="text-xs border border-slate-800 hover:border-slate-700 hover:bg-slate-800 text-slate-400 px-4 py-2 rounded-lg transition-colors cursor-pointer"
                  >
                    Reset Defaults
                  </button>
                  <button
                    id="submit-prompt-gemini-btn"
                    type="submit"
                    disabled={geminiIsQuerying}
                    className="text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2 rounded-lg relative transition-all shadow-md shadow-indigo-600/15 cursor-pointer disabled:opacity-50"
                  >
                    {geminiIsQuerying ? '🚀 Interrogating Model...' : '⚡ Generate Structured Insights'}
                  </button>
                </div>
              </form>
            </div>

            {/* RESPONSE PREVIEW BOX */}
            <div className="bg-[#080B10] border border-slate-800 rounded-xl overflow-hidden font-mono shadow-2xl">
              <div className="bg-slate-900/80 px-4 py-2.5 flex items-center justify-between border-b border-slate-800">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <Terminal className="w-3.5 h-3.5 text-indigo-400" /> Response Output Payload (JSON Schema validated)
                </span>
                {customResponseJSON && (
                  <button
                    id="export-gemini-json-btn"
                    onClick={() => {
                      playSound('success');
                      navigator.clipboard.writeText(customResponseJSON);
                      alert('JSON schema response feedback copied to clipboard.');
                    }}
                    className="text-[9px] border border-slate-800 text-slate-400 hover:text-white px-2 py-1 rounded hover:bg-slate-800 transition-all font-mono"
                  >
                    📋 Copy Output
                  </button>
                )}
              </div>
              
              <div className="p-4 overflow-x-auto text-xs leading-relaxed max-h-[360px] overflow-y-auto">
                {geminiIsQuerying ? (
                  <div className="h-44 flex flex-col items-center justify-center space-y-3">
                    <div className="w-8 h-8 rounded-full border-2 border-slate-800 border-t-indigo-500 animate-spin" />
                    <span className="text-[11px] text-slate-500 italic">Interfacing with API endpoint. Synthesizing structural parameters...</span>
                  </div>
                ) : customResponseJSON ? (
                  <pre className="text-emerald-400/90">{customResponseJSON}</pre>
                ) : (
                  <div className="h-44 flex flex-col items-center justify-center text-slate-600 text-center text-[11px] italic">
                    <span>No analytical responses registered yet. Configure parameters and click "Generate Structured Insights" above to start.</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ========================================== */}
        {/* VIEW 3: SQLITE MIGRATIONS TAB CONTENT     */}
        {/* ========================================== */}
        {activeTab === 'sqlite' && (
          <div id="sqlite-migrations-view" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* CURRENT ACTIVE TABLES LIST */}
              <div className="md:col-span-1 bg-[#141B26] p-5 rounded-xl border border-slate-800/90 shadow-xl flex flex-col">
                <h3 className="text-white font-bold text-sm mb-4 uppercase tracking-widest flex items-center gap-2">
                  <DatabaseZap className="w-4 h-4 text-indigo-400" /> Schema Relations
                </h3>

                <div className="space-y-2 flex-1 font-mono">
                  {activeTables.map((table) => (
                    <div 
                      key={table.name} 
                      onClick={() => {
                        playSound('click');
                        setSqlQuery(`SELECT * FROM ${table.name} LIMIT 5;`);
                        addLog('DATA', `SQLite Query Buffer preloaded matching: ${table.name}`);
                      }}
                      className="p-3 bg-[#0A0E14] border border-slate-800/80 hover:border-indigo-500/30 rounded-lg flex items-center justify-between cursor-pointer group transition-all"
                    >
                      <div>
                        <span className="text-xs text-white group-hover:text-indigo-400 font-bold font-mono">
                          {table.name}
                        </span>
                        <p className="text-[10px] text-slate-500 font-mono mt-0.5">{table.rows.toLocaleString()} index entries</p>
                      </div>
                      <span className={`text-[9px] px-1.5 py-0.5 rounded uppercase font-bold tracking-tight ${
                        table.status === 'live' 
                          ? 'bg-emerald-500/10 text-emerald-400' 
                          : table.status === 'spooling'
                          ? 'bg-amber-500/10 text-amber-400 animate-pulse'
                          : 'bg-slate-800 text-slate-400'
                      }`}>
                        {table.status}
                      </span>
                    </div>
                  ))}
                </div>

                <button
                  id="trigger-sandbox-migration-btn"
                  onClick={() => {
                    playSound('success');
                    setActiveTables(prev => [
                      ...prev,
                      { name: 'cortisol_stress_rates', rows: 0, status: 'live' }
                    ]);
                    addLog('DATA', 'SQLite migration successfully staged: Created target structure mapping cortisol_stress_rates');
                  }}
                  className="mt-4 w-full text-center text-xs bg-indigo-600/15 hover:bg-indigo-600/30 text-indigo-400 border border-indigo-500/20 py-2 rounded-lg transition-colors font-bold uppercase tracking-wider"
                >
                  🚀 Run Migration 005_stress.sql
                </button>
              </div>

              {/* SQL INTERACTIVE QUERY RUNNER */}
              <div className="md:col-span-2 bg-[#141B26] p-5 rounded-xl border border-slate-800/90 shadow-xl flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800/60 mb-4 h-9">
                    <span className="text-white font-bold text-sm uppercase tracking-widest flex items-center gap-2">
                      <Sliders className="w-4 h-4 text-indigo-400" /> Interactive SQLite Command Box
                    </span>
                    <span className="text-[10px] bg-slate-900 border border-slate-800 text-slate-500 px-2 py-0.5 rounded font-mono">Sandbox Level V1</span>
                  </div>

                  <form onSubmit={handleExecuteSQL} className="space-y-4 font-mono">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Execute Raw SQLite Transaction Statement:</span>
                        <div className="flex gap-2">
                          <button
                            id="query-prefab-select-logs"
                            type="button" 
                            onClick={() => { setSqlQuery('SELECT * FROM mood_logs LIMIT 5;'); playSound('click'); }}
                            className="bg-slate-800 hover:bg-slate-700 text-[9px] text-slate-300 px-1.5 py-0.5 rounded border border-slate-700 font-mono"
                          >
                            SELECT mood_logs
                          </button>
                          <button 
                            id="query-prefab-select-users"
                            type="button" 
                            onClick={() => { setSqlQuery('SELECT * FROM users LIMIT 3;'); playSound('click'); }}
                            className="bg-slate-800 hover:bg-slate-700 text-[9px] text-slate-300 px-1.5 py-0.5 rounded border border-slate-700 font-mono"
                          >
                            SELECT users
                          </button>
                          <button 
                            id="query-prefab-vacuum"
                            type="button" 
                            onClick={() => { setSqlQuery('VACUUM;'); playSound('click'); }}
                            className="bg-slate-800 hover:bg-slate-700 text-[9px] text-slate-300 px-1.5 py-0.5 rounded border border-slate-700 font-mono"
                          >
                            VACUUM
                          </button>
                        </div>
                      </div>
                      <input
                        id="sql-query-string-input"
                        type="text"
                        value={sqlQuery}
                        onChange={(e) => setSqlQuery(e.target.value)}
                        className="w-full text-xs font-mono bg-[#0A0E14] text-slate-200 p-2.5 rounded border border-slate-800 focus:outline-none focus:border-indigo-500 transition-colors"
                        placeholder="SELECT * FROM table ORDER BY something DESC"
                      />
                    </div>
                    
                    <div className="pt-2 flex justify-end">
                      <button
                        id="sql-query-execute-btn"
                        type="submit"
                        className="text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2 rounded-lg transition-colors cursor-pointer shadow-md shadow-indigo-600/10"
                      >
                        ⚡ Execute Query
                      </button>
                    </div>
                  </form>
                </div>

                {/* RESULT FIELD BOX */}
                <div className="mt-5 bg-[#080B10] border border-slate-800 rounded-lg p-3 overflow-x-auto min-h-[140px] font-mono select-none">
                  <span className="block text-[9px] text-slate-500 uppercase tracking-widest font-bold mb-2">Query Engine Result Output:</span>
                  
                  {sqlQueryError && (
                    <div className="text-red-400 font-mono text-xs flex gap-2 items-start py-2">
                      <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                      <span>{sqlQueryError}</span>
                    </div>
                  )}

                  {sqlQueryResult && (
                    <table className="w-full text-left text-[11px] text-slate-300 border-collapse">
                      <thead>
                        <tr className="border-b border-slate-800 bg-[#141B26] text-slate-400">
                          {Object.keys(sqlQueryResult[0] || {}).map(key => (
                            <th key={key} className="p-1 px-2 font-mono text-[10px] uppercase font-bold">{key}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {sqlQueryResult.map((row, idx) => (
                          <tr key={idx} className="border-b border-slate-900/30 hover:bg-slate-900/20">
                            {Object.values(row).map((val: any, vIdx) => (
                              <td key={vIdx} className="p-1.5 px-2 font-mono text-slate-300">{String(val)}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}

                  {!sqlQueryError && !sqlQueryResult && (
                    <div className="h-16 flex items-center justify-center text-slate-600 text-xs italic">
                      Awaiting query commitment payload...
                    </div>
                  )}
                </div>

              </div>

            </div>
          </div>
        )}

        {/* ========================================== */}
        {/* VIEW 4: WEARABLE SYNC MANAGEMENT PANEL     */}
        {/* ========================================== */}
        {activeTab === 'wearable' && (
          <div id="wearable-sync-view" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono">
              
              {/* COMPONENT 1: HARDWARE REGULATOR */}
              <div className="bg-[#141B26] p-5 rounded-xl border border-slate-800/90 shadow-xl flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-4 pb-3 border-b border-slate-800/60 text-sm">
                    <span className="text-white font-bold uppercase tracking-widest flex items-center gap-2">
                      <Cpu className="w-4 h-4 text-indigo-400" /> Wrist Receiver Specifications
                    </span>
                    <span className="text-[10px] bg-[#0A0E14] border border-slate-800 text-emerald-400 px-2 py-0.5 rounded uppercase">Connected</span>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-[10px] text-slate-400 mb-1.5 uppercase font-bold tracking-widest">Active Device Handler Name:</label>
                      <input
                        id="wearable-device-input"
                        type="text"
                        value={wearableState}
                        onChange={(e) => {
                          setWearableState(e.target.value);
                        }}
                        className="w-full text-xs bg-[#0A0E14] text-slate-200 p-2 rounded border border-slate-800 font-mono focus:outline-none focus:border-indigo-500"
                        placeholder="Device segment ID"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-1.5">
                        <label className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Sensor Battery Stream:</label>
                        <span className="text-xs text-white font-bold">{batteryLevel}%</span>
                      </div>
                      <div className="w-full bg-[#0A0E14] h-2 rounded-full border border-slate-800 flex overflow-hidden">
                        <div style={{ width: `${batteryLevel}%` }} className={`h-full ${batteryLevel < 35 ? 'bg-rose-500' : 'bg-emerald-500'} rounded-full transition-all`}></div>
                      </div>
                      <div className="mt-2 flex justify-between items-center text-[10.5px]">
                        <button 
                          id="charge-battery-btn"
                          onClick={() => { setBatteryLevel(100); playSound('success'); addLog('INFO', 'Wrist receiver battery stream topped to 100% capacity.'); }}
                          className="text-indigo-400 hover:text-indigo-300 font-bold"
                        >
                          ⚡ Plug Charger Intake
                        </button>
                        <span className="text-slate-500">AppleWatch Socket 42A</span>
                      </div>
                    </div>

                    <div className="pt-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-slate-400 font-mono uppercase tracking-widest">Continual Flux loop:</span>
                        <label id="continual-flux-toggle" className="relative inline-flex items-center cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={continuousWearableFlux}
                            onChange={(e) => {
                              playSound('click');
                              setContinuousWearableFlux(e.target.checked);
                              addLog('INFO', e.target.checked ? 'Synchronized live heartbeat stream updates' : 'Suspended periodic heartbeat stream hooks');
                            }}
                            className="rounded bg-[#0A0E14] border-slate-800 text-indigo-500 focus:ring-0 focus:ring-offset-0 focus:outline-none w-3.5 h-3.5 mt-0.5"
                          />
                        </label>
                      </div>
                    </div>

                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800/60">
                  <button
                    id="hard-reset-bluetooth"
                    onClick={() => {
                      playSound('warn');
                      setBpmInput(72);
                      setBatteryLevel(84);
                      addLog('INFO', 'Wrist Receiver: Dispatched hard reboot request signal successfully.');
                    }}
                    className="w-full py-2 bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-400 border border-indigo-500/15 rounded-lg text-xs font-bold uppercase tracking-wider"
                  >
                    🔄 Hard Reset Bluetooth Signal
                  </button>
                </div>
              </div>

              {/* COMPONENT 2: CARDIAC SENSORY DIAGRAM */}
              <div className="bg-[#141B26] p-5 rounded-xl border border-slate-800/90 shadow-xl flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center pb-3 border-b border-slate-800/60 mb-4 text-sm">
                    <span className="text-white font-bold uppercase tracking-widest flex items-center gap-2">
                      <Heart className="w-4 h-4 text-rose-500 animate-pulse" /> Live ECG Simulation Trace
                    </span>
                    <span id="cardiac-bpm-tracker" className="text-xs text-rose-500 font-mono font-bold animate-pulse">{bpmInput} BPM</span>
                  </div>

                  {/* ECG Drawing wave simulation using SVG path */}
                  <div className="bg-[#080B10] border border-slate-800 p-4 rounded-lg flex items-center justify-center relative overflow-hidden h-36">
                    <svg className="w-full h-full text-indigo-500" viewBox="0 0 400 100" preserveAspectRatio="none">
                      <path
                        d="M0,50 L80,50 L90,30 L100,70 L110,10 L120,90 L130,50 L200,50 L210,30 L220,70 L230,10 L240,90 L250,50 L310,50 L320,30 L330,70 L340,10 L350,90 L360,50 L400,50"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="animate-pulse"
                        style={{
                          strokeDasharray: '400',
                          strokeDashoffset: '0',
                          animation: 'dash 1.8s linear infinite'
                        }}
                      />
                    </svg>

                    <style>{`
                      @keyframes dash {
                        from { stroke-dashoffset: 400; }
                        to { stroke-dashoffset: 0; }
                      }
                    `}</style>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-2 text-center">Interactive simulated trace based on heart rate: {bpmInput} beats per minute.</p>
                </div>

                <div className="mt-4 p-3 bg-[#0A0E14] rounded-lg border border-slate-800/80 text-xs">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-slate-400">Biological Stress Index:</span>
                    <span className="text-rose-400 font-bold font-mono">{(bpmInput > 100 ? 'High demands (8.2)' : 'Nominal Balance (4.1)')}</span>
                  </div>
                  <div className="w-full bg-[#141B26] h-1.5 rounded-full overflow-hidden">
                    <div style={{ width: bpmInput > 100 ? '82%' : '41%' }} className={`h-full ${bpmInput > 100 ? 'bg-rose-500' : 'bg-emerald-500'}`} />
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ========================================== */}
        {/* VIEW 5: EMOTIONAL LOGS MANAGER TAB        */}
        {/* ========================================== */}
        {activeTab === 'emotional' && (
          <div id="emotional-logs-view" className="space-y-6">
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* MOOD FORM COMPONENT */}
              <div className="lg:col-span-1 bg-[#141B26] p-6 rounded-xl border border-slate-800/90 shadow-xl">
                <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-800/60">
                  <Smile className="w-5 h-5 text-indigo-400" />
                  <h3 className="text-white font-bold text-base">New Emotional Record</h3>
                </div>

                <form onSubmit={handleAddMood} className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-mono font-bold text-slate-400 mb-1.5 uppercase tracking-wider">
                      Select Vibe Signature:
                    </label>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {['Focused', 'Calm', 'Excited', 'Tense', 'Fatigued', 'Anxious'].map((v) => (
                        <button
                          key={v}
                          type="button"
                          onClick={() => { setNewMoodVibe(v); playSound('click'); }}
                          className={`p-2 rounded border font-mono transition-all text-center uppercase cursor-pointer ${
                            newMoodVibe === v 
                              ? 'border-indigo-500 bg-indigo-500/15 text-indigo-400 font-bold' 
                              : 'border-slate-800 hover:border-slate-700 bg-slate-900/40 text-slate-400 hover:text-white'
                          }`}
                        >
                          {v}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center font-mono mb-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        Scale Intensity Level (1-10):
                      </label>
                      <span className="text-xs text-indigo-400 font-bold">{newMoodIntensity}</span>
                    </div>
                    <input
                      id="mood-intensity-input-slider"
                      type="range"
                      min="1"
                      max="10"
                      value={newMoodIntensity}
                      onChange={(e) => { playSound('click'); setNewMoodIntensity(parseInt(e.target.value)); }}
                      className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono font-bold text-slate-400 mb-1.5 uppercase tracking-widest">
                      Contextual Notes &amp; Thoughts:
                    </label>
                    <textarea
                      id="mood-notes-input"
                      value={newMoodNotes}
                      onChange={(e) => setNewMoodNotes(e.target.value)}
                      rows={3}
                      className="w-full text-xs bg-[#0A0E14] text-slate-200 p-2.5 rounded border border-slate-800 font-mono focus:outline-none focus:border-indigo-500"
                      placeholder="Specify your stream notes here..."
                    />
                  </div>

                  <button
                    id="add-mood-log-entry-btn"
                    type="submit"
                    className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer shadow-md shadow-indigo-600/10"
                  >
                    💾 Log Emotional Vector
                  </button>
                </form>
              </div>

              {/* STATS AND LISTINGS COLUMN */}
              <div className="lg:col-span-2 space-y-6">
                
                {/* MOOD STATISTICS BREAKDOWN CARD */}
                <div className="bg-[#141B26] p-5 rounded-xl border border-slate-800/90 shadow-xl grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 bg-[#0A0E14]/40 rounded-lg border border-slate-800/60 text-center font-mono flex flex-col justify-center">
                    <span className="text-[10px] text-slate-500 uppercase tracking-widest">Average Vibe Intensity</span>
                    <div id="average-vibe-intensity-val" className="text-3xl font-bold text-indigo-400 my-1">{avgIntensity} / 10</div>
                    <span className="text-[9px] text-slate-400 italic">Across {moodLogs.length} simulated bio logs</span>
                  </div>

                  <div className="p-4 bg-[#0A0E14]/40 rounded-lg border border-slate-800/60 font-mono text-xs space-y-2">
                    <span className="text-[10px] text-slate-500 uppercase tracking-widest block mb-1">Vibe Classification Ratio</span>
                    {Object.keys(moodCounts).length === 0 ? (
                      <div className="h-10 flex items-center justify-center text-slate-600 italic text-[11px]">No active data models</div>
                    ) : (
                      Object.entries(moodCounts).map(([v, count]) => {
                        const countNum = count as number;
                        const pct = Math.round((countNum / moodLogs.length) * 100);
                        return (
                          <div key={v}>
                            <div className="flex justify-between text-[11px] text-slate-300">
                              <span>{v}</span>
                              <span>{pct}% ({count})</span>
                            </div>
                            <div className="w-full bg-[#141B26] h-1 rounded-full overflow-hidden mt-0.5">
                              <div style={{ width: `${pct}%` }} className="bg-indigo-500 h-full rounded" />
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

                {/* HISTORICAL ENTRIES TABLE ARCHIVE */}
                <div className="bg-[#141B26] p-5 rounded-xl border border-slate-800/90 shadow-xl flex flex-col">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800/60 mb-4 text-sm font-mono">
                    <span className="text-white font-bold uppercase tracking-widest">Historic Bio-logs Schema Table</span>
                    <span className="text-[10px] text-slate-500">Stored Locally (Persistent)</span>
                  </div>

                  <div className="max-h-[220px] overflow-y-auto space-y-3 pr-1 font-mono">
                    {moodLogs.length === 0 ? (
                      <div className="h-28 flex items-center justify-center text-slate-500 italic text-xs">
                        No structural logs recorded yet. Insert vibe statistics using form.
                      </div>
                    ) : (
                      moodLogs.map((item) => (
                        <div key={item.id} className="p-3 bg-[#080B10] hover:bg-[#0A0E14] border border-slate-830/80 rounded-lg flex justify-between gap-4 transition-all group relative">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <span className="bg-indigo-500/15 border border-indigo-500/20 text-indigo-400 text-[10px] font-bold px-2 py-0.5 rounded font-mono uppercase">
                                {item.vibe}
                              </span>
                              <span className="bg-slate-800 text-slate-400 text-[9.5px] font-mono px-1.5 py-0.5 rounded font-semibold">
                                Level {item.intensity}/10
                              </span>
                              <span className="text-[10px] text-slate-500 font-mono">{item.timestamp}</span>
                            </div>
                            <p className="text-slate-300 text-[11px] leading-relaxed break-words">{item.notes}</p>
                          </div>
                          
                          <button
                            id={`delete-mood-${item.id}`}
                            onClick={() => handleDeleteMood(item.id)}
                            className="text-slate-500 hover:text-red-400 self-center border border-transparent hover:border-red-500/10 p-1.5 rounded bg-red-500/0 hover:bg-rose-500/10 transition-all"
                            title="Delete mood log parameter"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>

              </div>

            </div>

          </div>
        )}

      </main>
    </div>
  );
}
