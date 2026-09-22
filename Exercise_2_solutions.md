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