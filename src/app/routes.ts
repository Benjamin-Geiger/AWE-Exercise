// the five views, in nav order; same ids as the vanilla hashes
export const VIEWS = [
  { id: "dashboard", label: "Dashboard" },
  { id: "evidence", label: "Evidence" },
  { id: "people", label: "People & Locations" },
  { id: "timeline", label: "Timeline" },
  { id: "workspace", label: "Workspace" },
] as const;

export type ViewName = (typeof VIEWS)[number]["id"];

// unknown or empty hash falls back to the dashboard, like the vanilla handleHashChange()
export function parseView(hash: string): ViewName {
  const raw = hash.replace("#", "");
  return VIEWS.find((v) => v.id === raw)?.id ?? "dashboard";
}
