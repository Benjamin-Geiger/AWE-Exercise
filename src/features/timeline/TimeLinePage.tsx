import type { ReactElement } from "react";
import type { CaseDataset } from "../../app/useCaseData.js";
import { TimeLineList } from "./components/TimeLineList.js";
import { KeyDemo } from "./components/KeyDemo.js";

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
        <KeyDemo events={sortedEvents.slice(0, 4)} />

      <h2>Investigation Timeline</h2>
      <TimeLineList events={sortedEvents} locations={locations} />
    </section>
  );
}
