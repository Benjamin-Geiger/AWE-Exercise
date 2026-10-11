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

# Demo 3

"Domain IDs are preferable whenever available"

person, location and event in the data already has a id that belongs to the item itself, not to its array position.
When lists are reordered/filtered react can still match each card to the same item.

## Q1

React uses the key during reconciliation to find out which item in a new list is the same as in the previous render. It decides which items are keept, moved, created or removed.

Every update goes through render, then reconciliation, then commit.
During reconciliation the previous and next element trees are compared by their type, position and key.
In lists this decision has to be made for every child. Without a key react can only match by position and wouldnt know which item is which when entries are inserted, removed or reordered.

# Demo 4

edit a component file while npm run dev is running, Vite re-renders the component without reloading the page

start app -> tick checkbox -> reorder array in editor

Change KeyDemo:11 to '{[...events].reverse().map((event, index) => ('

-> titels reversed -> tick still on

React thinks key 0 existed before and still exists and that its the same element. keeps the old <li> and its checked checkbox, only swaps the text from props

-> change index to "event.id"
-> react now matches by id

## Q1

React can no longer tell which old element corresponds to which new item.

Missing key behaves just like index as key, react has to match by position
Duplicate Key -> two elements who claim the same id -> React could update/keep/remove a wrong one
Index-based -> id bound to position -> state could ends up on wrong item (checkbox example)

## Q2

no warning -> react only wars about missing/duplicate key -> index is still a key

visual change -> only if the item holds a state that isnt derived from props.

## Q3

When the data is completley static, is never changed, reordered or filtered.
e.g Persons responsibilities -> no ids, never sorted or edited after render, no state
-> two responsibilites could have the same text -> would lead to duplicate key

# Demo 5

## T1

Presentational component -> "Receives data and callbacks through props and focuses on rendering a reusable view."

Feature component -> "Knows domain use cases, chooses data, owns state, coordinates routing, or translates application actions into presentational props."

Feature components:

App.tsx -> owns state(useHashRoute, useCaseData), coordinates routing via renderPage, decides load, error, ready

Dashboardpage -> recieves data and translates it to props

PeopleLocationsPage -> people and locations from data is passed to the cards

TimeLinePage -> decides data order

AppHeader -> only renders currentView but calls navigateTo

Presentational components:

Badge, Panel, MiniListItem, StatCard, ReviewProgess, CaseSummarCard, RecentEvidenceList, RecentTimelineList, PersonCar, LocationCard, TimeLineEventCard

All these are only concerned with display/layout logic.

## T2

AppHeader currently contains the header but also handles navigation.

## Q1

AppHeader -> now only presentational and only arranges header layout

MainNav -> Is responsible for moving between views

No changes in each component would affect the other, they only share currentView

## Q2

§15.6 "an isolated responsibility that can change independently"

Navigation changes with every routing decision, the header stays the same

# Demo 6

## Q1

By type -> files are grouped by theri technical role e.g components, hooks, utils etc., features could be spread acress several folders.

By feature -> files grouped by domail capability e.g having timeline/ containing its page, components and helpers

"A feature-oriented structure keeps code near the domain capability it supports."
"keeps domain-specific components, types, and utilities close to the capability they support."
"A flat directory works for a small prototype but becomes difficult when many files have generic names"

app -> one feature folder for each of the 5 seperate views of the app
-> provides good overview for each feature and keeps files close to the component that uses them
-> changes stay local to their feature without touching other features

## Q2

Rule from the manuscript:
"A component remains feature-local when its meaning and change reasons belong to one feature. It moves to shared only after it has a genuinely reusable contract."
"Being presentational does not automatically make it shared." 

Shared:
E.g Badge is used by TimeLineEventCard for the certainty badge, and Dashboard uses it for CaseSummaryCard and RecentEvidenceList

Feature-local:
e.g PersonsCard, is only presentational but the Props are for Person data only. Its meaning is only relevant to People and Locations, and it would only be changed there.

Panel and MiniListItem, currently not shared but remain in shared for further use during migration. Their data contract is generic with no feature specific fields thus I didn't put them in a feature folder.

# Demo 7

Badge -> presentational element that only renders a span, no data access no state

typed props -> BadgeProps, uses BadgeTone (neutral, positive, warning, critical) and string label.

TimeLineEventCard -> Uses Badge to display the certainty (contradictory, reported, confirmed)
RecentEvidenceList -> Uses badge to display status (neutral, positive, warning)

Both use the same badge design, but choose the tone. None of the badges props are feature specific.

## Q1

TimeLineEventCard & RecentEvidenceList

variations:
label -> changes the text shown
tone -> selects between 4 tones that correspond to different styles

fixed:
markup -> the span
className -> badge
mapping -> each tone coresponds to a CSS style

Feature specific stays in its feature and uses thier own domain values to set the tones. Bagde never knows about status or certainty, it only gives the form and style.

Only content that is really shared moves into the badge everything else is each features concern.

## Q2

In the vanilla app badge was build three times: app-old: 274, 406, 768
Dashboard uses getStatusBadgeClass helper function
Timeline uses certaintyBadgeClass helper
Both use the same markup, but get different results through their helpers.

New ver.:

Single source of truth -> Changing the Badge only needs a change in Badge.tsx and all implementation of badge change. In the previous version youd have to change every badge independently.

Typed contract -> explicit content contract ensures correct building of the badge, missing tone or label would be a compiler error.
A typo in the html string of the old ver. would compile but might break the components content or visual.

Composition instead of concatenation -> small independent components that can be combined, instead of extending an existing one.