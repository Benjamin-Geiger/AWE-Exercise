# Architecture

App components are organised by feature as recommended by the manuscript.
The old app is still in controller and view.

## Two separate dimensions

Where does a file belong? -> app/ feature folder/ or shared/
feature compontent -> knows use case, choosed data or coordinates routing
presentational component -> choosed design/layout -> what gets rendered

not every presentational component is shared -> e.g PersonCard presentational but is feature specific

## shared vs feature-local

component is feature-local, when it belongs to one feature
e.g PersonCard, LocationCard -> both only relevant for People-Locations Page
features do not import from each other

shared only if it has reusable content not tied to a feature e.g badge


Panel and MiniListItem currently only used by dashboard but will be shared later in the migration.
