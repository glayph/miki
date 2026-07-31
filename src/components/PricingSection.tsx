import React from 'react';
import { Check, ArrowRight, Sparkles, Shield, Server } from 'lucide-react';
import { PRICING_PLANS } from '../data/mikiContent';

interface PricingSectionProps {
  onSelectPlan: (planId: string) => void;
}

export const PricingSection: React.FC<PricingSectionProps> = ({ onSelectPlan }) => {
  return (
    <section id="pricing" className="py-20 border-b border-[#27272A] bg-[#0A0A0B]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#111113] border border-[#27272A] text-xs font-mono font-bold tracking-widest text-[#FF5A3C] uppercase mb-4">
            Transparent Pricing
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-[#F4F4F5] uppercase tracking-tight mb-4">
            Simple Plans for Every Architecture
          </h2>
          <p className="text-[#A1A1AA] text-sm sm:text-base">
            Start free with self-hosted open-source core, scale seamlessly to managed cloud runtime.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {PRICING_PLANS.map((plan) => {
            const isHighlighted = plan.highlighted;

            return (
              <div
                key={plan.id}
                className={`p-8 rounded-lg bg-[#111113] border flex flex-col justify-between transition-all relative ${
                  isHighlighted
                    ? 'border-[#FF5A3C] ring-1 ring-[#FF5A3C]'
                    : 'border-[#27272A] hover:border-[#A1A1AA]/40'
                }`}
              >
                {/* Badge if present */}
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-[#FF5A3C] text-white font-mono text-[10px] font-bold tracking-wider">
                    {plan.badge}
                  </div>
                )}

                <div>
                  <h3 className="text-xl font-bold font-mono text-[#F4F4F5] mb-2">{plan.name}</h3>
                  <p className="text-xs text-[#A1A1AA] leading-relaxed mb-6 font-sans">
                    {plan.description}
                  </p>

                  <div className="flex items-baseline gap-1 mb-8">
                    <span className="text-4xl font-extrabold font-mono text-[#F4F4F5]">{plan.price}</span>
                    <span className="text-xs font-mono text-[#A1A1AA]">/ {plan.period}</span>
                  </div>

                  {/* Feature Checklist */}
                  <div className="space-y-3 mb-8">
                    <div className="text-[11px] font-mono text-[#FF5A3C] uppercase tracking-wider mb-2">
                      INCLUDED CAPABILITIES:
                    </div>
                    {plan.features.map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-xs text-[#F4F4F5]">
                        <Check className="w-4 h-4 text-[#FF5A3C] shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Plan CTA */}
                <button
                  onClick={() => onSelectPlan(plan.id)}
                  className={`w-full py-3 px-4 text-xs font-mono font-medium rounded-lg transition-all flex items-center justify-center gap-2 ${
                    isHighlighted
                      ? 'bg-[#FF5A3C] hover:bg-[#FF7A5C] text-white shadow-lg'
                      : 'bg-[#0A0A0B] hover:bg-[#18181B] text-[#F4F4F5] border border-[#27272A]'
                  }`}
                >
                  {plan.ctaText}
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
