import React, { useState, useEffect } from 'react';
import { Key, Plus, Trash2, Copy, Check, ShieldAlert, Lock, AlertTriangle, RefreshCw } from 'lucide-react';
import { ApiKey, ApiKeyCreatedResponse } from '../types';

export const ApiKeyManager: React.FC = () => {
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [keyLabel, setKeyLabel] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [createdKeySecret, setCreatedKeySecret] = useState<string | null>(null);
  const [copiedSecret, setCopiedSecret] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchKeys = async () => {
    try {
      const res = await fetch('/api/auth/keys');
      if (res.ok) {
        const data = await res.json();
        setKeys(data);
      }
    } catch (err) {
      console.error('Failed to fetch API keys', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKeys();
  }, []);

  const handleCreateKey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyLabel.trim() || isGenerating) return;

    setIsGenerating(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/auth/keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ label: keyLabel.trim() })
      });

      if (!res.ok) {
        throw new Error('Failed to create API key');
      }

      const data: ApiKeyCreatedResponse = await res.json();
      setCreatedKeySecret(data.apiKey);
      setKeyLabel('');
      fetchKeys();
    } catch (err: any) {
      setErrorMsg(err.message || 'Error generating API key');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRevokeKey = async (id: string) => {
    if (!confirm('Are you sure you want to revoke this API key? Applications using it will lose access.')) {
      return;
    }

    try {
      const res = await fetch(`/api/auth/keys/${id}`, {
        method: 'DELETE'
      });

      if (res.ok) {
        fetchKeys();
      }
    } catch (err) {
      console.error('Failed to revoke API key', err);
    }
  };

  const handleCopySecret = (secret: string) => {
    navigator.clipboard.writeText(secret);
    setCopiedSecret(true);
    setTimeout(() => setCopiedSecret(false), 2000);
  };

  return (
    <section id="apikeys" className="py-20 border-b border-[#27272A] bg-[#0A0A0B]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#111113] border border-[#27272A] text-xs font-mono font-bold tracking-widest text-[#FF5A3C] uppercase mb-4">
            Developer Access
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-[#F4F4F5] uppercase tracking-tight mb-4">
            API Key Management Studio
          </h2>
          <p className="text-[#A1A1AA] text-sm sm:text-base">
            Generate authentication keys for Miki agent runtimes, SDK instances, and Express server nodes.
          </p>
        </div>

        {/* Modal / Banner for Newly Created Secret Key */}
        {createdKeySecret && (
          <div className="max-w-3xl mx-auto mb-8 p-6 rounded-lg bg-amber-950/30 border border-amber-600/50 text-[#F4F4F5] font-mono space-y-4">
            <div className="flex items-center justify-between text-amber-400">
              <span className="text-xs font-bold flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                SECRET API KEY CREATED — COPY IMMEDIATELY
              </span>
              <button
                onClick={() => setCreatedKeySecret(null)}
                className="text-xs hover:underline text-[#A1A1AA]"
              >
                Close Warning
              </button>
            </div>

            <p className="text-xs text-[#A1A1AA] leading-relaxed">
              For security, Miki stores only the hashed signature of your key on the server. Copy this raw secret key now. You will not be able to retrieve it again.
            </p>

            <div className="flex items-center gap-2 p-3 rounded bg-[#0A0A0B] border border-[#27272A]">
              <code className="flex-1 text-xs text-[#FF5A3C] break-all">{createdKeySecret}</code>
              <button
                onClick={() => handleCopySecret(createdKeySecret)}
                className="px-3 py-1.5 bg-[#FF5A3C] hover:bg-[#FF7A5C] text-white text-xs rounded font-medium flex items-center gap-1.5 transition-colors shrink-0"
              >
                {copiedSecret ? <Check className="w-3.5 h-3.5 text-green-300" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedSecret ? 'Copied' : 'Copy Key'}
              </button>
            </div>
          </div>
        )}

        {/* Create Key Form */}
        <div className="max-w-3xl mx-auto mb-10 p-6 rounded-lg bg-[#111113] border border-[#27272A]">
          <h3 className="text-sm font-mono font-bold text-[#F4F4F5] mb-4 flex items-center gap-2">
            <Plus className="w-4 h-4 text-[#FF5A3C]" />
            Generate New Developer API Key
          </h3>

          <form onSubmit={handleCreateKey} className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={keyLabel}
              onChange={(e) => setKeyLabel(e.target.value)}
              placeholder="e.g. Production Agent Node - US East"
              required
              className="flex-1 bg-[#0A0A0B] border border-[#27272A] focus:border-[#FF5A3C] rounded-lg px-4 py-2.5 text-xs font-mono text-[#F4F4F5] focus:outline-none"
            />
            <button
              type="submit"
              disabled={isGenerating || !keyLabel.trim()}
              className="px-5 py-2.5 bg-[#FF5A3C] hover:bg-[#FF7A5C] text-white text-xs font-mono font-medium rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-50 shrink-0"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  Hashing & Provisioning...
                </>
              ) : (
                <>
                  <Key className="w-3.5 h-3.5" />
                  Generate API Key
                </>
              )}
            </button>
          </form>

          {errorMsg && (
            <p className="mt-3 text-xs font-mono text-red-400">{errorMsg}</p>
          )}
        </div>

        {/* API Key Table / List */}
        <div className="max-w-3xl mx-auto p-6 rounded-lg bg-[#111113] border border-[#27272A]">
          <div className="flex items-center justify-between pb-4 border-b border-[#27272A] mb-4 text-xs font-mono text-[#A1A1AA]">
            <span>REGISTERED KEYS ({keys.length})</span>
            <span>SERVER ROUTE: POST /api/auth/keys</span>
          </div>

          {loading ? (
            <div className="py-8 text-center text-xs font-mono text-[#A1A1AA]">
              Fetching registered API keys...
            </div>
          ) : keys.length === 0 ? (
            <div className="py-8 text-center text-xs font-mono text-[#A1A1AA]">
              No API keys generated yet. Use the form above to generate your first key.
            </div>
          ) : (
            <div className="space-y-3 font-mono">
              {keys.map((k) => (
                <div
                  key={k.id}
                  className="p-4 rounded bg-[#0A0A0B] border border-[#27272A] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-bold text-[#F4F4F5]">{k.label}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] ${
                        k.status === 'active' ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800' : 'bg-red-950/60 text-red-400 border border-red-800'
                      }`}>
                        {k.status.toUpperCase()}
                      </span>
                    </div>
                    <div className="text-xs text-[#A1A1AA] flex items-center gap-3">
                      <span className="text-[#FF5A3C]">{k.keyPrefix}</span>
                      <span>•</span>
                      <span>Created {new Date(k.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {k.status === 'active' && (
                    <button
                      onClick={() => handleRevokeKey(k.id)}
                      className="px-3 py-1.5 text-xs text-red-400 hover:text-red-300 bg-red-950/30 hover:bg-red-950/60 border border-red-800 rounded transition-colors flex items-center gap-1.5 shrink-0"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Revoke Key
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </section>
  );
};
