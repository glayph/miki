// Quiet Runtime: simple route recovery with a clear way back to the product story.
import { Link } from "wouter";

export default function NotFound() {
  return (
    <section className="not-found shell-width">
      <p className="eyebrow">404 / Not found</p>
      <h1>This route is not running.</h1>
      <Link href="/" className="solid-button">Return home <span aria-hidden="true">↗</span></Link>
    </section>
  );
}
