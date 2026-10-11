import type { ReactElement } from "react";
import type { CaseDataset } from "../../types.js";
import { TimeLineList } from "./components/TimeLineList.js";

interface TimeLinePageProps {
  data: CaseDataset;
}

export function TimeLinePage({ data }: TimeLinePageProps): ReactElement {
  const { timeline, locations } = data;

  const sortedEvents = [...timeline].sort(
    (a, b) => new Date(a.time).getTime() - new Date(b.time).getTime(),
  );

  return (
    <section>
      <h2>Investigation Timeline</h2>
      <TimeLineList events={sortedEvents} locations={locations} />
    </section>
  );
}
