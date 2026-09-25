# AGENTS.md

Guidelines for AI coding agents working on this repository.

## Project Info

- Language: TypeScript + React (frontend), Java (backend)
- Build tools: Webpack & Module Federation (frontend), Maven (backend + frontend via `frontend-maven-plugin`)
- Package manager: Yarn v4+
- UI framework: PatternFly v6
- Key dependencies: React, @hawtio/react, @hawtio/ai-plugin
- Linter/Formatter: ESLint, Prettier (120 char width, no semicolons, single quotes)
- Commit style: Conventional Commits (`feat:`, `fix:`, `chore:`, etc.)

## Project Structure

```text
.
├── console/                 # Hawtio custom console subproject (frontend)
│   ├── src/
│   │   ├── bootstrap.tsx    # Asynchronous bootstrap for Module Federation: registers plugins, calls hawtio's bootstrap
│   │   ├── index.ts         # Entry point (dynamic import of bootstrap.tsx)
│   │   └── sample-plugin/   # Sample builtin plugin (simple, custom-tree, and app-jmx views)
│   ├── webpack.config.cjs   # Webpack config (dev server, Module Federation host)
│   └── package.json
└── src/                     # Java backend for Hawtio custom console (WAR packaging)
```

## Documentation Index

Read these documents **only when the task requires it** — do not load them all upfront.

| Document | When to read |
| -------- | ------------ |
| [`README.md`](README.md) | Project overview, prerequisites, setup guide |

## Essential Commands

```bash
# First build (installs frontend deps and builds WAR)
mvn install

# Backend only (skip frontend rebuild after first build)
mvn jetty:run -Dskip.yarn

# Frontend dev server (run alongside backend)
cd console && yarn install && yarn start
```

Dev console is at <http://localhost:3001/hawtio/> (frontend dev server, **not** 8080).
Connect plugin requires Jolokia endpoint: <http://localhost:8080/hawtio/jolokia>.

## Coding Style

- **Formatter**: Prettier — `printWidth: 120`, no semicolons, single quotes (including JSX), trailing commas, `arrowParens: 'avoid'`
- **TypeScript**: strict mode enabled; `noImplicitReturns`, `noUncheckedIndexedAccess` — avoid `any`, use explicit return types on exported functions
- **React components**: functional components with `React.FunctionComponent` or inferred return type; JSX uses single quotes
- **Imports**: group and order — React first, then third-party, then local; no unused imports
- **Naming**: PascalCase for components and types, camelCase for variables and functions, kebab-case for file names
