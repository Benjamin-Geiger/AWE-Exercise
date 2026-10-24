# Exercise 5 — React Interactivity, State & Reactive Programming

This is the fifth exercise in Advanced Web Engineering Course (CSDC). It builds on Exercises 3 and
4. This exercise builds and fully wires up the **final two views: Evidence Catalogue and Workspace**, the two most state-heavy parts of the app (search, multiple filters, sorting, bookmarking, notes, and
the hypothesis form).

This exercise is, on purpose, a chance to solve several problems you already fixed *imperatively* back in Exercise 1: a dashboard count that could go stale, state that was represented in two places at once, and derived data that got confused with stored data.
Where relevant, the theory questions below ask you to explicitly compare your React solution to how you patched the same category of problem in vanilla JS.

**Out of scope for this exercise** (these come later): `useEffect`/data fetching (Exercise 6), a real backend, automated tests. 

## Corresponding manuscript reading

This exercise corresponds to **Chapter 17, React State, Interactivity, and Reactive Data Flow** in the course manuscript, especially "Responding to events" through "Common state-design problems" on pp. 115–123. The chapter transition and summary follow on pp. 124–125.

## Self-Check

The exercise is organized into 10 individual tasks with corresponding questions, that are
presented in class. 

These checkboxes are for self-checking. Don't forget to do the actual checking of tasks you are able to present in the Moodle course. **Before class, tick only what you can genuinely demonstrate or answer on the spot, live.**

| # | Demo | Ready? |
|---|---|---|
| 1 | Migrate event handling from vanilla listeners | ☐ |
| 2 | `useState` & controlled forms | ☐ |
| 3 | Immutable updates | ☐ |
| 4 | Derived values vs. stored state | ☐ |
| 5 | Lifting state to the nearest common owner | ☐ |
| 6 | Passing callbacks downward | ☐ |
| 7 | `useReducer` for the filter/search/sort state | ☐ |
| 8 | Context, and when not to use it | ☐ |
| 9 | Diagnose & fix common state problems | ☐ |
| 10 | Remove remaining direct DOM manipulation + wrap-up | ☐ |

---

## Demo 1 — Migrate event handling from vanilla listeners

**Tasks**

- [ ] Build the Evidence Catalogue and Workspace views' static structure in React (cards, the filter toolbar, the notes list, the hypothesis form) if you haven't already, then migrate at least 3 real event handlers from the vanilla version (e.g. bookmark click, search input, save-note click) into React event handlers (`onClick`, `onChange`, `onSubmit`, etc.).
- [ ] For each one, confirm the vanilla version's inline `onclick` attribute or manually-attached `addEventListener` is gone. React should own the event, not the DOM.

**Questions** (depend on the tasks above)

- [ ] How do you attach a click handler to a button in React versus how the vanilla version did it (inline `onclick="..."` in the HTML string, or `addEventListener` in JS)? What actually receives the event object in each approach, and is it the same kind of object?
- [ ] The vanilla version's evidence-list click handling used event delegation (one listener on the container, checking `event.target`) partly to work around listeners being re-registered on
every render. Do you still need that pattern in React? Why or why not?

---

## Demo 2 — `useState` & controlled forms

**Tasks**

- [ ] Make the Evidence search box a controlled input (`value` + `onChange` backed by `useState`).
- [ ] Make the entire hypothesis form (suspect select, nature select, evidence multi-select,
confidence range, explanation and alternative textareas) fully controlled.
- [ ] Wire the "Save hypothesis draft" action to read from your controlled state and persist it (still to `localStorage` for now).

**Questions** (depend on the tasks above)

- [ ] What makes an input "controlled" versus "uncontrolled" in React? Show what happens if you try to type in one of your controlled inputs without wiring its `onChange` and explain, in terms of React's render cycle, *why* that happens.
- [ ] The hypothesis form has several different input types (select, multi-select, range, textarea). Did you use one `useState` per field, or a single object? Justify your choice — and note this question again once you get to Demo 7 (`useReducer`), which asks you to reconsider it for a different form.

---

## Demo 3 — Immutable updates

**Tasks**

- [ ] Find at least one place where your first instinct (or an early draft) would have mutated state directly (e.g. `evidence.bookmarked = true`, or pushing directly into a state array), and rewrite it as an immutable update.
- [ ] Add a case to your bookmark toggle logic that specifically exercises this: toggling a bookmark must produce a *new* array/object, not a mutated one.

**Questions** (depend on the tasks above)

- [ ] Why does mutating state directly in React sometimes still appear to "work" on screen, but
cause real (possibly hard-to-track) bugs elsewhere? What is React actually comparing when it decides whether to re-render?
- [ ] The original vanilla app had a real bug where sorting evidence mutated the master array via a shared reference, permanently losing the original order. Show how your React state update for the equivalent action (bookmark toggle, or sort, if you implement it) avoids that exact class of bug. Be specific about what's different, not just "React handles it."

---

## Demo 4 — Derived values vs. stored state

**Tasks**

- [ ] Implement the Evidence Catalogue's filtering/sorting so that the *filtered, sorted list is computed from* the full evidence list and the current filter/sort state, every render. Never stored as its own separate piece of state that could drift out of sync.
- [ ] Do the same for the Dashboard's bookmark count and the Workspace's bookmarked-items list: both should be derived from the same single source of truth for bookmarks, not duplicated state.

**Questions** (depend on the tasks above)

- [ ] What's the rule for deciding whether something belongs in `useState` versus being computed inline (or via `useMemo`) during render? Apply that rule to the filtered evidence list and justify your answer.
- [ ] The vanilla app had two related bugs here: a dashboard bookmark count that could go stale (because it only re-rendered on a view's first visit), and a `filteredEvidence` variable that was sometimes literally the *same array reference* as the master list. Explain, concretely, why deriving these values during render instead of storing them makes **both** of those bug classes structurally impossible, not just less likely.

---

## Demo 5 — Lifting state to the nearest common owner

**Tasks**

- [ ] Identify the lowest common ancestor component of everywhere bookmark state needs to be read or changed (at minimum: an Evidence card's bookmark button, the Dashboard's bookmark count, and the Workspace's bookmarked-items list), and move the actual `useState` for bookmarks up to live there.
- [ ] Confirm that toggling a bookmark from the Evidence view is immediately reflected on the
Dashboard the next time it's rendered.

**Questions** (depend on the tasks above)

- [ ] What does "lifting state up" actually mean, mechanically? Walk through where the bookmark state lived before you lifted it, and where it lives now.
- [ ] What would go wrong (be specific) if you had instead kept a separate `useState` for bookmarks inside each of the Dashboard, Evidence, and Workspace components?

---

## Demo 6 — Passing callbacks downward

**Tasks**

- [ ] From wherever you lifted bookmark state to (Demo 5), pass a callback (e.g. `onToggleBookmark`) down through props to every component that needs to trigger a change, rather than letting child components reach up and mutate anything themselves.
- [ ] Do the same for at least one more interaction that needs to affect state owned by a parent (e.g. saving a note, or changing evidence review status from the detail view).

**Questions** (depend on the tasks above)

- [ ] Why can't (or shouldn't) a deeply nested child component just directly modify state that lives in a distant ancestor? What does passing a callback down get you instead?
- [ ] Trace one callback all the way from where it's defined (with the actual `useState` setter
inside it) down to the component that calls it. How many component layers does it pass through, and does that feel like "too many". Is prop drilling becoming a real problem here?

---

## Demo 7 — `useReducer` for the filter/search/sort state

**Tasks**

- [ ] Identify the Evidence Catalogue's combined filter state (search term, type, person, location, status, relevance, and sort order — 7+ related values that often change together or need to be reset together) as a single non-trivial state domain, and replace its `useState` calls with a single `useReducer`.
- [ ] Implement at least 3 distinct action types (e.g. `SET_FILTER`, `SET_SORT`, `CLEAR_FILTERS`).

**Questions** (depend on the tasks above)

- [ ] Why is this particular piece of state ("evidence filters") a better fit for `useReducer` than for a pile of individual `useState` calls? What specifically got easier once you switched?
- [ ] Show your `CLEAR_FILTERS` action. How does a reducer make "reset several related values at once, consistently" easier to get right than resetting them individually?
- [ ] Is `useReducer` fundamentally different from `useState`, or is `useState` essentially a
special case of the same underlying idea? Justify your answer.

---

## Demo 8 — Context, and when not to use it

**Tasks**

- [ ] Pick one piece of state from this exercise (bookmark state is a strong candidate, given Demo 6's prop-drilling question) and actually implement it via React Context, replacing the prop-drilled version.
- [ ] Explain a short, honest decision: for *this specific app*, at its *current* size, is Context actually the right call for this state, or is prop-drilling (or lifting state, without
Context) good enough? Be ready to defend whichever answer you land on.

**Questions** (depend on the tasks above)

- [ ] What problem does Context actually solve? What does it *not* solve (people sometimes expect it to behave like global state management. Where does that expectation break down)?
- [ ] Revisit Demo 6's callback-depth question. Was prop drilling there actually a real problem
(annoying, error-prone, worth solving) or a manageable one? What's your threshold for reaching for Context instead of just drilling one more level?
- [ ] "Unnecessary global state" is explicitly named as a common problem. Could using Context here be an example of that, even though Context isn't technically the same as a global variable?

---

## Demo 9 — Diagnose & fix common state problems

**Tasks**

- [ ] Review your own Evidence/Workspace/Dashboard code specifically for: duplicated state (the same fact represented in two places), stale state (a value that doesn't update when it should), excessive prop drilling, unnecessary global state, and any remaining direct mutation.
- [ ] Find and fix at least 2 real instances (they can be ones you introduced yourself while
building this exercise, that's normal and expected, not a failure).

**Questions** (depend on the tasks above)

- [ ] For each of the 2 issues you fixed: which of the five named categories did it fall into, and how did you notice it (a visible bug, a code-review-style re-read, React DevTools, something else)?
- [ ] Of the five named problems (duplicated state, stale state, prop drilling, unnecessary global state, mutation), which one is this app's history (Exercise 1's bugs) most clearly an example of? Explain the connection directly.

---

## Demo 10 — Remove remaining direct DOM manipulation + wrap-up

**Tasks**

- [ ] Do a final sweep of the Evidence Catalogue and Workspace views (and re-check Dashboard/People & Locations/Timeline from Exercises 3–4) for any remaining direct DOM manipulation, e.g. `document.querySelector`, manual `classList` changes, `innerHTML`, anything not going through React's render, and remove it.
- [ ] Confirm the whole app (all 5 views) now runs entirely on React state and props, with zero manual DOM manipulation anywhere.

**Questions** (depend on the tasks above)

- [ ] Show one state-management decision you made somewhere in this exercise (state ownership, `useState` vs. `useReducer`, prop drilling vs. Context, or something else) that you're not 100% sure was the right call. Explain the trade-off honestly, both directions.
- [ ] Across Exercises 3–5, name one bug category from the *original* vanilla app (Exercise 1's defect list) that is now, by construction, no longer possible in your React version — not just fixed, but structurally prevented. Explain why the React architecture rules it out.

---
