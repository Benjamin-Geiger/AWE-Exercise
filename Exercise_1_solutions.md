# Exercise 1 Solutions

## Demo 1

### Q1

A classic script shares the page's global environment with other classic scripts. Modules have their own top-level scope are always strict, support static imports, exports and are deffered by default.

index.html uses inline handlers (onclick="navigateTo('dashboard')"). They are evaluated in global scope, but module top-level functions never land on window -> they have to be republished manually in app.js:54.

### Q2

state.js has to export it and the consumer has to import it. An import is a live, read-only view of the exporting module's binding, not a copy. Read-only means a consumer can't assign to it, only the owning module may reassign.

Forgetting the import entirely -> "ReferenceError: allEvidence is not defined".Modules are always strict, so the mistake fails near its cause. The old app.js was not strict: a typo like "allEvidnce = data" silently created a new global, left allEvidence empty, and showed up much later as an empty dashboard with no error.

### Q3

Named exports make the imported identifier explicit and allow several public values per module. A default export is one primary value that the importer can rename freely. Named exports refactor more consistently because the exported name travels with the symbol.

I used named exports everywhere, there is no export default in the refactor. However default exports could have been used for files that only export one function for simpler imports.

### Q4

Modules are fetched under browser security and MIME-type rules. Opening a project through file:// commonly fails for modules and fetch requests because it sends no Content-Type so CORS and MIME check fail. We need a local HTTP server as part of the execution environment.

The CORS part is the same reason fetch("data/evidence.json") fails from disk -> same cause as data loading.

The MIME check is module-only. Classic scripts don't have it and are also exempt from the CORS check, which is why the old app.js still ran from file:// After the split the page is completely dead instead.

## Demo 2

Changing Evidence view sort dropdown reorders data of other views. e.g. Workspace supporting evidence selection is reorderd by evidence sort.

Passing "allEvidence" copies the pointer, not the content -> data-loading.js:58-60 sets both names to the same array.

In evidence-catalogue.js:173 "filteredEvidence.sort()" rearranges the shared object.

Solution: (allEvidence.slice()) or "([...allEvidence])" without arguments returns a new array object with the same element references so filtered- and allEvidence don't point to the same array anymore. Creates a shallow copy so the contents are still shared with independent odering.

### Q1

A reference is a pointer to a space in memory and there can be multible references to one object/value. A copy is "copies" the object or value and creates a seperate entity. The Demo 2 bug is because allEvidence and filteredEvidence want the same values but need to be seperate entities.

## Demo 3

Evidence Catalogue doesn't display anything. Endless loading spinner and filters don't change anything. Data loads, but it is not shown in the view. 

In state.js evidenceViewLoading is set to true and inspection shows it remains so troughout the lifecycle. State wasn't properly adjusted when evidenceLoading was resolved or rejected. To fix I adjusted loading state upon completion or failure of evidenceViewLoading. Setting evidenceViewLoading to "false" would let the view load but would render the flag obsolete and not provide propper loading feedback.

### Q1

The operation is fetch("data/evidence.json") in data-loading.js:53. It returns the evidence records. The fetch is either fulfilled or rejected a state evidenceViewLoading is supposed to represent. On start and while pending true and should flip to false when fulfilled (which it didn't) or rejected.

Confirmed:

Network tab shows evidence.json returning 200 with the full body so it's no load failure. data.length === 18 so the promise is fulfilled the data. Followed the callback -> evidenceViewLoading stays true indicating the failure to transition the state. 

## Demo 4

Changing the status filter in the evidence catalogue creates a "Uncaught ReferenceError: renderEvidenceList is not defined" error. However no visible bug can be observed.

Cause: app.js:36-37 -> two handlers on the same element. The EventListener uses the import from the module scope. Line 37 calls "renderEvidenceList()" which doesn't exist and therefore throws.

### Q1

Since there is no visible change in the UI I would not have spotted the bug if I hadn't the console window of my browser open. The app seems to work as intended so without the error there is no reason to suspect otherwise.

Just because something works doesn't mean it works as intended. Especially if something work on accident it always poses a threat for a bigger problem in the future if not aware of the problem. Also features we don't want still use resources even when we don't see them, if its a reoccurance can cause bigger issues. 

## Demo 5

### Bug 1

navigation.js:38 -> viewRenderd state is frozen at load time values. Removing "!viewRendered.dashboard" allows for rendering.

### Bug 2
Sorting evidence by age or title does not work. evidence-catalogue.js:169 handleSortChange sorts the filteredEvidence and calls renderEvidenceList() which -> builds new results array from allEvidence and overwrites the sorted array with it. Returns results which just contains the unsorted list which is rendered.

Solution: Split the sorting function and the rendering call, so the list is rendered after filtering. "handleSortChange()" is no longer responsible for sorting the results, it only calls "renderEvidenceList()" which calls "sortResults()". 
Sort now runs on the same array that gets rendered.

## Demo 7

### Q1

Different log levels. The console level filter shows or hides them separately, warn and error get an expandable stack trace, count towards the warning or error badge, log doesn't. Monitoring tools only collect warn and error.
In the app the levels are inconsistent, warn/error/log are used.

### Q2

evidence.json status 200 -> server found and returned the file. Type fetch -> requested by fetch(). Time -> total duration from request start to last byte.

404: fetch() doesn't reject on HTTP errors, it resolves with response.ok = false. App never checks res.ok and calls res.json() on the 404 error page -> SyntaxError -> promise rejects.

Different error handling troughout the app, console.log or error but no proper error handling/resolution.

### Q3

remotion_bookmarks -> array of bookmarked evidence ids
remotion_hypothesis -> hypothesis draft object
remotion_notes -> object evidenceId and its note text

invalid JSON:
- bookmarks -> app works, console.warn "Could not read stored bookmarks, starting empty". loadBookmarksFromStorage has try/catch and an Array.isArray check fallback to [].
- notes -> app doesn't load. loadNotesFromStorage calls JSON.parse without try/catch and runs in initApp before setupEventListeners and loadAllData -> uncaught SyntaxError stops startup, overlay stays.
- hypothesis -> only the workspace breaks.loadHypothesisFromStorage also parses without try/catch -> error after the bookmark and notes lists rendered, form isn't restored.

### Q4

Overlay shows first, case, people and locations load one after another, then evidence and timeline in parallel. handleHashChange also runs right after the core files, before evidence -> reloading on people renders every count as 0 and viewRendered keeps it that way.

Order matters because every render uses whatever state exists at that moment. Views that re-render when data arrives fix themselves, views that render once freeze the empty values, and a loading indicator that doesn't track every request says done while data is missing.

## Demo 8

### Globals

Top-level vars in the original app.js: allEvidence, filteredEvidence, selectedEvidence, bookmarks, currentPage, allPeople, allLocations, allTimeline, caseData, currentPeopleTab, loadingStepsRemaining, evidenceViewLoading, viewRendered, notesStore, modalCloseListenerCount, STORAGE_KEY_BOOKMARKS, STORAGE_KEY_NOTES, STORAGE_KEY_HYPOTHESIS

In a classic script every one of them is a property of window, shared with every other script on the page -> same name = same variable, last write wins, no error.

- currentPage -> generic name, another script doing "var currentPage = 1" overwrites it and "currentPage === 'evidence'" checks silently fail. Prevented by modules, it lives in state.js module scope and not on window.
- STORAGE_KEY_NOTES -> meant as a constant but was a reassignable global. Something assigning it would make the app read/write a different localStorage key and notes look lost. Prevented, now "export const", not global and not reassignable.
- bookmarks -> name collision prevented, but every module importing state.js can still push to it or call setBookmarks (evidence-catalogue.js does both). Not prevented yet, the split made the dependency visible.

### var -> let/const

Replaced all vars. const by default, let only if the binding is reassigned. Mutating an array/object is not reassignment.

let only for loop counters, html strings built with +=, counters, the matches flag in getFilteredEvidence, hash in handleHashChange, events in renderTimeline, modal in openEvidenceModal and latestSearchRequestId.

### Code smells

1. Notes rendered as HTML (evidence-detail.js, workspace.js). User text was concatenated into innerHTML, a note like <img src=x onerror="alert(1)"> runs every time it is shown and is stored in localStorage. Added escapeHtml() in lookup-utilities.js for the textarea, preview and workspace notes list, save preview uses textContent. Text now stays text.
2. Quick-view modal leaked listeners (timeline.js). The modal element is reused but every open added a new anonymous click listener -> 5 opens = 5 listeners, "Open full evidence" opened the detail 5 times. The console.log counter was debug code reporting the leak. Listener is now a named handleModalClick registered once when the modal is created, counter removed from state.js. 5 opens -> 1 listener, 1 open.
3. Write-only state. selectedEvidence and currentPeopleTab were set but never read anywhere. Removed the variables, setters and calls.

### Q1

var is function scoped and can be redeclared and reassigned. let is block scoped and can be reassigned, const is block scoped and can't be reassigned (but object contents can still change).

Bug from this app: the original nav button loop in app.js used "for (var i ...)" and read navButtons[i] inside the click callback. All callbacks share one i which is 5 when clicked -> navButtons[5] is undefined -> TypeError on every nav click. With let every iteration gets its own i and the callback reads the right button.

### Q2

In non-strict code assigning to an undeclared name ("count = 0" without let/const/var) silently creates a property on window, a new global. Modules are always strict -> the same line throws "ReferenceError: count is not defined" at the line of the mistake.

### Q3

The loop counters: renderTimeline used i, e, el, ev2, b and populateEvidenceDropdowns i, ti, p, l. It worked, but the names only existed because var is function scoped and reusing i would share one variable. A reader has to check each name for meaning and nobody sees at a glance which loop it belongs to -> slower review. With let every loop can use i.

Same for the write-only selectedEvidence/currentPeopleTab: nothing brokehad to search the whole app to find out they do nothing.

## Demo 9

### Nested chain

loadCorePeopleAndLocations (data-loading.js) was the deepest chain, 6 levels:

fetch case -> json -> fetch people -> json -> fetch locations -> json -> hideLoadingStep, renderDashboard, populateAllDropdowns

Each level only starts after the previous promise resolved, so the requests run one after another. It has no catch, a failure anywhere skips everything after it and rejects the promise loadAllData returns.

### Refactor

- loadCorePeopleAndLocations -> async function with one await per fetch and per json(), still sequential.
- loadEvidenceData -> .then/.catch became try/catch, same console.error, flag reset and alert.
- loadTimelineData -> .then/.catch/.finally became try/catch/finally, hideLoadingStep still runs in finally.
- loadAllData -> awaits the core files, then starts evidence and timeline without awaiting them, same as before

Left as they were: app.js initApp and handleSearchInput in evidence-catalogue.js.

Verified with a trace of fetch start/finish, renders, overlay, logs and alerts, before vs after. Identical for normal loading, evidence.json failing, timeline.json failing and people.json failing. Debugger check: breakpoint on the first await in loadCorePeopleAndLocations, step over each await with the Call Stack open.

### Q1

The nested version grows sideways, every step is one more callback inside the previous one, and the variables of each level are only visible inside it. To see what runs after people.json you have to count brackets, and whether an error is handled means following returns through 6 levels. The async version reads top to bottom in the same order it executes, and error handling is one visible try/catch.

### Q2

await pauses only the async function it is in until the promise settles, then continues it with the result (or throws the rejection). The function returns a promise to its caller at the first await. The rest of the program keeps running meanwhile: initApp returns, event handlers can run, the browser renders. The main thread isn't blocked.

### Q3

loadAllData() returns a Promise even though it has no return statement. loadAllData().then(v => console.log(v)) logs undefined, because the function resolves with its return value and it doesn't return one. An async function with "return 5" logs 5 in .then, not a Promise.

### Q4

try/catch around the await. Without it the rejection is thrown inside the async function, which rejects the promise it returned. If nobody handles that promise the browser reports "Uncaught (in promise)". In this app: people.json failing in loadCorePeopleAndLocations -> unhandled rejection, overlay stays and handleHashChange in app.js never runs because its .then has no catch.

### Q5

No. Same promises, same requests, same order, the trace is identical. Only the way the code is written changes. The requests are still sequential, only running them in parallel (Promise.all) would make loading faster.

### Q6

- Removed await from caseRes.json() -> caseJson is a Promise, setCaseData stores the Promise, no error. Dashboard shows the fallback title "Case" and status "UNKNOWN" because the Promise has no title or status.
- Removed await from fetch("data/case.json") -> caseRes is a Promise, caseRes.json() throws "caseRes.json is not a function" -> rejection, app stuck on the overlay.

Same category as loadNoteAsync in app.js: it returns a Promise that is logged directly, so the console shows "Promise {...}" instead of the note text. Also the Demo 5 people count: loadAllData doesn't wait for loadEvidenceData, so handleHashChange uses allEvidence before it exists.