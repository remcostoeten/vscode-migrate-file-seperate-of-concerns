# Separation of Concerns Migrator

A VS Code extension that helps you migrate your TypeScript/JavaScript files to follow separation of concerns patterns by automatically splitting functions, classes, types, and interfaces into separate files.

## Features

- **Export-Only Processing**: Only processes exported functions - keeps internal helpers private
- **Multiple Export Patterns**: Supports all TypeScript/JavaScript export patterns:
  - Direct exports: `export function foo()`
  - Export const: `export const bar = ()`
  - Default exports: `export default function baz()`
  - Bottom exports: `export { foo, bar }`
- **Smart Import Management**: Automatically manages imports and dependencies
- **Type Preservation**: Maintains TypeScript types and interfaces during migration
- **Babel-powered Parsing**: Uses Babel AST for accurate code analysis
- **Fast Performance**: Built with esbuild for optimal bundle size and speed

## Usage

1. Right-click on any TypeScript or JavaScript file in the VS Code Explorer
2. Select "Migrate to Separation of Concerns" from the context menu
3. The extension will automatically:
   - Create a new folder with the same name as your file
   - Split each function/class/type into separate files
   - Generate an index.ts file with all exports
   - Maintain proper TypeScript typing

## Example

**Before** (`utils.ts`):
```typescript
// This private function won't be processed
function privateHelper(str: string) {
  return str.trim()
}

// These exported functions will be processed
export function formatDate(date: Date): string {
  return date.toISOString()
}

export const validateEmail = (email: string): boolean => {
  return email.includes('@')
}

export default function createUser(name: string, email: string) {
  return { name: privateHelper(name), email }
}

// Bottom exports
function hashValue(value: string) { return btoa(value) }
function generateId() { return Math.random() }

export { hashValue, generateId }
```

**After** (creates `utils/` folder with):
- `utils/format-date.ts`
- `utils/validate-email.ts` 
- `utils/user.ts`
- `utils/index.ts` (with exports)

## Development

This extension is built with:
- **esbuild** for fast bundling
- **TypeScript** for type safety
- **Babel Parser** for AST analysis
- **Modern VS Code Extension APIs**

## License

MIT
