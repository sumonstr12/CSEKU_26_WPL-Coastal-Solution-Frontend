import { useEffect, useRef } from "react";

/** Close dropdowns/popovers when clicking outside or pressing Escape. */
export function useClickOutside(onClose, active = true) {
  const ref = useRef(null);

  useEffect(() => {
    if (!active) return undefined;
    const onPointer = (e) => {
      if (ref.current && !ref.current.contains(e.target)) onClose();
    };
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [onClose, active]);

  return ref;
}
