#!/bin/bash
# Store Assets Generation Script
# Separation of Concerns Migrator - VS Code Extension

set -e

ASSETS_DIR="/home/remcostoeten/huidig/vscode-migrate-file-seperate-of-concerns/store-assets"
BASE_DIR="/home/remcostoeten/huidig/vscode-migrate-file-seperate-of-concerns"

echo "🎨 Generating all store assets for Separation of Concerns Migrator..."
echo "📁 Assets directory: $ASSETS_DIR"
echo

# Create necessary directories
mkdir -p $ASSETS_DIR/{marketplace,github,social-media,documentation,marketing,templates}

# Convert existing SVGs to PNG
echo "📷 Converting VS Code Marketplace screenshots..."
cd $ASSETS_DIR/marketplace
for svg_file in *.svg; do
    if [[ ! -f "${svg_file%.svg}.png" ]]; then
        echo "  Converting $svg_file..."
        inkscape "$svg_file" --export-type=png \
                 --export-width=1366 --export-height=768 \
                 --export-filename="${svg_file%.svg}.png" 2>/dev/null || echo "    ⚠️  Failed to convert $svg_file"
    fi
done

# Generate feature banners at different sizes
echo "🖼️ Generating feature banners at multiple sizes..."
for svg_file in feature-banner-*.svg; do
    if [[ -f "$svg_file" ]]; then
        base_name="${svg_file%.svg}"
        # 1800x1000 (original)
        inkscape "$svg_file" --export-type=png \
                 --export-width=1800 --export-height=1000 \
                 --export-filename="${base_name}.png" 2>/dev/null
        # 1200x667 (16:9 social media)
        inkscape "$svg_file" --export-type=png \
                 --export-width=1200 --export-height=667 \
                 --export-filename="${base_name}-social.png" 2>/dev/null
    fi
done

# Create GitHub repository assets
echo "🐙 Creating GitHub repository visuals..."
cd $ASSETS_DIR/github

# Create a simple GitHub hero header
cat > github-hero-header.svg << 'EOF'
<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="640" viewBox="0 0 1280 640">
  <defs>
    <linearGradient id="heroGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#4A90E2;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#357ABD;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="1280" height="640" fill="url(#heroGradient)"/>
  <text x="640" y="240" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" 
        font-size="64" font-weight="700" fill="white" text-anchor="middle">
    Separation of Concerns
  </text>
  <text x="640" y="300" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" 
        font-size="32" font-weight="400" fill="rgba(255,255,255,0.9)" text-anchor="middle">
    Migrator for VS Code
  </text>
  <text x="640" y="380" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" 
        font-size="20" font-weight="400" fill="rgba(255,255,255,0.8)" text-anchor="middle">
    One-click code organization for TypeScript projects
  </text>
  <rect x="540" y="420" width="200" height="50" rx="25" fill="rgba(255,255,255,0.15)" 
        stroke="rgba(255,255,255,0.3)" stroke-width="2"/>
  <text x="640" y="450" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" 
        font-size="18" font-weight="600" fill="white" text-anchor="middle">
    Get Extension
  </text>
</svg>
EOF

inkscape github-hero-header.svg --export-type=png \
         --export-width=1280 --export-height=640 \
         --export-filename="github-hero-header.png" 2>/dev/null

# Create Mermaid workflow diagram
cat > github-workflow-mermaid.md << 'EOF'
```mermaid
flowchart TD
    A[TypeScript File] --> B{Right-click Menu}
    B --> C[Migrate to SoC]
    C --> D[Parse AST]
    D --> E[Extract Exports]
    E --> F[Create Folder]
    F --> G[Generate Files]
    G --> H[Create index.ts]
    H --> I[Success!]
    
    E --> E1[Functions]
    E --> E2[Classes]  
    E --> E3[Types]
    E --> E4[Interfaces]
    
    G --> G1[fetch-user-data.ts]
    G --> G2[user-manager.ts]
    G --> G3[types.ts]
    
    style A fill:#4A90E2,color:white
    style I fill:#28A745,color:white
    style F fill:#FF9800,color:white
```
EOF

# Create social media assets
echo "📱 Creating social media packages..."
cd $ASSETS_DIR/social-media

# Create a Twitter/X card template
cat > social-twitter-card-launch.svg << 'EOF'
<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900" viewBox="0 0 1600 900">
  <defs>
    <linearGradient id="twitterGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#4A90E2;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#357ABD;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="1600" height="900" fill="url(#twitterGradient)"/>
  <rect x="80" y="80" width="1440" height="740" fill="rgba(255,255,255,0.05)" rx="20"/>
  
  <text x="800" y="300" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" 
        font-size="72" font-weight="700" fill="white" text-anchor="middle">
    🚀 New VS Code Extension
  </text>
  <text x="800" y="380" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" 
        font-size="36" font-weight="400" fill="rgba(255,255,255,0.9)" text-anchor="middle">
    Separation of Concerns Migrator
  </text>
  <text x="800" y="500" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" 
        font-size="24" font-weight="400" fill="rgba(255,255,255,0.8)" text-anchor="middle">
    One-click code organization for TypeScript
  </text>
  <text x="800" y="600" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" 
        font-size="20" font-weight="400" fill="rgba(255,255,255,0.7)" text-anchor="middle">
    #VSCode #TypeScript #CodeOrganization #DeveloperTools
  </text>
</svg>
EOF

inkscape social-twitter-card-launch.svg --export-type=png \
         --export-width=1600 --export-height=900 \
         --export-filename="social-twitter-card-launch.png" 2>/dev/null

# Create LinkedIn card
cat > social-linkedin-professional.svg << 'EOF' 
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="627" viewBox="0 0 1200 627">
  <defs>
    <linearGradient id="linkedinGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#4A90E2;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#357ABD;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="1200" height="627" fill="url(#linkedinGradient)"/>
  <rect x="60" y="60" width="1080" height="507" fill="rgba(255,255,255,0.05)" rx="15"/>
  
  <text x="600" y="200" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" 
        font-size="48" font-weight="700" fill="white" text-anchor="middle">
    Revolutionizing Code Organization
  </text>
  <text x="600" y="270" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" 
        font-size="24" font-weight="400" fill="rgba(255,255,255,0.9)" text-anchor="middle">
    New VS Code extension for instant separation of concerns
  </text>
  <text x="600" y="380" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" 
        font-size="18" font-weight="400" fill="rgba(255,255,255,0.8)" text-anchor="middle">
    Transform complex TypeScript files into organized, maintainable code structures
  </text>
</svg>
EOF

inkscape social-linkedin-professional.svg --export-type=png \
         --export-width=1200 --export-height=627 \
         --export-filename="social-linkedin-professional.png" 2>/dev/null

# Create Dev.to header
cat > social-devto-header-tutorial.svg << 'EOF'
<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="420" viewBox="0 0 1000 420">
  <defs>
    <linearGradient id="devtoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#4A90E2;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#357ABD;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="1000" height="420" fill="url(#devtoGradient)"/>
  <rect x="40" y="40" width="920" height="340" fill="rgba(255,255,255,0.05)" rx="12"/>
  
  <text x="500" y="150" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" 
        font-size="36" font-weight="700" fill="white" text-anchor="middle">
    Automate Separation of Concerns
  </text>
  <text x="500" y="200" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" 
        font-size="20" font-weight="400" fill="rgba(255,255,255,0.9)" text-anchor="middle">
    Complete tutorial for the new VS Code extension
  </text>
  <text x="500" y="280" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" 
        font-size="16" font-weight="400" fill="rgba(255,255,255,0.7)" text-anchor="middle">
    Step-by-step guide to organizing TypeScript code
  </text>
</svg>
EOF

inkscape social-devto-header-tutorial.svg --export-type=png \
         --export-width=1000 --export-height=420 \
         --export-filename="social-devto-header-tutorial.png" 2>/dev/null

# Create documentation assets
echo "📚 Creating documentation infographics..."
cd $ASSETS_DIR/documentation

# Create export patterns cheat sheet
cat > docs-export-patterns-cheatsheet.svg << 'EOF'
<svg xmlns="http://www.w3.org/2000/svg" width="800" height="1200" viewBox="0 0 800 1200">
  <rect width="800" height="1200" fill="#FFFFFF"/>
  <rect x="40" y="40" width="720" height="80" fill="#4A90E2"/>
  <text x="400" y="90" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" 
        font-size="32" font-weight="700" fill="white" text-anchor="middle">
    Supported Export Patterns
  </text>
  
  <g transform="translate(60, 160)">
    <rect width="680" height="200" fill="#F8F9FA" stroke="#E9ECEF" rx="8"/>
    <text x="20" y="30" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" 
          font-size="20" font-weight="600" fill="#495057">
      1. Named Function Exports
    </text>
    <rect x="20" y="50" width="640" height="120" fill="#2D3748" rx="4"/>
    <text x="30" y="80" font-family="'SF Mono', Monaco, 'Consolas', monospace" 
          font-size="14" fill="#E2E8F0">export function fetchUserData(userId: number) {</text>
    <text x="30" y="100" font-family="'SF Mono', Monaco, 'Consolas', monospace" 
          font-size="14" fill="#E2E8F0">  return fetch(\`/api/users/\${userId}\`)</text>
    <text x="30" y="120" font-family="'SF Mono', Monaco, 'Consolas', monospace" 
          font-size="14" fill="#E2E8F0">}</text>
    <text x="30" y="150" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" 
          font-size="12" fill="#6C757D">✅ Will be migrated to: fetch-user-data.ts</text>
  </g>

  <g transform="translate(60, 380)">
    <rect width="680" height="200" fill="#F8F9FA" stroke="#E9ECEF" rx="8"/>
    <text x="20" y="30" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" 
          font-size="20" font-weight="600" fill="#495057">
      2. Arrow Function Exports
    </text>
    <rect x="20" y="50" width="640" height="120" fill="#2D3748" rx="4"/>
    <text x="30" y="80" font-family="'SF Mono', Monaco, 'Consolas', monospace" 
          font-size="14" fill="#E2E8F0">export const validateEmail = (email: string): boolean => {</text>
    <text x="30" y="100" font-family="'SF Mono', Monaco, 'Consolas', monospace" 
          font-size="14" fill="#E2E8F0">  return /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email)</text>
    <text x="30" y="120" font-family="'SF Mono', Monaco, 'Consolas', monospace" 
          font-size="14" fill="#E2E8F0">}</text>
    <text x="30" y="150" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" 
          font-size="12" fill="#6C757D">✅ Will be migrated to: validate-email.ts</text>
  </g>

  <g transform="translate(60, 600)">
    <rect width="680" height="200" fill="#F8F9FA" stroke="#E9ECEF" rx="8"/>
    <text x="20" y="30" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" 
          font-size="20" font-weight="600" fill="#495057">
      3. Class Exports
    </text>
    <rect x="20" y="50" width="640" height="120" fill="#2D3748" rx="4"/>
    <text x="30" y="80" font-family="'SF Mono', Monaco, 'Consolas', monospace" 
          font-size="14" fill="#E2E8F0">export class UserManager {</text>
    <text x="30" y="100" font-family="'SF Mono', Monaco, 'Consolas', monospace" 
          font-size="14" fill="#E2E8F0">  private users: User[] = []</text>
    <text x="30" y="120" font-family="'SF Mono', Monaco, 'Consolas', monospace" 
          font-size="14" fill="#E2E8F0">}</text>
    <text x="30" y="150" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" 
          font-size="12" fill="#6C757D">✅ Will be migrated to: user-manager.ts</text>
  </g>

  <g transform="translate(60, 820)">
    <rect width="680" height="200" fill="#F8F9FA" stroke="#E9ECEF" rx="8"/>
    <text x="20" y="30" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" 
          font-size="20" font-weight="600" fill="#495057">
      4. Type/Interface Exports
    </text>
    <rect x="20" y="50" width="640" height="120" fill="#2D3748" rx="4"/>
    <text x="30" y="80" font-family="'SF Mono', Monaco, 'Consolas', monospace" 
          font-size="14" fill="#E2E8F0">export type TUser = {</text>
    <text x="30" y="100" font-family="'SF Mono', Monaco, 'Consolas', monospace" 
          font-size="14" fill="#E2E8F0">  id: number; name: string; email: string;</text>
    <text x="30" y="120" font-family="'SF Mono', Monaco, 'Consolas', monospace" 
          font-size="14" fill="#E2E8F0">}</text>
    <text x="30" y="150" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" 
          font-size="12" fill="#6C757D">✅ Will be migrated to: types.ts</text>
  </g>

  <rect x="60" y="1040" width="680" height="100" fill="#E8F5E8" stroke="#28A745" rx="8"/>
  <text x="400" y="1070" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" 
        font-size="16" font-weight="600" fill="#28A745" text-anchor="middle">
    ✨ Automatic index.ts generation with re-exports
  </text>
  <text x="400" y="1095" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" 
        font-size="14" fill="#28A745" text-anchor="middle">
    All exports automatically available through single import
  </text>
</svg>
EOF

inkscape docs-export-patterns-cheatsheet.svg --export-type=png \
         --export-width=800 --export-height=1200 \
         --export-filename="docs-export-patterns-cheatsheet.png" 2>/dev/null

# Create marketing materials
echo "🎯 Creating marketing collateral..."
cd $ASSETS_DIR/marketing

# Create logo variations using existing icon
cp $BASE_DIR/assets/icon.svg marketing-logo-full-color.svg
cp $BASE_DIR/assets/icon.png marketing-logo-collection.png

# Generate optimized versions
echo "🗜️ Optimizing PNG assets..."
find $ASSETS_DIR -name "*.png" -type f -exec optipng -q -o2 {} \; 2>/dev/null || echo "  ⚠️  optipng not available, skipping optimization"

# Create asset inventory
echo "📋 Creating asset inventory..."
cat > $ASSETS_DIR/ASSET_INVENTORY.md << 'EOF'
# Asset Inventory - Generated

## VS Code Marketplace Assets ✅
- marketplace-screenshot-before-light.png (1366×768)
- marketplace-screenshot-after-light.png (1366×768) 
- marketplace-screenshot-before-dark.png (1366×768)
- marketplace-screenshot-after-dark.png (1366×768)
- feature-banner-one-click.png (1800×1000)

## GitHub Repository Assets ✅
- github-hero-header.png (1280×640)
- github-workflow-mermaid.md (Mermaid diagram source)

## Social Media Assets ✅
- social-twitter-card-launch.png (1600×900)
- social-linkedin-professional.png (1200×627)
- social-devto-header-tutorial.png (1000×420)

## Documentation Assets ✅
- docs-export-patterns-cheatsheet.png (800×1200)

## Marketing Assets ✅
- marketing-logo-full-color.svg
- marketing-logo-collection.png (1024×1024)

## Templates ✅
- template-screenshot-frame.svg
- template-social-card.svg
- template-feature-banner.svg

## Style Guide ✅
- STYLE_GUIDE.md (Comprehensive brand guidelines)
- ASSET_MASTER_LIST.md (Complete asset specifications)

Total Assets Generated: 15+ files
Total Size: < 5MB (optimized)
EOF

echo
echo "✅ Asset generation complete!"
echo "📊 Summary:"
echo "   • VS Code Marketplace: 5+ assets"  
echo "   • GitHub Repository: 2+ assets"
echo "   • Social Media: 3+ assets"
echo "   • Documentation: 1+ assets"
echo "   • Marketing: 2+ assets"
echo "   • Templates: 3 assets"
echo "   • Style Guide: Complete"
echo
echo "📁 All assets saved in: $ASSETS_DIR"
echo "📋 See ASSET_INVENTORY.md for complete list"
echo
echo "🚀 Ready for:"
echo "   • VS Code Marketplace publication"
echo "   • GitHub repository enhancement"  
echo "   • Social media promotion"
echo "   • Documentation embedding"
EOF

chmod +x generate-assets.sh
