# Exercise 2

## Demo 1

Chose npm. More familiarity - already know and used it. Acording to the course manuscript there is little difference. Npm used with node -> lowest setup friction. pnpm reduces duplicated storage across projects. 

ran "npm init -y" -> creates package.json and adds initial entry

Dependency:
npm install --save-dev vite -> entries added to package-lock.json

### Questions:

#### Q1

Four concrete things, none of which manual copying gives you:

1. Package manager can handle transitive dependencies (dependencies that are dependend on other dependencies), they form a dependency graph by which the manager installs. -> Easier dependency management

2. Lockfile records versions and integrity info for the dependency tree. Permits version ranges. Lockfile good to maintain the graph and install on other machines.

3. Having a lockfile, with correct versions, configs and the source code, makes builds reproducible.

4. Package managers make executables from dependecies available. This way not every contributor needs seperate (e.g. vite) installation.

#### Q2

dependencies are required by the application at runtime while, devDependencies support development, checking, and building (supportive tools for development, not essetial for the application)

Vite, ESLint, Prettier and TypeScript are all devDependencies, because their code does not need to ship aas runtime libraries.

Frameworks -> dependencies(runtime)

#### Q3

Lockfile setts version ranges and records the exact resolved versions and integity info for the dependency tree.

without it:
collaborators get different trees. Each npm install re-resolves the ranges independently against what has been published since. Two devs on same commit can end up on different versions, the classic "works on my machine" except the difference is invisible because both `package.json` files are identical.

Also CI doesn't have the same graph. "npm ci" doens't work without it

#### Q4

pnpm uses a content-addressable store and links package files into projects, which reduces duplicated storage across projects. 
On a larger setup, across man* projects on one machine a package version is stored once globally and linked into each project instead of being copied into every "node_modules" 

This project is currently quite small with few dependencies/ only 1 repo, so no benefit from pnpm.

npm is normally installed together with Node.js and therefore has the lowest setup friction. pnpm is an extra install that every contributor and every CI runner must provision before anything else works.
Migrating is a big "bulky" process: choose a manager, commit its lockfile, document its commands, and use the same choice in CI. You can not alternate between managers because their lockfiles and installation layouts differ. replacing package-lock.json with pnpm-lock.yaml and updating everything that comes with migration.

## Demo 2

Installed vite -> moved assets and data to /public -> vite convention
Removed package.json placeholders

Task 2 -> all views intact no visible changes or errors

@lookup-utilites.js:22 adding: console.log("blabla"); -> reload
@styles.css:13 changing to  --color-critical: #2bc04b; -> no reload

### Questions:

#### Q1

A plain static server just maps URLs to files. Vite understands the module graph, resolves bare imports from installed packages, transforms TypeScript syntax, injects HMR support, and reports build-time diagnostics. Transforms happen on demand, source is served through the browser's own module system.

static server can't, injecti the HMR client. Vite adds `<script type="module" src="/@vite/client">` into index.html to opens a websocket

#### Q2

HMR replaces an affected module or reloads an appropriate boundary without performing a full page reload. Shortens feedback loops and preserves some runtime state.

styles.css -> style swapped in place/ no reload -> state rentained
lookup-utilities.js -> full page reload, app state lost

Vite marks CSS as self-accepting automatically.JS module is only self-accepting if it calls import.meta.hot.accept. None of the modules do so changes to the js files alwayys trigger full reload.

#### Q3

Vite serves application source through the browser's module system and uses index.html as entry point. ES modules give it the import statements/ the graph it needs.

From index.html it can flowwow the `<script type="module">` into src/ and ktherefore knows every module and who imports whom. That graph is what module resolution, on demand transforms, and HMR boundaries are built on.

Single `<script>` version -> no imports, no graph, one file. There is nothing to resolve per module, no boundaries, everything re runs on every change.

## Demo 3

""
$npm run build

> awe-exercise@1.0.0 build
> vite build

vite v8.3.0 building client environment for production...
✓ 16 modules transformed.
computing gzip size...
dist/index.html                 10.77 kB │ gzip: 2.77 kB
dist/assets/index-ZAWMSz9M.css  11.44 kB │ gzip: 2.77 kB
dist/assets/index-C7ySWQbp.js   22.19 kB │ gzip: 6.23 kB

✓ built in 176ms$
""

-->
dist/
  index.html
  assets/
    index-C8x2mL9a.js
    index-Dq91nR4p.css

<script type="module" crossorigin src="/assets/index-C7ySWQbp.js"></script>
<link rel="stylesheet" crossorigin href="/assets/index-ZAWMSz9M.css">

Public files are copied verbatim and get no hash, bc nothing imports them

Task 2:

npm run preview

> awe-exercise@1.0.0 preview
> vite preview

  ➜  Local:   http://localhost:4173/

"Development mode and production mode use different performance
and optimisation paths. A page that works through the dev server
can still fail after bundling because of base paths, asset URLs,
environment variables, or assumptions about module boundaries.
Always inspect and preview the production build." (Manifest 8.10)

Task 3:

dist\assets\index-C7ySWQbp.js -> is the bundled and minified version of all 12 js files. No imports -> already resolved and inlined.(12 js modules bundled & hashed -> index-C7ySWQbp.js 22,195 Bytes)

dist\assets\index-ZAWMSz9M.css -> whitespace and comments are stripped, formatted one liner (styles.css 15,355 Bytes, index-ZAWMSz9M.css 11,442 Bytes)

Minification -> comments gone, whitespace collapsed & minified syntax

### Questions

#### Q1

The build resolves the dependency graph, transforms modules, bundles code, minifies output, rewrites asset references, and commonly emits content-hashed filenames.

Transformations:

bundling -> the 12 src modules end up as one index-C7ySWQbp.js. No import statements left, already resolved and inlined.

minification -> styles.css 15,355 B -> 11,442 B. no comments no whitespace, one line

hashed filenames -> index-C7ySWQbp.js / index-ZAWMSz9M.css

asset references -> index.html points at the hashed names ->
`<script type="module" crossorigin src="/assets/index-C7ySWQbp.js">`

#### Q2

Content hash changes when file content changes. Servers can cache hashed assets for a long time because a changed asset receives a new URL. The HTML entry point typically receives shorter caching because it points to the current asset names (8.11)

with real deploys -> cache invalidation on deploy
without hash the file is always index.js -> browser keeps serving the old cached copy after a deploy -> users get stale code
with hash -> changed content = new filename = new URL -> browser has to fetch it. Unchanged files keep their URL and stay cached.

#### Q3

The development server is a tool, not the deployed application. Previewing development mode is also not the same as testing the production distribution (7.3).

Development favours fast feedback and readable diagnostics. Production favours compatibility, caching, and reduced transfer and processing cost (7.2).

dev server serves unbundled source on demand -> no bundling, no minification, no hashes -> many requests, bigger transfer, no long term caching. Also ships the HMR client + websocket, which has no purpose for a user.

## Demo 4

npm install --save-dev eslint @eslint/js globals prettier eslint-config-prettier -> linter with rules to disjoin prettier and eslint

added eslin.config.js

Added scripts to package.json:
"lint": "eslint .",
"lint:fix": "eslint . --fix",
"format": "prettier --write .",
"format:check": "prettier --check ."

""
npm run lint

> awe-exercise@1.0.0 lint
> eslint .


E:\Projects\AWE-Exercise\src\view\evidence-catalogue.js
    9:16  error  'filteredEvidence' is defined but never used  no-unused-vars
  209:35  error  'resolvedTerm' is defined but never used      no-unused-vars

✖ 2 problems (2 errors, 0 warnings)
""

--> removed both from evidence-catalogue.js

### Questions

#### Q1

A formatter decides how code is laid out. Whitespace, line wrapping, quote style, trailing commas, indentation. A linter analyses code patterns that may be erroneous, inconsistent, or difficult to maintain. For example unused variables, unreachable code, unsafe equality, floating Promises (9.1).

linter finding: 
filteredEvidence defined but never used 
resolvedTerm resolved but never used in evidence-catalogue.js. 
--> prettier formated both lines --> lint flagged the problems

after the format run the production build produced the exact same hashes as before (index-C7ySWQbp.js / index-ZAWMSz9M.css). After changing the linter problems -> rebuild -> new hash

#### Q2

CI should not silently rewrite source in a temporary runner and then report success. It should fail and require the corrected change to be committed -> quality gate behaviour from chapter 7 (§9.2, §7.4).

when you want the non fixing version: --> when you want to see what is wrong before changing code
the run must fail so the fix gets committed, not applied invisibly on the runner and thrown away

--fix does not fix everything -> no-unused-vars is not auto fixable because removing a binding could change behaviour. I had to hand remove -> lint:fix left them.

#### Q3

Each property in scripts maps a short project command to a tool command. npm run dev looks up dev and runs vite (§8.3).

So npm run lint looks up "lint" in package.json scripts and runs eslint.

Package managers temporarily make executables from local dependencies available to scripts, so contributors do not need a separate global installation (§8.3). 

only globally installed: the bare command might still resolve from the global PATH so it would look like it works, but the version is not the one in the lockfile, every contributor needs the same global install. CI has no globals at all, so global setup would fail there definetly.

## Demo 5

Task 1:

npm install --save-dev typescript -> added tsconfig.json, based on strict browser-oriented configuration (10.17)

strict:true -> Family of stronger checks including nullability and implicit-any analysis.

allowJs -> on, and it is NOT in the manuscript config. Needed because .js and .ts have to coexist during conversion. Without it tsc reports no inputs found

tsc --noEmit runs as a dedicated type checking step, because successful transformation does not mean the program is type correct (10.1)

Task 2:

notesStore -> {} (object with no known properties), notesStore[evidenceID] in storageHelpers.ts woudn't compile
"Element implicitly has an 'any' type because expression of type '"E01"'can't be used to index type '{}'"

storageHelpers.ts:38 needs || "" to satisfy the string return type.

allEvidence infers as any[], so allEvidence[i] is any and produces no error at al. HasId enables type check, either string id or null.

Task 3:

Added typecheck to scripts in package.json. Rearanged script order so that fast diagnostics checks run before the build.

## Questions

#### Q1

strict enables a family of stronger checks, including nullability and implicit-any analysis (10.17). It bundles 8 individual checks.

noImplicitAny -> a parameter or variable that cannot be inferred is an error instead of becoming any. 

strictNullChecks -> null and undefined are not silently accepted where another type is expected (10.8)

keep both, allowing any makes ts kinda pointless

#### Q2

compile time error is found by analysing the program before it runs and yields same result every time.
runtime bug -> only appears at runtime, code is valid but behaviour is wrong.

TypeScript is effective at detecting mismatched contracts, missing properties, invalid union members, unsafe null access, incorrect callback signatures, and many inconsistent refactorings....
TypeScript does not prove that a sorting algorithm is logically correct, that an event listener is registered the intended number of times, or that a network request arrives in the expected order (10.18)

Exercise 1 bugs:

Demo 4 bug -> "renderEvidenceList is not defined" , yes tsc catches missing names not found within current scope.

Demo 2 -> allEvidence and filteredEvidence sharing one reference, both are evidence and their types are identical. ts wouldn't flag it 

Demo 3 -> evidenceViewLoading never flipped to false. is a boolean either way.

#### Q3

any is contagious. Once a value becomes any, later property access, calls, and assignments are largely unchecked. Prefer unknown at uncertain boundaries and narrow it deliberately. Use any only as a local, temporary escape hatch with a clear reason (§10.7).

it does not just skip an error, it switches checking off for that value and everything reached through it.
e.g.: allEvidence comes from untyped state.js and infers as any[], so allEvidence[i].id produced no diagnostic at all.

if a value returns any every future caller looses checking too. So its faster now and much more work later.

## Demo 6