import React, { useState } from 'react';
import { Terminal, Cpu, Database, Globe, Download, Zap, RefreshCw, ArrowRight, Layers, CheckCircle } from 'lucide-react';

export const ArchitectureDiagram: React.FC = () => {
  const [selectedNode, setSelectedNode] = useState<string>('react');

  const nodes = [
    {
      id: 'input',
      title: '1. Task Dispatcher',
      subtitle: 'HTTP / WebSocket / CLI',
      icon: <Terminal className="w-4 h-4 text-[#FF5A3C]" />,
      desc: 'Receives developer prompts or schedule triggers, sets execution limits, and instantiates agent context.'
    },
    {
      id: 'react',
      title: '2. ReAct Reasoning Loop',
      subtitle: 'Thought -> Plan -> Action',
      icon: <Cpu className="w-4 h-4 text-[#FF5A3C]" />,
      desc: 'Core iteration loop that formulates thoughts, determines required actions, validates schemas, and checks convergence.'
    },
    {
      id: 'memory',
      title: '3. Layered SQLite Driver',
      subtitle: 'Relational + Vector-Lite',
      icon: <Database className="w-4 h-4 text-[#FF5A3C]" />,
      desc: 'Persists conversation history, tool outputs, and long-term memory embeddings locally without external database setup.'
    },
    {
      id: 'skill',
      title: '4. ISkillPlugin Loader',
      subtitle: 'Hot-Reload Engine',
      icon: <Layers className="w-4 h-4 text-[#FF5A3C]" />,
      desc: 'Executes tools, validates inputs, and hot-reloads skill plugins without interrupting active server connections.'
    },
    {
      id: 'acquisition',
      title: '5. Marketplace Bridge',
      subtitle: 'Auto-Skill Install',
      icon: <Download className="w-4 h-4 text-[#FF5A3C]" />,
      desc: 'Detects missing tools during execution, fetches skill definitions from registry or OpenClaw, and auto-installs.'
    },
    {
      id: 'output',
      title: '6. Output & Telemetry',
      subtitle: 'Streaming Response',
      icon: <Zap className="w-4 h-4 text-[#FF5A3C]" />,
      desc: 'Streams token outputs, latency telemetry, and execution traces back to client applications in real time.'
    }
  ];

  const activeNodeData = nodes.find(n => n.id === selectedNode) || nodes[1];

  return (
    <section id="architecture" className="py-20 border-b border-[#27272A] bg-[#0A0A0B]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#111113] border border-[#27272A] text-xs font-mono font-bold tracking-widest text-[#FF5A3C] uppercase mb-4">
            System Architecture
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-[#F4F4F5] uppercase tracking-tight mb-4">
            How Miki Executes Agentic Workflows
          </h2>
          <p className="text-[#A1A1AA] text-sm sm:text-base">
            Click any architectural layer to inspect its runtime responsibility and data flow.
          </p>
        </div>

        {/* Interactive Diagram Container */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Left / Middle: Node Flow Cards */}
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {nodes.map((node) => {
              const isSelected = selectedNode === node.id;
              return (
                <button
                  key={node.id}
                  onClick={() => setSelectedNode(node.id)}
                  className={`p-4 rounded-lg border text-left transition-all relative ${
                    isSelected
                      ? 'bg-[#111113] border-[#FF5A3C] ring-1 ring-[#FF5A3C]'
                      : 'bg-[#111113]/50 border-[#27272A] hover:border-[#A1A1AA]/40'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="p-2 rounded bg-[#0A0A0B] border border-[#27272A]">
                      {node.icon}
                    </div>
                    {isSelected && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#FF5A3C] text-white">
                        ACTIVE
                      </span>
                    )}
                  </div>
                  <h4 className="text-sm font-bold text-[#F4F4F5] mb-1 font-mono">{node.title}</h4>
                  <p className="text-xs text-[#A1A1AA] font-mono">{node.subtitle}</p>
                </button>
              );
            })}
          </div>

          {/* Right Column: Node Inspector Panel */}
          <div className="p-6 rounded-lg bg-[#111113] border border-[#27272A] font-mono">
            <div className="flex items-center gap-2 text-xs text-[#FF5A3C] mb-4 border-b border-[#27272A] pb-3">
              <span className="w-2 h-2 rounded-full bg-[#FF5A3C] animate-ping" />
              LAYER INSPECTOR // {activeNodeData.id.toUpperCase()}
            </div>

            <h3 className="text-lg font-bold text-[#F4F4F5] mb-2">{activeNodeData.title}</h3>
            <p className="text-xs text-[#FF5A3C] mb-4">{activeNodeData.subtitle}</p>

            <div className="p-3 rounded bg-[#0A0A0B] border border-[#27272A] text-xs text-[#A1A1AA] leading-relaxed mb-6">
              {activeNodeData.desc}
            </div>

            <div className="space-y-2 text-xs text-[#F4F4F5]">
              <div className="text-[11px] text-[#A1A1AA]">TECHNICAL CONSTRAINTS:</div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                <span>Zero blocking I/O during ReAct iterations</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                <span>Auto-fallback on failed tool executions</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                <span>Native OpenClaw & Hermes ISkill compatibility</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
