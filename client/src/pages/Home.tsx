// Quiet Runtime: typography-first home route with one clear action and one calm product surface.
import { Link } from "wouter";

export default function Home() {
  return (
    <div className="home-page">
      <section className="home-hero shell-width">
        <div className="hero-copy">
          <p className="eyebrow">Agent Miki / Autonomous runtime</p>
          <h1>Work that<br />keeps moving.</h1>
          <p className="hero-summary">Agent Miki is a quiet runtime for autonomous work across your system, browser, files, and models.</p>
          <Link href="/contact" className="solid-button hero-button">Start a conversation <span aria-hidden="true">↗</span></Link>
        </div>
        <div className="runtime-visual" aria-label="Illustration of Agent Miki at work">
          <img src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663383877217/lsJDGGMDReFrIvNp.png" alt="Minimal Agent Miki runtime interface" />
          <div className="runtime-caption">
            <span>01 / Runtime</span>
            <span className="status-live"><i /> Active</span>
          </div>
        </div>
      </section>
      <section className="proof-strip shell-width" aria-label="Agent Miki essentials">
        <span>Windows + Linux</span>
        <span>Local-first</span>
        <span>Open runtime</span>
      </section>
    </div>
  );
}
