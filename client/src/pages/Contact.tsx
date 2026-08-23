// Quiet Runtime: asymmetric contact page with a naked accessible form.
import ContactForm from "@/components/ContactForm";

export default function Contact() {
  return (
    <section className="contact-page shell-width">
      <div className="contact-invitation">
        <p className="eyebrow">03 / Contact</p>
        <h1>Begin with<br />one clear goal.</h1>
        <p>Tell us what must continue. Agent Miki is designed for the work after the first answer.</p>
        <div className="contact-runtime-note"><span>Runtime intake / 03</span><strong><i /> Awaiting objective</strong></div>
      </div>
      <ContactForm />
    </section>
  );
}
