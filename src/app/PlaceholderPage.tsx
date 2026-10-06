import type { ReactElement } from "react";
import type { ViewName } from "./routes.js";

interface PlaceholderPageProps {
  title: string;
  view: ViewName;
}

// stand-in for views that are migrated in Exercises 4 and 5
export function PlaceholderPage({ title, view }: PlaceholderPageProps): ReactElement {
  return (
    <section>
      <h2>{title}</h2>
      <p>
        Not migrated to React yet. Use the <a href={`./#${view}`}>vanilla version</a> for now.
      </p>
    </section>
  );
}
