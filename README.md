# Separation of Concerns Migrator

A VS Code extension that helps you migrate your TypeScript/JavaScript files to follow separation of concerns patterns by automatically splitting functions, classes, types, and interfaces into separate files.

## Features

- **Automatic Code Splitting**: Split functions, classes, types, and interfaces into separate files
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
function formatDate(date: Date): string {
  return date.toISOString()
}

function validateEmail(email: string): boolean {
  return email.includes('@')
}

type User = {
  name: string
  email: string
}
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
