// Quiet Runtime: a spacious editorial mission page, intentionally free from feature clutter.
import PageIntro from "@/components/PageIntro";

export default function About() {
  return (
    <section className="editorial-page shell-width about-page">
      <div className="about-reading-column">
        <PageIntro eyebrow="01 / About" title="Autonomy should feel clear.">
          <p>Agent Miki is built for work that needs continuity, not another isolated response. It receives a goal, keeps the useful context, and moves the next action forward with intent.</p>
        </PageIntro>
      </div>
      <aside className="about-runtime-note" aria-label="Runtime operating note">
        <span>System note / 01</span>
        <strong><i /> Continuity enabled</strong>
        <p>Observe → act → retain → continue</p>
      </aside>
      <div className="about-principles" aria-label="Operating principles">
        <span>Quiet by default</span><span>Stateful by design</span><span>Continuity over noise</span>
      </div>
    </section>
  );
}
