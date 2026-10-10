import type { ReactElement } from "react";
import type { TimelineEvent } from "../../../types.js";

type KeyDemoProps = {
  events: TimelineEvent[];
};

export function KeyDemo({ events }: KeyDemoProps): ReactElement {
  return (
    <ul>
      {[...events].reverse().map((event, index) => (
        <li key={index}>
          <label>
            <input type="checkbox" /> {event.id}: {event.title}
          </label>
        </li>
      ))}
    </ul>
  );
}
