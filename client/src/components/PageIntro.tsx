// Quiet Runtime: editorial page introduction used to keep all supporting pages consistent.
interface PageIntroProps {
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}

export default function PageIntro({ eyebrow, title, children }: PageIntroProps) {
  return (
    <header className="page-intro">
      <p className="eyebrow">{eyebrow}</p>
      <h1>{title}</h1>
      <div className="intro-copy">{children}</div>
    </header>
  );
}
