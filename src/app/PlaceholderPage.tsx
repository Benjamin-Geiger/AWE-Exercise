import type { ReactElement } from "react";

interface PlaceholderPageProps {
  title: string;
}

// placeholder for upcoming pages
export function PlaceholderPage({ title }: PlaceholderPageProps): ReactElement {
  return (
    <section>
      <h2>{title}</h2>
      <p>Nothing here yet :/</p>
    </section>
  );
}
