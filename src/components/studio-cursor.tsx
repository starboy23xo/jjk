import { useEffect, useRef, useState } from "react";

/**
 * Sketch-pen cursor: a small accent dot with a trailing hand-drawn ring.
 * Only enabled for fine pointers (mouse) and when motion is allowed.
 */
export function StudioCursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)");
    const allow = fine.matches && !calm.matches;
    setEnabled(allow);
    if (!allow) return;

    document.documentElement.classList.add("has-studio-cursor");

    let x = window.innerWidth / 2, y = window.innerHeight / 2;
    let rx = x, ry = y, frame = 0, active = false;

    const move = (event: PointerEvent) => {
      x = event.clientX; y = event.clientY;
      if (!active) { active = true; rx = x; ry = y; document.documentElement.classList.add("cursor-ready"); }
      const target = event.target as HTMLElement | null;
      const interactive = !!target?.closest("a, button, summary, input, select, textarea, .service-stop, [role='button']");
      ring.current?.classList.toggle("is-hot", interactive);
      dot.current?.classList.toggle("is-hot", interactive);
    };
    const leave = () => document.documentElement.classList.remove("cursor-ready");
    const press = (on: boolean) => () => ring.current?.classList.toggle("is-press", on);

    const loop = () => {
      rx += (x - rx) * 0.18; ry += (y - ry) * 0.18;
      if (dot.current) dot.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      if (ring.current) ring.current.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
      frame = requestAnimationFrame(loop);
    };
    frame = requestAnimationFrame(loop);

    const down = press(true), up = press(false);
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerdown", down, { passive: true });
    window.addEventListener("pointerup", up, { passive: true });
    document.addEventListener("pointerleave", leave);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
      document.removeEventListener("pointerleave", leave);
      document.documentElement.classList.remove("has-studio-cursor", "cursor-ready");
    };
  }, []);

  if (!enabled) return null;
  return (
    <div aria-hidden="true">
      <div ref={ring} className="studio-cursor-ring" />
      <div ref={dot} className="studio-cursor-dot" />
    </div>
  );
}
