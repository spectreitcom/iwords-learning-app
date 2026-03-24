import { useEffect, type RefObject } from "react";

export function useClickOutside(
  ref: RefObject<HTMLElement | null>,
  onClickOutside: () => void,
) {
  useEffect(() => {
    const elem = ref.current;
    if (!elem) return;

    const abortController = new AbortController();

    document.addEventListener(
      "click",
      (e) => {
        if (!elem.contains(e.target as Node)) {
          onClickOutside();
        }
      },
      { signal: abortController.signal },
    );

    return () => abortController.abort();
  }, [ref, onClickOutside]);
}
