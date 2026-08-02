import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Workflow, Cpu, Terminal, Play, RotateCcw, ArrowRight, ShieldCheck, 
  Sparkles, CheckCircle2, Calculator, Layers, Code, Zap, AlertCircle 
} from 'lucide-react';
import { navigate } from '../utils/router';
import { getDocByPath } from '../utils/markdownLoader';
import { MarkdownViewer } from '../components/MarkdownViewer';

export const ReActArchitecturePage: React.FC = () => {
  // ReAct State Machine Simulator State
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);

  // Token Cost Calculator State
  const [taskIterations, setTaskIterations] = useState<number>(8);
  const [modelType, setModelType] = useState<'gemini-2.5-flash' | 'gemini-1.5-pro' | 'gpt-4o'>('gemini-2.5-flash');
  const [toolCallsCount, setToolCallsCount] = useState<number>(3);

  const doc = getDocByPath('/docs/architecture/react.md');

  const reactSteps = [
    {
      title: '1. Prompt Ingestion & Intent Parsing',
      phase: 'INGEST',
      description: 'The agent receives raw input, sanitizes constraints, and loads system context from SQLite short-term memory.',
      details: 'Evaluates user query schema, checks for active tool bindings, and computes initial context window tokens.',
      code: `const agentState = await memory.loadContext(sessionId);\nconst plan = parser.parsePrompt(userPrompt, activeTools);`
    },
    {
      title: '2. Thought & Reasoning Kernel',
      phase: 'THOUGHT',
      description: 'The LLM generates structured internal reflection, evaluating tool candidates and parameter bounds.',
      details: 'Applies self-consistency checks to prevent hallucinated tool arguments before invocation.',
      code: `const thought = await llm.generateThought({\n  prompt: userPrompt,\n  history: agentState.history\n});`
    },
    {
      title: '3. Tool Routing & Execution',
      phase: 'ACTION',
      description: 'Selected skill plugin is dispatched with validated arguments. Executes browser, database, or API calls.',
      details: 'Supports OpenClaw skills, Hermes bridges, and Playwright Chromium automation.',
      code: `const toolOutput = await skillPlugin.execute(thought.actionParams, {\n  memory,\n  logger\n});`
    },
    {
      title: '4. Observation & State Reflection',
      phase: 'OBSERVATION',
      description: 'Tool result is captured, serialized, and evaluated. If a capability gap is detected, auto-acquisition triggers.',
      details: 'Writes step payload to SQLite memory WAL table and evaluates whether task goals are satisfied.',
      code: `await memory.storeStep({ stepId, type: "observation", result: toolOutput });\nif (!goalSatisfied) return continueLoop();`
    },
    {
      title: '5. Output Synthesis & Response',
      phase: 'RESULT',
      description: 'Final answer is formatted against requested JSON/Markdown schema and returned to the client.',
      details: 'Generates execution statistics including latency per step, total tokens consumed, and active memory nodes.',
      code: `return {\n  status: "completed",\n  output: finalSynthesis,\n  metrics: { steps: 4, latencyMs: 342 }\n};`
    }
  ];

  const handleNextStep = () => {
    if (currentStep < reactSteps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      setCurrentStep(0);
    }
  };

  const handleSimulateAll = () => {
    setIsSimulating(true);
    setCurrentStep(0);
    let step = 0;
    const interval = setInterval(() => {
      step += 1;
      if (step < reactSteps.length) {
        setCurrentStep(step);
      } else {
        clearInterval(interval);
        setIsSimulating(false);
      }
    }, 1200);
  };

  // Cost calculation formula
  const modelRates = {
    'gemini-2.5-flash': { input: 0.075, output: 0.30 },
    'gemini-1.5-pro': { input: 1.25, output: 5.00 },
    'gpt-4o': { input: 2.50, output: 10.00 }
  };

  const estimatedInputTokens = taskIterations * 1200 + toolCallsCount * 800;
  const estimatedOutputTokens = taskIterations * 350;
  const costPerTask = (
    (estimatedInputTokens / 1000000) * modelRates[modelType].input +
    (estimatedOutputTokens / 1000000) * modelRates[modelType].output
  ).toFixed(5);
  const estimatedLatency = (taskIterations * 85 + toolCallsCount * 120).toFixed(0);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-[#060608] min-h-screen"
    >
      {/* Header */}
      <div className="mb-12">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[11px] font-mono uppercase tracking-wider px-3 py-1 rounded-full bg-[#0e0e12] border border-[#1c1c24] text-[#FF5A3C]">
            ◆ PRODUCT / ARCHITECTURE
          </span>
          <span className="text-xs font-mono text-[#71717A]">ReAct Orchestration Loop v1.4.2</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-[#F4F4F5] mb-4 uppercase">
          Autonomous ReAct Loop Deep-Dive
        </h1>
        <p className="text-[#A1A1AA] text-sm sm:text-base max-w-3xl leading-relaxed">
          Discover how Miki structures autonomous reasoning, tool selection, reflection, and state persistence inside a single deterministic loop.
        </p>
      </div>

      {/* Dynamic Markdown Specification Section */}
      {doc && (
        <div className="mb-12">
          <MarkdownViewer
            filePath={doc.path}
            content={doc.content}
            title={doc.title}
            category={doc.category}
          />
        </div>
      )}

      {/* Interactive ReAct State Machine Simulator */}
      <div className="bg-[#0e0e12] border border-[#1c1c24] rounded-2xl p-6 sm:p-8 mb-12">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-[#1c1c24]">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[#FF5A3C]">◆</span>
              <h2 className="text-lg font-bold text-[#F4F4F5] font-mono">Interactive State Machine Simulator</h2>
            </div>
            <p className="text-xs text-[#A1A1AA] font-mono">Click through the step-by-step reasoning cycle or simulate full task execution.</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleNextStep}
              disabled={isSimulating}
              className="px-4 py-2 text-xs font-mono font-medium text-white bg-[#14141a] border border-[#1f1f28] hover:bg-[#1f1f28] rounded-full transition-all flex items-center gap-1.5 min-h-[38px]"
            >
              <Play className="w-3.5 h-3.5 text-[#FF5A3C]" />
              Next Step ({currentStep + 1}/5)
            </button>

            <button
              onClick={handleSimulateAll}
              disabled={isSimulating}
              className="px-4 py-2 text-xs font-mono font-medium text-white bg-[#FF5A3C] hover:bg-[#FF7A5C] rounded-full transition-all flex items-center gap-1.5 disabled:opacity-50 min-h-[38px]"
            >
              <Sparkles className="w-3.5 h-3.5" />
              {isSimulating ? 'Simulating...' : 'Auto Run Loop'}
            </button>
          </div>
        </div>

        {/* Step Visualizer Bar */}
        <div className="flex overflow-x-auto pb-2 mb-8 sm:grid sm:grid-cols-5 gap-2.5 scrollbar-none">
          {reactSteps.map((step, idx) => {
            const isActive = currentStep === idx;
            const isPassed = currentStep > idx;
            return (
              <button
                key={idx}
                onClick={() => setCurrentStep(idx)}
                className={`p-3.5 rounded-xl border text-left transition-all shrink-0 min-w-[130px] sm:min-w-0 ${
                  isActive
                    ? 'bg-[#08080a] border-[#FF5A3C] shadow-lg shadow-[#FF5A3C]/10'
                    : isPassed
                    ? 'bg-[#08080a]/60 border-[#1c1c24] text-[#A1A1AA]'
                    : 'bg-[#08080a]/30 border-[#1c1c24]/50 text-[#A1A1AA]/50'
                }`}
              >
                <div className="text-[10px] font-mono uppercase mb-1 flex items-center justify-between">
                  <span>Step 0{idx + 1}</span>
                  {isActive && <span className="w-1.5 h-1.5 rounded-full bg-[#FF5A3C] animate-pulse" />}
                </div>
                <div className={`text-xs font-mono font-bold truncate ${isActive ? 'text-[#FF5A3C]' : 'text-[#F4F4F5]'}`}>
                  {step.phase}
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Step Detail Box */}
        <div className="bg-[#08080a] border border-[#1c1c24] rounded-xl p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <div className="inline-block px-2.5 py-0.5 rounded-full bg-[#14141a] border border-[#FF5A3C]/40 text-[#FF5A3C] font-mono text-[10px] uppercase font-bold mb-3">
              {reactSteps[currentStep].phase} PHASE ACTIVE
            </div>
            <h3 className="text-xl font-bold text-[#F4F4F5] mb-3 font-mono">
              {reactSteps[currentStep].title}
            </h3>
            <p className="text-sm text-[#A1A1AA] leading-relaxed mb-4">
              {reactSteps[currentStep].description}
            </p>
            <div className="p-3 bg-[#14141a] border border-[#1f1f28] rounded-xl text-xs text-[#F4F4F5] font-mono flex items-start gap-2">
              <Zap className="w-4 h-4 text-[#FF5A3C] shrink-0 mt-0.5" />
              <span>{reactSteps[currentStep].details}</span>
            </div>
          </div>

          <div>
            <div className="text-xs font-mono text-[#A1A1AA] mb-2 flex items-center justify-between">
              <span>Miki ReAct Kernel Implementation</span>
              <span className="text-[10px] text-[#FF5A3C]">TypeScript</span>
            </div>
            <div className="bg-[#14141a] border border-[#1f1f28] rounded-xl p-4 font-mono text-xs text-[#A1A1AA] overflow-x-auto">
              <pre><code>{reactSteps[currentStep].code}</code></pre>
            </div>
          </div>
        </div>
      </div>

      {/* Token Cost & Latency Estimator Calculator */}
      <div className="bg-[#0e0e12] border border-[#1c1c24] rounded-2xl p-6 sm:p-8 mb-12">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[#FF5A3C]">◆</span>
          <h2 className="text-lg font-bold text-[#F4F4F5] font-mono">ReAct Loop Token Cost & Latency Calculator</h2>
        </div>
        <p className="text-xs text-[#A1A1AA] font-mono mb-8">
          Estimate token usage and cost per task based on loop depth and model provider.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Controls */}
          <div className="space-y-6 lg:col-span-2 bg-[#08080a] border border-[#1c1c24] rounded-2xl p-6">
            <div>
              <div className="flex justify-between text-xs font-mono text-[#A1A1AA] mb-2">
                <span>ReAct Loop Iterations</span>
                <span className="text-[#FF5A3C] font-bold">{taskIterations} Steps</span>
              </div>
              <input
                type="range"
                min="2"
                max="24"
                value={taskIterations}
                onChange={(e) => setTaskIterations(parseInt(e.target.value))}
                className="w-full accent-[#FF5A3C] bg-[#14141a] rounded cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-mono text-[#A1A1AA] mb-2">
                <span>Tool / Skill Calls per Task</span>
                <span className="text-[#FF5A3C] font-bold">{toolCallsCount} Calls</span>
              </div>
              <input
                type="range"
                min="0"
                max="10"
                value={toolCallsCount}
                onChange={(e) => setToolCallsCount(parseInt(e.target.value))}
                className="w-full accent-[#FF5A3C] bg-[#14141a] rounded cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-[#A1A1AA] mb-2">Target LLM Provider</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'gemini-2.5-flash', label: 'Gemini 2.5 Flash' },
                  { id: 'gemini-1.5-pro', label: 'Gemini 1.5 Pro' },
                  { id: 'gpt-4o', label: 'GPT-4o' }
                ].map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setModelType(m.id as any)}
                    className={`py-2 px-3 text-xs font-mono rounded-full border transition-all ${
                      modelType === m.id
                        ? 'bg-[#FF5A3C] text-white border-[#FF5A3C] font-bold'
                        : 'bg-[#14141a] text-[#A1A1AA] border-[#1f1f28] hover:text-white'
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Results Summary Box */}
          <div className="bg-[#08080a] border border-[#1c1c24] rounded-2xl p-6 flex flex-col justify-between">
            <div>
              <div className="text-[10px] font-mono text-[#A1A1AA] uppercase tracking-wider mb-1">
                Estimated Task Metrics
              </div>
              <div className="text-3xl font-bold text-[#FF5A3C] font-mono mb-6">
                ${costPerTask} <span className="text-xs font-normal text-[#A1A1AA]">/ task</span>
              </div>

              <div className="space-y-3 font-mono text-xs border-t border-[#1c1c24] pt-4">
                <div className="flex justify-between">
                  <span className="text-[#A1A1AA]">Input Tokens:</span>
                  <span className="text-[#F4F4F5] font-bold">{estimatedInputTokens.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#A1A1AA]">Output Tokens:</span>
                  <span className="text-[#F4F4F5] font-bold">{estimatedOutputTokens.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#A1A1AA]">Est. Latency:</span>
                  <span className="text-[#FF5A3C] font-bold">{estimatedLatency} ms</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => navigate('/pricing')}
              className="w-full mt-6 py-2.5 px-3 text-xs font-mono text-white bg-[#14141a] border border-[#1f1f28] hover:border-[#FF5A3C] rounded-full transition-all text-center min-h-[40px]"
            >
              Compare Cloud Managed Pricing
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

