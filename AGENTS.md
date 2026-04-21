# AGENTS.md

This file provides guidance to agents when working with code in this repository.

## Project Overview (Critical)

Hawtio v5 custom console sample using `@hawtio/react`. Demonstrates how to package a custom console WAR that includes selected built-in plugins (JMX, Camel, etc.) plus custom TypeScript plugins. Built with Java/Maven (backend) and React/Webpack Module Federation (frontend).

## Build System (Non-Obvious)

- Maven builds BOTH Java WAR and TypeScript plugin via `frontend-maven-plugin`
- Frontend build happens during Maven lifecycle (not separate step)
- Skip frontend rebuild with `-Dskip.yarn` flag (saves time after first build)
- WAR final name is `sample-plugin` (not `hawtio-sample-custom-console`)
- Plugin TypeScript code lives in `sample-plugin/` subdirectory (not `src/`)

## Development Workflow (Critical)

- Dev mode requires TWO servers: `mvn jetty:run -Dskip.yarn` (backend) + `cd sample-plugin && yarn start` (frontend)
- Frontend dev server runs on port 3001, backend on 8080
- Access dev console at <http://localhost:3001/hawtio/> (NOT 8080)
- Connect plugin requires Jolokia endpoint: <http://localhost:8080/hawtio/jolokia>
- Branding URLs in dev mode are rewritten: `/sample-plugin/*` → `/hawtio/*` (see webpack.config.cjs line 138)

## Module Federation (Critical)

- Container name `samplePlugin` in webpack MUST match `scope()` in PluginContextListener.java
- Exposed module `./plugin` MUST match `module()` in PluginContextListener.java
- Plugin entry function name is `plugin` by default (can override with `pluginEntry()`)
- React, react-dom, react-router-dom, @hawtio/react MUST be singletons in shared config
- Version placeholder `__PACKAGE_VERSION_PLACEHOLDER__` replaced by `replace-version` script post-build

## Plugin Registration Pattern (Non-Standard)

- Plugins register via `hawtio.addPlugin()` not standard React Router
- `isActive` function controls plugin visibility (can check JMX tree with `workspace.treeContainsDomainAndProperties()`)
- Help and preferences registered separately via `helpRegistry.add()` and `preferencesRegistry.add()`
- Plugin branding configured via `configManager.configure()` in index.ts (not config file)

## Code Style (From Configs)

- Prettier: 120 char width, no semicolons, single quotes (including JSX)
- TypeScript: strict mode, noUncheckedIndexedAccess, noImplicitReturns enabled
- Indentation: 2 spaces (JS/TS), 4 spaces (Java)
- Module resolution: "bundler" (not "node")

## Testing

- Jest configured but tests pass with no tests (`--passWithNoTests`)
- No test files currently exist in codebase

## Project Boundaries

- **DO NOT** read nor modify `.env*` files without explicit permission
- **DO NOT** perform `git` commands without explicit permission
- **DO NOT** modify files outside `sample-plugin/` directory without explicit permission
- **DO NOT** change Module Federation config (container name, exposed modules) without updating both webpack.config.cjs AND PluginContextListener.java
- **DO NOT** modify Maven build lifecycle or frontend-maven-plugin configuration
- **DO NOT** change port numbers (3001 for dev frontend, 8080 for backend) as they're hardcoded in multiple places
- **DO NOT** add dependencies without checking Module Federation shared config compatibility
