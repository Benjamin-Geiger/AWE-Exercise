export const VIEWS = [
  { path: "/", label: "Dashboard" },
  { path: "/evidence", label: "Evidence" },
  { path: "/team", label: "People & Locations" },
  { path: "/timeline", label: "Timeline" },
  { path: "/workspace", label: "Workspace" },
] as const;

// react app at base/react,  vanilla app at base
export const ROUTER_BASENAME = `${import.meta.env.BASE_URL}react`;
