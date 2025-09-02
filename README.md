# Separation of Concerns Migrator

A VS Code extension that automatically splits TypeScript/JavaScript files into separate files following separation of concerns principles.

## Features

- Processes only exported functions, classes, types, and interfaces
- Supports all export patterns (direct, const, default, bottom exports)
- Automatically manages imports and dependencies
- Maintains TypeScript types and interfaces
- Includes non-exported types used by exported functions
- Creates kebab-case file names

## Usage

1. Right-click on a TypeScript or JavaScript file in VS Code Explorer
2. Select "Migrate to Separation of Concerns"
3. The extension creates a folder with separate files for each exported item

## Example

**Before** (`utils.ts`):
```typescript
type User = {
  id: number
  name: string
}

const API_URL = 'https://api.com'

export function getUser(id: number): User {
  return fetch(`${API_URL}/users/${id}`).then(r => r.json())
}

export function validateUser(user: User): boolean {
  return user.name.length > 0
}
```

**After** (creates `utils/` folder):
- `utils/get-user.ts` (includes User type and API_URL)
- `utils/validate-user.ts` (includes User type) 
- `utils/index.ts` (exports both functions)
