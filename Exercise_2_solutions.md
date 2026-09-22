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
