import { useEffect, useState } from "react";
import { parseView } from "./routes.js";
import type { ViewName } from "./routes.js";

export function useHashRoute(): ViewName {
  const [view, setView] = useState<ViewName>(() => parseView(window.location.hash));

  useEffect(() => {
    const onHashChange = (): void => setView(parseView(window.location.hash));
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  return view;
}

export function navigateTo(view: ViewName): void {
  window.location.hash = view;
}
