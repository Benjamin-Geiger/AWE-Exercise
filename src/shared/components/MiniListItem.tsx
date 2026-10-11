import type { ReactElement, ReactNode } from "react";

interface MiniListItemProps {
  children: ReactNode;
}

// compact row used in the dashboard and workspace lists
export function MiniListItem({ children }: MiniListItemProps): ReactElement {
  return <div className="mini-list-item">{children}</div>;
}
