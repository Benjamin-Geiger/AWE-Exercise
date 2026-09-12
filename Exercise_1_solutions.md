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

