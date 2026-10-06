import type { ReactElement } from "react";
import type { ViewName } from "./routes.js";

interface PlaceholderPageProps {
  title: string;
  view: ViewName;
}

// placeholder for upcoming pages
export function PlaceholderPage({ title, view }: PlaceholderPageProps): ReactElement {
  return (
    <section>
      <h2>{title}</h2>
      <p>
        Nothing here yet :/
      </p>
    </section>
  );
}
