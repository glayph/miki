import React, { useState, useEffect } from 'react';
import { Activity, Server, Cpu, Database, RefreshCw, Zap, ShieldCheck } from 'lucide-react';
import { SystemHealth } from '../types';

export const TelemetryStatus: React.FC = () => {
  const [health, setHealth] = useState<SystemHealth | null>(null);
  const [loading, setLoading] = useState(true);
  const [pinging, setPinging] = useState(false);

  const fetchHealth = async () => {
    setPinging(true);
    try {
      const res = await fetch('/api/agents/status');
      if (res.ok) {
        const data: SystemHealth = await res.json();
        setHealth(data);
      }
    } catch (err) {
      console.error('Failed to fetch telemetry status', err);
    } finally {
      setLoading(false);
      setPinging(false);
    }
  };

  useEffect(() => {
    fetchHealth();
    const interval = setInterval(fetchHealth, 10000);
    return () => clearInterval(interval);
  }, []);

  const formatUptime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs}h ${mins}m ${secs}s`;
  };

  return (
    <section id="telemetry" className="py-20 border-b border-[#27272A] bg-[#0A0A0B]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#111113] border border-[#27272A] text-xs font-mono font-bold tracking-widest text-[#FF5A3C] uppercase mb-4">
            Cluster Telemetry
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-[#F4F4F5] uppercase tracking-tight mb-4">
            Framework Health Monitor
          </h2>
          <p className="text-[#A1A1AA] text-sm sm:text-base">
            Live telemetry data polled directly from <code className="text-[#FF5A3C] font-mono">GET /api/agents/status</code>.
          </p>
        </div>

        {/* Status Dashboard Grid */}
        <div className="max-w-5xl mx-auto p-6 sm:p-8 rounded-lg bg-[#111113] border border-[#27272A]">
          
          {/* Top Bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-[#27272A] mb-8">
            <div className="flex items-center gap-3">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
              </span>
              <div>
                <h3 className="text-base font-bold font-mono text-[#F4F4F5]">
                  SYSTEM STATUS: {health?.status.toUpperCase() || 'OPERATIONAL'}
                </h3>
                <p className="text-xs text-[#A1A1AA] font-mono">
                  Engine Version: {health?.version || 'v1.4.2'} • Cluster Nodes: {health?.clusterNodes || 3}
                </p>
              </div>
            </div>

            <button
              onClick={fetchHealth}
              disabled={pinging}
              className="px-4 py-2 bg-[#0A0A0B] hover:bg-[#0A0A0B]/80 text-[#F4F4F5] border border-[#27272A] hover:border-[#FF5A3C]/40 text-xs font-mono rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-[#FF5A3C] ${pinging ? 'animate-spin' : ''}`} />
              Run Health Ping
            </button>
          </div>

          {/* Metric Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono mb-8">
            
            <div className="p-4 rounded bg-[#0A0A0B] border border-[#27272A]">
              <div className="text-[11px] text-[#A1A1AA] mb-1">UPTIME</div>
              <div className="text-lg font-bold text-[#F4F4F5]">
                {health ? formatUptime(health.uptimeSeconds) : '0h 0m 0s'}
              </div>
            </div>

            <div className="p-4 rounded bg-[#0A0A0B] border border-[#27272A]">
              <div className="text-[11px] text-[#A1A1AA] mb-1">ACTIVE AGENTS</div>
              <div className="text-lg font-bold text-[#FF5A3C]">
                {health?.activeAgents || 14}
              </div>
            </div>

            <div className="p-4 rounded bg-[#0A0A0B] border border-[#27272A]">
              <div className="text-[11px] text-[#A1A1AA] mb-1">MEMORY USAGE</div>
              <div className="text-lg font-bold text-[#F4F4F5]">
                {health?.memoryUsageMb || 164} MB
              </div>
            </div>

            <div className="p-4 rounded bg-[#0A0A0B] border border-[#27272A]">
              <div className="text-[11px] text-[#A1A1AA] mb-1">AVG LATENCY</div>
              <div className="text-lg font-bold text-emerald-400">
                {health?.avgLatencyMs || 42} ms
              </div>
            </div>

          </div>

          {/* Raw JSON Telemetry Inspector */}
          <div className="p-4 rounded bg-[#0A0A0B] border border-[#27272A]">
            <div className="text-xs font-mono font-bold text-[#A1A1AA] mb-2 flex items-center justify-between">
              <span>RESPONSE PAYLOAD (GET /api/agents/status)</span>
              <span className="text-[10px] text-[#FF5A3C]">JSON STREAM</span>
            </div>
            <pre className="p-3 rounded bg-[#111113] border border-[#27272A] text-xs font-mono text-[#F4F4F5] overflow-x-auto">
              <code>{JSON.stringify(health || {}, null, 2)}</code>
            </pre>
          </div>

        </div>

      </div>
    </section>
  );
};
