// Quiet Runtime: compact footer that preserves an intentionally quiet closing note.
import { Link } from "wouter";

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="shell-width footer-inner">
        <p>© {new Date().getFullYear()} Agent Miki</p>
        <p className="footer-statement">A quiet runtime for work that continues.</p>
        <div className="footer-links">
          <Link href="/about">About</Link>
          <Link href="/contact">Contact</Link>
        </div>
      </div>
    </footer>
  );
}
