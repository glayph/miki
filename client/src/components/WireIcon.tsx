// Quiet Runtime: textless wireframe marks that avoid decorative icon clutter.
type WireIconName = "motion" | "systems" | "memory" | "tools";

export default function WireIcon({ name }: { name: WireIconName }) {
  return (
    <span className={`wire-icon wire-icon--${name}`} aria-hidden="true">
      <i />
      <i />
      <i />
    </span>
  );
}
