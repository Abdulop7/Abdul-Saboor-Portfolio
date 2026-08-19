import type { ReactNode } from "react";

/** Infinite horizontal ticker. Content is duplicated; second copy is aria-hidden. */
export default function Marquee({
  children,
  speed = 32,
  className = "",
}: {
  children: ReactNode;
  speed?: number;
  className?: string;
}) {
  return (
    <div
      className={`marquee overflow-hidden ${className}`}
      style={{ "--marquee-speed": `${speed}s` } as React.CSSProperties}
    >
      <div className="marquee-track">
        <div className="flex shrink-0 items-center">{children}</div>
        <div className="flex shrink-0 items-center" aria-hidden>
          {children}
        </div>
      </div>
    </div>
  );
}
