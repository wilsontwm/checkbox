## Introduction

Checkbox is a monorepo setup that organizes the codebase into two main workspaces:

- `apps/*`
- `packages/*`

The `apps` directory contains the various applications, while the `packages` directory contains shared libraries and utilities used across the applications.

## Get Started

1. Clone the repository:

```bash
git clone https://github.com/wilsontwm/checkbox.git
cd checkbox
```

2. Install dependencies: We use pnpm as our package manager. If you don't have pnpm installed, you can install it globally using npm:

```bash
npm install -g pnpm
```

3. Install the dependencies

```bash
pnpm install
```

4. Setup the env variable by creating `.env` file at root level. The `.env.example` serves as a template for the `.env`

## How To

### Run the `api` application

1. Run the following command at root level:

```bash
pnpm api:dev
```

### Run the `console` aka Checkbox CLI

1. Run the following command at root level

```bash
pnpm cli
```

2. You will then be prompted options for the script (Currently only database migration)

```bash
? What do you want to do today? (Use arrow keys)
❯ Database Migration
```

3. Follow through the questions to execute your script / migrations

```bash
? What kind of migration do you want to do?
❯ Make new migration script
  Run migration scripts
```
