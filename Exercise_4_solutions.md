# Demo 1

## Q1

<div>
  <h3>{person.name}</h3>
  <div className="person-role">{person.role}</div>
</div>

The <h3> is JSX structure, and the braces switch to JavaScript.
person.name is a property access on the person prop, its value becomes the headings text
{person.name} is a value inside a UI description that React turns into DOM itself

{} allows any expression that produces a value
statements such as if, for, const etc are not allowed
statements belong before the returned JSX or in a helper

## Q2

"The props type is the component's public contract. TypeScript checks every place the component is used and catches missing, misspelled, or incompatible values before the code runs"

@PeopleLocationPage ->
changed people.map to data.locations.map

ts error:

src/features/people-locations/PeopleLocationsPage.tsx:18:11 - error TS2740: Type 'CaseLocation' is missing the following properties from type 'Person': role, speciality, responsibilities, statement, and 2 more.

18           person={person}
             ~~~~~~

  src/features/people-locations/components/PersonCard.tsx:5:3
    5   person: Person;
        ~~~~~~
    The expected type comes from property 'person' which is declared here on type 'IntrinsicAttributes & PersonCardProps'

person.id stays valid bc location has id too.
error bc of shape missmatch 
-> no error if loc had same shape

## Q3

"Use named props when the component needs a specific data contract. Use children when the component provides a layout or semantic wrapper around arbitrary nested content."

Pops provide a data contract where the component knows what the data is, like person: Person is used to build the PersonCard.

Children: The caller builds the content. "Children" acts as a wrapper to controll the structure.

e.g. Panel is used by RecentEvidenceList and RecentTimeLine List. The Panel only provides the structure, both components can add their individual content.

## Q4

React owns the DOM inside its root. After createRoot React assumes the real DOM matches the last UI description it committed.

Each update goes through render, reconciliation, then commit. React compares the previous description with the next one and applies only the differences, but it never reads the actual DOM to see what's there. So if code changes the DOM directly, react would overwrite it on the next commit or react would work from a wrong picture.

Nodes that would be updated no longer exist or wouldn't match.

Exceptions: focus, media playback, measurements, and third-party widgets

# Demo 2

if (events.length === 0) {
    return <p>No timeline events match the current filters.</p>;
  } 
  return (...)

returns events if(no events) -> returns message

Old version built the html string and threw it away if no events.

TimeLineEventCard.tsx:

events certainty decides badge colour -> state dependent style

## Q1
TimeLineEventCard.tsx: 26

{locationNames.length > 0 && (
  <p className="evidence-meta">Location: {locationNames.join(", ")}</p>
)}

Location line is optional. Only show if locations otherwise nothing. && logical and optional content

locationNames.length > 0 && -> if lenght 0 -> react renders 0 as text -> would appear in the card

false, null, undefinded -> renders to nothing

## Q2

"A component may return null when it should render nothing. Returning an empty div adds an unnecessary DOM node and may affect layout or semantics."

empty <div> still takes up a grid cell and a gap, a "nothing" component would leave a hole

returned null nowhere -> optional empty components avoided with &&
