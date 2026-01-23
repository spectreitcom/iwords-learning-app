import { useEffect, useState } from "react";

export function useClickOutside(elem: HTMLElement | null | undefined) {
  const [clickedOutside, setClickedOutside] = useState(false);

  useEffect(() => {
    if (!elem) return;

    const abortController = new AbortController();

    document.addEventListener(
      "click",
      (e) => {
        setClickedOutside(!elem.contains(e.target as Node));
      },
      { signal: abortController.signal },
    );

    return () => abortController.abort();
  }, [elem]);

  return {
    clickedOutside: clickedOutside,
  };
}
