import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Mock VSCode APIs that the extension uses
global.vscode = {
  window: {
    showInformationMessage: (msg) => console.log(`ℹ️  INFO: ${msg}`),
    showWarningMessage: (msg) => console.log(`⚠️  WARNING: ${msg}`),
    showErrorMessage: (msg) => console.log(`❌ ERROR: ${msg}`)
  },
  Uri: {
    file: (path) => ({ fsPath: path })
  }
};

// Import the compiled extension
async function testMigration() {
  try {
    // We need to import the bundled extension
    const extensionPath = path.join(__dirname, 'dist', 'extension.js');
    
    if (!fs.existsSync(extensionPath)) {
      console.log('❌ Extension not built. Run npm run build first.');
      return;
    }
    
    console.log('🧪 Testing migration on test files...\n');
    
    const testFiles = [
      '_TEST-FILES/simple-test.ts',
      '_TEST-FILES/test-sample.ts'
    ];
    
    for (const testFile of testFiles) {
      const fullPath = path.join(__dirname, testFile);
      
      if (!fs.existsSync(fullPath)) {
        console.log(`⚠️  Test file not found: ${testFile}`);
        continue;
      }
      
      console.log(`\n🔍 Testing file: ${testFile}`);
      console.log(`📄 File size: ${fs.statSync(fullPath).size} bytes`);
      
      // Check if output directory already exists
      const fileName = path.basename(testFile, path.extname(testFile));
      const outputDir = path.join(path.dirname(fullPath), fileName);
      
      if (fs.existsSync(outputDir)) {
        console.log(`🗂️  Output directory already exists: ${outputDir}`);
        console.log('   Cleaning up...');
        fs.rmSync(outputDir, { recursive: true, force: true });
      }
      
      // Try to simulate the migration
      try {
        // Since we can't easily import the bundled module, let's at least
        // test that the file can be parsed by our parser logic
        const content = fs.readFileSync(fullPath, 'utf-8');
        console.log(`📏 Content length: ${content.length} characters`);
        
        // Test basic parsing
        import('@babel/parser').then(({ parse }) => {
          try {
            const ast = parse(content, {
              sourceType: 'module',
              plugins: ['typescript', 'jsx', 'decorators-legacy'],
              ranges: true
            });
            
            let exportCount = 0;
            let importCount = 0;
            let typeCount = 0;
            
            ast.program.body.forEach(node => {
              if (node.type === 'ExportNamedDeclaration') exportCount++;
              if (node.type === 'ExportDefaultDeclaration') exportCount++;
              if (node.type === 'ImportDeclaration') importCount++;
              if (node.type === 'TSTypeAliasDeclaration') typeCount++;
            });
            
            console.log(`   ✅ Parse successful!`);
            console.log(`   📊 Found ${exportCount} exports, ${importCount} imports, ${typeCount} types`);
            
            if (exportCount === 0) {
              console.log(`   ⚠️  No exports found - migration would show warning`);
            } else {
              console.log(`   ✓ Migration should process ${exportCount} exported items`);
            }
            
          } catch (parseError) {
            console.log(`   ❌ Parse error: ${parseError.message}`);
          }
        }).catch(err => {
          console.log(`   ❌ Module import error: ${err.message}`);
        });
        
      } catch (error) {
        console.log(`   ❌ Test error: ${error.message}`);
      }
    }
    
    console.log('\n🏁 Test completed!');
    console.log('\nℹ️  To fully test the extension:');
    console.log('   1. Install the .vsix file in VSCode');
    console.log('   2. Right-click on a test file in Explorer');
    console.log('   3. Select "Migrate to Separation of Concerns"');
    
  } catch (error) {
    console.error('Test failed:', error);
  }
}

testMigration();
