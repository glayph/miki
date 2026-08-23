// Quiet Runtime: concise numbered capability list with only essential explanation.
import PageIntro from "@/components/PageIntro";
import WireIcon from "@/components/WireIcon";

const features = [
  { number: "01", icon: "motion" as const, state: "Queue", title: "Autonomous execution", text: "Turns a clear goal into the next useful step, then keeps moving." },
  { number: "02", icon: "systems" as const, state: "Ready", title: "Cross-platform runtime", text: "Keeps the same intent intact across Windows and Linux." },
  { number: "03", icon: "memory" as const, state: "Warm", title: "Memory-aware workflow", text: "Retains the context that matters before the next decision." },
  { number: "04", icon: "tools" as const, state: "Linked", title: "Tool coordination", text: "Coordinates files, browser, and systems around one objective." },
];

export default function Features() {
  return (
    <section className="editorial-page shell-width features-page">
      <PageIntro eyebrow="02 / Capabilities" title="Less interface. More progress.">
        <p>Four practical capabilities, expressed without a dense product catalogue.</p>
      </PageIntro>
      <div className="feature-rail" aria-label="Agent Miki capability index">
        {features.map((feature) => (
          <article className="feature-item" key={feature.number}>
            <div className="feature-number">{feature.number}</div>
            <WireIcon name={feature.icon} />
            <div className="feature-copy"><h2>{feature.title}</h2><p>{feature.text}</p></div>
            <span className="feature-state"><i /> {feature.state}</span>
          </article>
        ))}
      </div>
    </section>
  );
}
