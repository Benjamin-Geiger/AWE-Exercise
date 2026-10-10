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