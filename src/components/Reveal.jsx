import { useEffect, useRef, useState } from "react";
import { classNames } from "@/lib/utils";
/** Subtle scroll-reveal wrapper (respects prefers-reduced-motion via CSS) */
export default function Reveal({ children, className, delay = 0 }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect();
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -40px 0px",
      },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      className={classNames("reveal", visible && "is-visible", className)}
      style={
        delay
          ? {
              transitionDelay: `${delay}ms`,
            }
          : undefined
      }
    >
      {children}
    </div>
  );
}
