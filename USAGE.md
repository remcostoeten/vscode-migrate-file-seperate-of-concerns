# Usage Guide

## How to Use the Separation of Concerns Migrator

### 1. Installation
Install the extension from the VS Code marketplace or use the `.vsix` file:
```bash
code --install-extension separation-of-concerns-0.0.1.vsix
```

### 2. Basic Usage
1. **Right-click** on any TypeScript or JavaScript file in the VS Code Explorer
2. Select **"Migrate to Separation of Concerns"** from the context menu
3. The extension will automatically create a new folder and separate files

### 3. What Gets Processed
The extension **only processes exported** functions, classes, types, and interfaces:

✅ **Will be processed:**
```typescript
export function validateEmail() { /* ... */ }
export const formatName = () => { /* ... */ }
export default function createUser() { /* ... */ }
function helper() { /* ... */ }
export { helper }
```

❌ **Will be ignored:**
```typescript
function internalHelper() { /* ... */ }  // Not exported
const privateFunction = () => { /* ... */ }  // Not exported
```

### 4. Example Transformation

**Before:** `utils.ts`
```typescript
// This won't be processed (not exported)
function internalHelper(str: string) {
  return str.trim().toLowerCase()
}

// These will be processed
export function validateEmail(email: string): boolean {
  return email.includes('@')
}

export const formatUserName = (first: string, last: string) => {
  return `${first} ${last}`.trim()
}

export default function createUser(email: string, name: string) {
  return {
    id: Math.random(),
    email: internalHelper(email),
    name: formatUserName(...name.split(' '))
  }
}

function hashPassword(password: string) {
  return btoa(password)
}

export { hashPassword }
```

**After:** Creates `utils/` folder with:
- `utils/validate-email.ts`
- `utils/format-user-name.ts` 
- `utils/create-user.ts` (default export)
- `utils/hash-password.ts`
- `utils/index.ts` (with all exports)

### 5. File Naming Convention
- Functions are converted to kebab-case: `validateEmail` → `validate-email.ts`
- Default exports become: `default.ts`
- File extensions are preserved (`.ts` or `.js`)

### 6. Export Patterns Supported
- `export function name() {}`
- `export const name = () => {}`
- `export default function() {}`
- `export { name1, name2 }`
- Mixed patterns in the same file

### 7. What Happens to Dependencies
- Import statements are analyzed and included where needed
- Internal references between functions are maintained
- TypeScript types are preserved

### 8. Best Practices
- Use on files with multiple exported functions
- Ensure your code is saved before running the migration
- Review the generated files to ensure everything looks correct
- The original file remains unchanged - you can delete it manually if needed

### 9. Troubleshooting
- Make sure the file contains exported functions/classes/types
- Check that the file is valid TypeScript/JavaScript
- Ensure you have write permissions in the directory
- Look for success/error messages in VS Code's notification area
