# Change Log

All notable changes to the "Separation of Concerns Migrator" extension will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [0.0.1] - 2025-01-02

### Added
- 🎉 Initial release of Separation of Concerns Migrator
- ✨ Export-only processing - only processes exported functions, classes, types, and interfaces
- 🔄 Support for multiple export patterns:
  - Direct exports: `export function foo()`
  - Export const: `export const bar = ()`
  - Default exports: `export default function baz()`
  - Bottom exports: `export { foo, bar }`
- 🎯 Smart dependency analysis and import management
- 📁 Automatic folder and file generation with proper naming conventions
- 📄 Auto-generated index.ts files with re-exports
- ⚡ Fast performance with esbuild bundling
- 🎨 Professional icon and marketplace assets
- 🔧 Built with modern TypeScript and Babel AST parsing
- 📚 Comprehensive documentation and examples

### Technical Details
- Uses Babel parser for accurate AST analysis
- Built with esbuild for optimal bundle size (316KB)
- Supports TypeScript and JavaScript files
- Maintains type safety and proper export patterns
- Right-click context menu integration
- VS Code 1.74.0+ compatibility
