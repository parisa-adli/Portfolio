// Dev-only A · B · C switcher (§6). Only A exists so far: B and C render disabled, never as dead links.
// When they exist, make them links that carry ?y=<scrollY> so the scroll position is kept.
export function PrototypeSwitcher({ current }: { current: "a" | "b" | "c" }) {
  if (process.env.NODE_ENV !== "development") return null;
  return (
    <nav className="proto-switch" aria-label="Prototype (dev only)">
      {(["a", "b", "c"] as const).map((p) =>
        p === current ? (
          <span key={p} className="proto-switch__item is-current" aria-current="page">
            {p.toUpperCase()}
          </span>
        ) : (
          <span key={p} className="proto-switch__item is-disabled" title="Not built yet">
            {p.toUpperCase()}
          </span>
        ),
      )}
    </nav>
  );
}
