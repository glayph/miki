// Quiet Runtime: compact, low-noise navigation with an accessible mobile disclosure.
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "wouter";

const links = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/features", label: "Features" },
  { href: "/contact", label: "Contact" },
];

export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [location] = useLocation();

  return (
    <header className="site-header">
      <div className="shell-width header-inner">
        <Link href="/" className="brand" aria-label="Agent Miki home" onClick={() => setOpen(false)}>
          <img src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663383877217/yuqtgZBmArYuGRHd.png" alt="" className="brand-mark" />
          <span className="brand-lockup"><b>{'{AGENT}'}</b><em>MIKI</em></span>
        </Link>

        <nav className="desktop-nav" aria-label="Primary navigation">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className={location === link.href ? "nav-link is-current" : "nav-link"}>
              {link.label}
            </Link>
          ))}
        </nav>

        <Link href="/contact" className="header-cta">
          Start
          <span aria-hidden="true">↗</span>
        </Link>

        <button
          type="button"
          className="menu-trigger"
          aria-label={open ? "Close navigation" : "Open navigation"}
          aria-expanded={open}
          aria-controls="mobile-navigation"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {open && (
        <nav id="mobile-navigation" className="mobile-nav" aria-label="Mobile navigation">
          <div className="shell-width mobile-nav-inner">
            {links.map((link) => (
              <Link key={link.href} href={link.href} className={location === link.href ? "mobile-link is-current" : "mobile-link"} onClick={() => setOpen(false)}>
                {link.label}
                <span aria-hidden="true">↗</span>
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
