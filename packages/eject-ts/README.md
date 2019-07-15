# eject-ts

`eject-ts` package is a CLI tool exposing single `eject-ts` command that can eject package written in TypeScript,
by converting it into JavaScript while preserving its original formatting. It also replaces imports with the ejected folder path and installs ejected package dependencies into the project where it's ejecting.

## Installation

With npm:

```bash
npm install --save-dev eject-ts
```

or with yarn:

```bash
yarn add --dev eject-ts
```

## Usage

```bash
npx eject-ts @deity/falcon-ecommerce-uikit src/uikit
```

Executing command above will eject `@deity/falcon-ecommerce-uikit` package into `src/uikit` directory.
