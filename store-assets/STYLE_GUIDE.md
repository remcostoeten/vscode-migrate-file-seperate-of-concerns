# Design Style Guide
## Separation of Concerns Migrator - VS Code Extension

---

## 🎨 Brand Identity

### Mission Statement
"Simplify code organization with intelligent separation of concerns - making complex codebases maintainable through one-click migration."

### Brand Personality
- **Professional**: Enterprise-ready, VS Code marketplace quality
- **Intelligent**: Smart parsing and dependency management  
- **Efficient**: Fast, one-click solutions
- **Developer-focused**: Built for developers, by developers

---

## 🎨 Color Palette

### Primary Colors
```css
/* Primary Brand Gradient */
--primary-start: #4A90E2;  /* Professional Blue */
--primary-end: #357ABD;    /* Deeper Blue */

/* CSS Gradient */
background: linear-gradient(135deg, #4A90E2 0%, #357ABD 100%);
```

### Secondary Colors
```css
/* Success/Action */
--success-color: #28A745;     /* VS Code green */
--success-light: #34CE57;
--success-dark: #1E7E34;

/* Error/Warning */
--error-color: #DC3545;       /* VS Code red */
--error-light: #E85563;
--error-dark: #A71E2A;

/* Information */
--info-color: #007ACC;        /* VS Code blue */
--info-light: #1A8FD9;
--info-dark: #005999;
```

### Neutral Colors
```css
/* Light Theme */
--bg-light: #FFFFFF;
--text-light: #24292E;        /* GitHub dark text */
--text-secondary-light: #586069;
--border-light: #E1E4E8;

/* Dark Theme */
--bg-dark: #1E1E1E;          /* VS Code dark bg */
--text-dark: #CCCCCC;        /* VS Code light text */
--text-secondary-dark: #969696;
--border-dark: #404040;
```

### VS Code Integration Colors
```css
/* Activity Bar */
--vscode-activityBar-background: #333333;
--vscode-activityBar-foreground: #FFFFFF;

/* Explorer */
--vscode-sideBar-background: #252526;
--vscode-list-activeSelectionBackground: #094771;
--vscode-list-hoverBackground: #2A2D2E;

/* Editor */
--vscode-editor-background: #1E1E1E;
--vscode-editor-foreground: #D4D4D4;
```

---

## 📝 Typography

### Font Stack
```css
/* Primary Font Family */
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 
             'Roboto', 'Helvetica Neue', Arial, sans-serif;

/* Code Font Family */
font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Fira Code', 
             'Consolas', 'Courier New', monospace;
```

### Type Scale
```css
/* Headers */
--font-size-h1: 2.5rem;      /* 40px - Hero titles */
--font-size-h2: 2rem;        /* 32px - Section titles */
--font-size-h3: 1.5rem;      /* 24px - Subsections */
--font-size-h4: 1.25rem;     /* 20px - Feature titles */

/* Body Text */
--font-size-large: 1.125rem; /* 18px - Lead text */
--font-size-body: 1rem;      /* 16px - Body text */
--font-size-small: 0.875rem; /* 14px - Captions */
--font-size-tiny: 0.75rem;   /* 12px - Labels */

/* Code */
--font-size-code: 0.875rem;  /* 14px - Inline code */
--font-size-code-block: 0.8125rem; /* 13px - Code blocks */
```

### Font Weights
```css
--font-weight-light: 300;
--font-weight-regular: 400;
--font-weight-medium: 500;
--font-weight-semibold: 600;
--font-weight-bold: 700;
```

---

## 📐 Layout & Spacing

### Grid System
```css
/* Container Sizes */
--container-xs: 480px;
--container-sm: 768px;
--container-md: 1024px;
--container-lg: 1280px;
--container-xl: 1440px;

/* Spacing Scale (4px base unit) */
--space-1: 0.25rem;  /* 4px */
--space-2: 0.5rem;   /* 8px */
--space-3: 0.75rem;  /* 12px */
--space-4: 1rem;     /* 16px */
--space-5: 1.25rem;  /* 20px */
--space-6: 1.5rem;   /* 24px */
--space-8: 2rem;     /* 32px */
--space-10: 2.5rem;  /* 40px */
--space-12: 3rem;    /* 48px */
--space-16: 4rem;    /* 64px */
--space-20: 5rem;    /* 80px */
```

### Border Radius
```css
--radius-sm: 3px;    /* VS Code buttons */
--radius-md: 6px;    /* Cards, panels */
--radius-lg: 8px;    /* Large cards */
--radius-xl: 12px;   /* Hero sections */
--radius-full: 9999px; /* Pills, badges */
```

### Shadows
```css
--shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
--shadow-md: 0 4px 6px rgba(0, 0, 0, 0.07);
--shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);
--shadow-xl: 0 20px 25px rgba(0, 0, 0, 0.1);
```

---

## 🖼️ Iconography

### Icon Style Guidelines
- **Style**: Linear, 2px stroke weight
- **Size**: 16px, 24px, 32px, 48px grid-based
- **Color**: Match text color or use brand colors
- **Metaphors**: 
  - File transformation (source → multiple files)
  - Code organization (brackets, arrows)
  - VS Code integration (sidebar, explorer)

### Icon Library
- **File Icons**: 📄 Document, 📁 Folder, 🗂️ Organization
- **Action Icons**: ➡️ Transform, ✅ Success, ⚡ Fast
- **Code Icons**: {} Brackets, 📦 Export, 🔗 Import
- **VS Code Icons**: Match editor theme icons

---

## 📱 Component Patterns

### Buttons
```css
/* Primary Button */
.btn-primary {
  background: linear-gradient(135deg, #4A90E2 0%, #357ABD 100%);
  color: white;
  border: none;
  border-radius: var(--radius-md);
  padding: var(--space-3) var(--space-6);
  font-weight: var(--font-weight-medium);
}

/* Secondary Button */
.btn-secondary {
  background: transparent;
  color: var(--primary-start);
  border: 1px solid var(--primary-start);
  border-radius: var(--radius-md);
  padding: var(--space-3) var(--space-6);
}
```

### Cards
```css
.card {
  background: var(--bg-light);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-lg);
  padding: var(--space-6);
  box-shadow: var(--shadow-sm);
  transition: box-shadow 0.2s ease;
}

.card:hover {
  box-shadow: var(--shadow-md);
}
```

### Code Blocks
```css
.code-block {
  background: #1E1E1E;
  color: #D4D4D4;
  border-radius: var(--radius-md);
  padding: var(--space-4);
  font-family: var(--font-family-mono);
  font-size: var(--font-size-code-block);
  overflow-x: auto;
}
```

---

## 📸 Image Guidelines

### Screenshot Standards
- **Resolution**: 1366×768 minimum (laptop standard)
- **Theme**: Both light and dark VS Code themes
- **Quality**: PNG format, optimized
- **Framing**: Include VS Code window chrome
- **Content**: Real, meaningful code examples

### Social Media Images
- **Twitter**: 1600×900 (16:9 aspect ratio)
- **LinkedIn**: 1200×627 (1.91:1 aspect ratio)
- **Dev.to**: 1000×420 (2.38:1 aspect ratio)
- **OpenGraph**: 1200×630 (1.91:1 aspect ratio)

### Logo Usage
- **Minimum size**: 16px height
- **Clear space**: Half the logo height on all sides
- **Backgrounds**: Use on light backgrounds primarily
- **Variations**: Full color, monochrome white, monochrome dark

---

## 🎬 Animation Guidelines

### Timing Functions
```css
--ease-in: cubic-bezier(0.4, 0, 1, 1);
--ease-out: cubic-bezier(0, 0, 0.2, 1);
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
```

### Duration Standards
- **Quick**: 150ms (hover states)
- **Standard**: 300ms (transitions)
- **Slow**: 500ms (complex animations)

### GIF Guidelines
- **Duration**: 10-15 seconds max
- **Size**: ≤4MB for VS Code Marketplace
- **Frame rate**: 10-15 FPS (optimized)
- **Loop**: Seamless infinite loop

---

## ♿ Accessibility Standards

### Color Contrast
- **Normal text**: 4.5:1 minimum (WCAG AA)
- **Large text**: 3:1 minimum (WCAG AA)
- **Interactive elements**: 3:1 minimum

### Focus States
```css
.focusable:focus {
  outline: 2px solid var(--info-color);
  outline-offset: 2px;
}
```

### Alt Text Guidelines
- **Screenshots**: Describe the interface and action
- **Diagrams**: Explain the process or relationship
- **Decorative**: Use empty alt="" or mark as decorative

---

## 🔧 Asset Optimization

### Image Formats
- **PNG**: Screenshots, UI elements with transparency
- **SVG**: Icons, logos, simple illustrations
- **JPEG**: Photographs, complex images
- **WebP**: Modern browsers, smaller file sizes

### Optimization Targets
- **PNG**: 8-bit indexed when possible
- **SVG**: Minified, optimized paths
- **Total size**: ≤10MB for all assets combined

### File Naming
```
[category]-[type]-[variant].[format]

Examples:
marketplace-screenshot-before-light.png
social-twitter-card-launch.png
docs-export-patterns-cheatsheet-dark.png
```

---

## 📋 Brand Voice & Messaging

### Tone of Voice
- **Professional**: Enterprise-ready quality
- **Clear**: No jargon, direct communication
- **Helpful**: Problem-solving focused
- **Confident**: Expertise without arrogance

### Key Messages
1. **One-click code organization** - Simplify complex refactoring
2. **Smart dependency management** - Preserves imports and relationships
3. **VS Code integration** - Native, seamless experience
4. **Developer productivity** - Save time on manual work

### Taglines
- Primary: "One-click separation of concerns"
- Secondary: "Intelligent code organization for VS Code"
- Technical: "Automated TypeScript/JavaScript refactoring"

---

## ✅ Quality Checklist

### Before Publishing Any Asset:
- [ ] Colors match brand palette
- [ ] Typography follows scale and weights
- [ ] Spacing uses 4px grid system  
- [ ] Contrast meets WCAG AA standards
- [ ] File size optimized
- [ ] File name follows convention
- [ ] Both light/dark variants created (where applicable)
- [ ] Alt text provided
- [ ] Tested in actual VS Code interface

### Asset-Specific Checks:
- [ ] **Screenshots**: Real code, proper window chrome
- [ ] **Social**: Platform-specific dimensions
- [ ] **Documentation**: Clear, informative visuals
- [ ] **Marketing**: Compelling, brand-consistent
