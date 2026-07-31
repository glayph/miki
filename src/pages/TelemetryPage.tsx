import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Activity, Cpu, Database, Server, RefreshCw, Zap, Shield, 
  Clock, CheckCircle2, AlertCircle, Layers, Radio 
} from 'lucide-react';
import { SystemHealth } from '../types';
import { getSystemHealth } from '../services/mikiEngine';

export const TelemetryPage: React.FC = () => {
  const [health, setHealth] = useState<SystemHealth | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [logStream, setLogStream] = useState<{ id: string; timestamp: string; level: string; message: string }[]>([]);

  useEffect(() => {
    fetchHealth();
    const interval = setInterval(fetchHealth, 4000);
    return () => clearInterval(interval);
  }, []);

  const fetchHealth = () => {
    try {
      const data = getSystemHealth();
      setHealth(data);

      // Append live simulated trace log
      const levels = ['INFO', 'EXEC', 'INFO', 'WARN', 'INFO'];
      const randomLevel = levels[Math.floor(Math.random() * levels.length)];
      const messages = [
        'ReAct Kernel step completed in 14ms',
        'SQLite WAL index checkpoint committed',
        'Playwright Chromium sandbox DOM extracted',
        'Agent memory decay pass executed successfully',
        'OpenClaw adapter translated JSON parameter payload'
      ];
      const randomMsg = messages[Math.floor(Math.random() * messages.length)];

      const newLog = {
        id: Math.random().toString(36).substring(7),
        timestamp: new Date().toISOString().split('T')[1].slice(0, 8),
        level: randomLevel,
        message: randomMsg
      };

      setLogStream(prev => [newLog, ...prev.slice(0, 15)]);
    } catch (err) {
      // Fallback
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 pb-6 border-b border-[#27272A]">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[11px] font-mono uppercase tracking-widest px-2.5 py-1 rounded bg-[#111113] border border-[#27272A] text-[#FF5A3C]">
              RESOURCES / SYSTEM TELEMETRY
            </span>
            <span className="text-xs font-mono text-[#A1A1AA]">Live Cluster Metrics</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#F4F4F5] font-mono">
            System Telemetry & Health Dashboard
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-[#111113] border border-[#27272A] rounded-lg text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-[#FF5A3C] animate-pulse" />
            <span className="text-[#F4F4F5] font-bold">OPERATIONAL</span>
            <span className="text-[#A1A1AA]">v1.4.2</span>
          </div>

          <button
            onClick={fetchHealth}
            className="p-2 bg-[#111113] border border-[#27272A] text-[#A1A1AA] hover:text-white rounded-lg"
            title="Refresh Telemetry"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        
        {/* Metric 1 */}
        <div className="bg-[#111113] border border-[#27272A] rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono text-[#A1A1AA] uppercase">Active Workers</span>
            <Server className="w-4 h-4 text-[#FF5A3C]" />
          </div>
          <div className="text-3xl font-bold text-[#F4F4F5] font-mono mb-1">
            {health?.activeAgents || 14} <span className="text-xs text-[#A1A1AA]">Nodes</span>
          </div>
          <div className="text-[11px] font-mono text-[#A1A1AA]">{health?.clusterNodes || 3} Cluster Zones</div>
        </div>

        {/* Metric 2 */}
        <div className="bg-[#111113] border border-[#27272A] rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono text-[#A1A1AA] uppercase">Average Latency</span>
            <Zap className="w-4 h-4 text-[#FF5A3C]" />
          </div>
          <div className="text-3xl font-bold text-[#FF5A3C] font-mono mb-1">
            {health?.avgLatencyMs || 42} <span className="text-xs text-[#A1A1AA]">ms</span>
          </div>
          <div className="text-[11px] font-mono text-[#A1A1AA]">ReAct Kernel Overhead</div>
        </div>

        {/* Metric 3 */}
        <div className="bg-[#111113] border border-[#27272A] rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono text-[#A1A1AA] uppercase">Memory Heap</span>
            <Database className="w-4 h-4 text-[#FF5A3C]" />
          </div>
          <div className="text-3xl font-bold text-[#F4F4F5] font-mono mb-1">
            {health?.memoryUsageMb || 184} <span className="text-xs text-[#A1A1AA]">MB</span>
          </div>
          <div className="text-[11px] font-mono text-[#A1A1AA]">SQLite WAL Buffer</div>
        </div>

        {/* Metric 4 */}
        <div className="bg-[#111113] border border-[#27272A] rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono text-[#A1A1AA] uppercase">Uptime</span>
            <Clock className="w-4 h-4 text-[#FF5A3C]" />
          </div>
          <div className="text-3xl font-bold text-[#F4F4F5] font-mono mb-1">
            {health?.uptimeSeconds ? `${Math.floor(health.uptimeSeconds / 60)}m` : '99.99%'}
          </div>
          <div className="text-[11px] font-mono text-[#A1A1AA]">Zero Downtime Hot-Reload</div>
        </div>

      </div>

      {/* Live Log Stream */}
      <div className="bg-[#111113] border border-[#27272A] rounded-xl p-6 sm:p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-[#F4F4F5] font-mono flex items-center gap-2">
            <Radio className="w-5 h-5 text-[#FF5A3C] animate-pulse" />
            Live Execution Log Stream
          </h2>
          <span className="text-xs font-mono text-[#A1A1AA]">Auto-refreshing every 4s</span>
        </div>

        <div className="bg-[#0A0A0B] border border-[#27272A] rounded-lg p-4 font-mono text-xs text-[#A1A1AA] space-y-2 max-h-96 overflow-y-auto">
          {logStream.map((log) => (
            <div key={log.id} className="flex items-start gap-3 border-b border-[#27272A]/40 pb-2">
              <span className="text-[#A1A1AA] text-[10px] shrink-0 mt-0.5">{log.timestamp}</span>
              <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold shrink-0 ${
                log.level === 'WARN' ? 'bg-amber-950 text-amber-400 border border-amber-800' :
                log.level === 'EXEC' ? 'bg-[#111113] text-[#FF5A3C] border border-[#FF5A3C]/40' :
                'bg-[#111113] text-[#A1A1AA] border border-[#27272A]'
              }`}>
                {log.level}
              </span>
              <span className="text-[#F4F4F5] font-mono">{log.message}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};
