# Exercise 3

## Demo 1

Static Web -> Dynamic SSR/MPA -> AJAX and Rich Pages -> CSR/SPA -> Hybrid and selective

Just static HTML files, Links to other HTML files -> little to no client logic, only full reload

Dynamic content e.g. response depends on database, user etc -> content can vary between requests -> Server side rendering

Multi page applications (old) -> route between pages via links/URLs -> state trough forms, urls, cookies etc -> browser get full document
--> Navigation takes long, document always has to be completley replaced, interactive interfaces hard to implement

SSR + AJAX -> whole page loads, specific elements load async
Libraries such as jQuery reduced browser incompatibilities and simplified DOM selection, event handling, and network requests.

AJAX: 
+ only fetch specifc data without full reload
+ less interruption
+ more possibilites
increased app logic and state within browser -->
- hard history/nav tracking
- more complexity
- harder debugging

Design patterns like MVC, MVVM to acommodate increasingly large frontend code 
Client-side frameworks emerged to provide systematic rendering, state ownership, and application structure rather than scattered DOM manipulation.

This App: Stage 4 - CSR/SPA -> Hash based routing as a solution to AJAX nav history issue. 

## Demo 2

server sends on first request:
SSR -> complete HTML document. Server runs logic.
CSR -> small HTML shell, references to JS/CSS. Data via APIs.

what browser must do:
SSR -> Nothing, maybe a litte JS
CSR -> Everything - download shell, load JS/CSS, compile/run JS, fetch data, build DOM

subsequent Navigation:
SSR -> browser leaves old, loads new doc
CSR -> doc remains, view is switched, app requests only required data

Website SSR example: GitHub -> View Source, filled HTML is loaded, not just a shell

## Q1

APP is CSR. App is SPA, one URL only hash changes on navigation.

Browser requests "/AWE-Exercise/" -> Server returns index.html -> browser builds DOM -> browser downloads script module -> code runns to render the page

## Q2 

There is no meaningful content in the HTML. Turning of JS results just in an endless loading spinner. Without JS the content isn't loaded and the page litteraly useless.

Crawlers that don't run JS would only see the header content, Js content doesn't load.

CSR saves communication round trips. Server just servers files.

## Demo 3

Virtual DOM: Depiction of what the UI should look like. Easier UI building/change without rebuilding everything.

Bookmark Star:
Handler sees data-action="bookmark" and calls handleBookmarkClick(id) (app-old.md:422-424).

ID is pushed onto bookmarks and bookmarked flag is flipped (app-old.md:438-446).

handler then calls renderEvidenceList() (app-old.md:448) -> rebuilds every visible card

## Q1

The bookmark example doesnt create any elements. With the virtual DOM if an element already exists it is reused.
If it finds a content change e.g the star icon for the bookmark, its rerendered.

## Q2

The virtual DOM is an accounting model, not a speed guarantee. React performs additional JavaScript work to calculate and compare UI descriptions. The benefit is a consistent declarative update model and targeted commits, not a universal claim that every React update is faster than every direct DOM operation.

With vDOM work is added on every update, hand writing exact updates -> faster
You get -> A simple model - don't have to track data dependecies of the DOM by hand
-> keep untouched nodes, selections, scroll positions, input values and listeners survive

## Q3

vDOM only decides which DOM changes to make.

Expensive calculations inside components. Filtering, sorting, or transforming large data runs again on every render. Diffing is after, so no help.

## Demo 4

Preserverd:
Bookmarks -> local storage
Saved notes -> local storage
saved hypothesis -> local storage
current view -> hash in URL

Lost:
Review & Relevance status
unsaved note text
ev catalogue search/filters

With MPA:
MPA vs. this app
Server request for each nav click - no server request
data loaded again - only load on start
server decides render - browser decides

## Q1

MPA -> not data in the browser between requests except cookies, forms, nav throws DOM and JS state away. Data lives on the server, db or cookie. 

SPA -> Data in client memory - UI state, server state, data in localStorage
+ fast bc data already in memory
+ UI state survives nav
+ server has less work
- more work to keep state correct
- deliberate decicion necesarry when to refetch -> data changes, keep synced

## Q2

Router, maps any URL to a component tree, its parameters, its data and its lifecycle, and keeps all of that in sync with browser history.
the hand-rolled version just maps a fragment to a CSS class and toggles between them.

## Q3 

Back button, returns to previous view -> no reload.

Hash routing uses the browsers URL history, #view -> new url between views.

## Demo 5

React docs component demo:

function MyButton() {
  return (
    <button>
      I'm a button
    </button>
  );
}

export default function MyApp() {
  return (
    <div>
      <h1>Welcome to my app</h1>
      <MyButton />
    </div>
  );
}

React component is just a function used to build an UI element. Returns HTML. - components can be reused and extended or used by other components.

## Q1

JSX resembles HTML but is not an HTML string and is not interpreted directly by the browser. A build transform converts JSX into JavaScript expressions that create React elements, which are immutable descriptions
of the desired UI.

-> compiles to plain js, to an object describing the ui element to build

## Q2

The old function just retruns plain text. It becommes dom when assignt to the container.innerHTML.

JSX has no HTML, its compiled to JS which builds js objects. The objects describe what element to build and what it looks like. When called react uses the functions to build the dom.

## Q3

Render doesn't just run once. It might restart work and mutate the variable without an actual rerender.
Differences between dev/prod. Dev checks could call the function twice.
--> side effects belong in event handlers not jsx components.

## Demo 6

### T1
package.json -> added dependencies, react&reactdom
             -> devDep - vite react plugin
             -> devDep - type definitions for jsx
vite.config  -> turned on plugin
tsconfig     -> added jsx typecheck
### T2
main.tsx -> entry point, finds root, creates container and renders App function.

App.tsx -> new component with header and text, reused into-card style.

index.html -> added div containing the new component
            -> added main.tsx script
### T3
Complete swapover would break the app for the duration of the migration. Every view needs to be in react.
Comparing old/new version is harder.
-> simple solution

Separate React version:
own html page, separate root, old app stays as is
-> easier to compare the versions
-> no DOM interference, bc separate pages
but
-> more work

## Demo 7

src/
  app/
    App.tsx                   
    AppShell.tsx              
    router.ts                 
  features/
    dashboard/
      DashboardPage.tsx       
      components/
        CaseSummaryCard.tsx  
        StatCard.tsx                                                        
        ReviewProgress.tsx                                                   
        RecentEvidenceList.tsx                                                 
        RecentTimelineList.tsx                                                 
    evidence/
      EvidencePage.tsx        
      components/
        EvidenceToolbar.tsx   
        EvidenceList.tsx
        EvidenceCard.tsx
        BookmarkButton.tsx
        TagChip.tsx
        EvidenceDetail.tsx
        NoteEditor.tsx
    people/
      PeopleLocationsPage.tsx 
      components/
        PersonCard.tsx        
        LocationCard.tsx
    timeline/
      TimelinePage.tsx        
      components/
        TimelineToolbar.tsx   
        TimelineEventCard.tsx
        EvidenceQuickView.tsx
    workspace/
      WorkspacePage.tsx      
      components/
        BookmarksList.tsx     
        NotesList.tsx
        HypothesisForm.tsx
  shared/
    components/               
      Panel.tsx
      Badge.tsx
      Button.tsx
      MiniListItem.tsx
      FilterSelect.tsx
      EmptyState.tsx
      Spinner.tsx
    format/
      dates.ts                
