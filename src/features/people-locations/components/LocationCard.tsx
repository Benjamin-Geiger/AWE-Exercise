import type { ReactElement } from "react";
import type { CaseLocation } from "../../../types.js";

type LocationCardProps = {
    location: CaseLocation;
}

export function LocationCard({ location }: LocationCardProps): ReactElement {
    return (
        <div className="location-card">
            <h3>{location.id} &mdash; {location.name}</h3>
            <p> {location.description} </p>
            <p><strong>Contains:</strong></p>
            <ul>
                {location.contains.map((item) => (
                    <li key={item}>{item}</li>
                ))}
            </ul>
        </div>
    );
}