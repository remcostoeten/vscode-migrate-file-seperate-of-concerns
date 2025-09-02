import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Simulate the parsing logic for debugging
import { parse } from '@babel/parser';

function parseFile(content, filePath) {
  try {
    const ast = parse(content, {
      sourceType: 'module',
      plugins: ['typescript', 'jsx', 'decorators-legacy'],
      ranges: true
    });

    const result = {
      imports: [],
      functions: [],
      types: [],
      interfaces: [],
      classes: [],
      variables: [],
      filePath
    };

    // Basic parsing logic to identify exports
    const program = ast.program || ast;
    
    if (program.body) {
      program.body.forEach(node => {
        console.log(`Node type: ${node.type}`);
        
        if (node.type === 'ExportNamedDeclaration') {
          console.log('Found export named declaration!');
          if (node.declaration) {
            console.log(`  Declaration type: ${node.declaration.type}`);
            if (node.declaration.type === 'FunctionDeclaration') {
              console.log(`  Function name: ${node.declaration.id?.name}`);
            } else if (node.declaration.type === 'TSTypeAliasDeclaration') {
              console.log(`  Type name: ${node.declaration.id?.name}`);
            }
          }
        }
        
        if (node.type === 'ImportDeclaration') {
          console.log(`Import from: ${node.source.value}`);
          result.imports.push({
            source: node.source.value,
            imports: node.specifiers.map(spec => spec.local.name),
            isTypeOnly: node.importKind === 'type',
            isDefault: false,
            namespace: undefined
          });
        }
      });
    }

    return result;
  } catch (error) {
    console.error('Parse error:', error);
    return {
      imports: [],
      functions: [],
      types: [],
      interfaces: [],
      classes: [],
      variables: [],
      filePath
    };
  }
}

async function debugTest() {
    const testFilePath = path.join(__dirname, '_TEST-FILES', 'test-sample.ts');
    const content = fs.readFileSync(testFilePath, 'utf-8');
    
    console.log('🧪 Testing migration logic...');
    console.log(`📄 File: ${testFilePath}`);
    console.log(`📏 Content length: ${content.length} characters`);
    
    console.log('\n📄 File content preview:');
    console.log(content.substring(0, 500) + '...\n');
    
    try {
        // Parse the file
        console.log('🔍 Parsing file...');
        const parsedData = parseFile(content, testFilePath);
        
        console.log('\n📊 Parse Results:');
        console.log(`  • Functions: ${parsedData.functions.length}`);
        console.log(`  • Types: ${parsedData.types.length}`);
        console.log(`  • Interfaces: ${parsedData.interfaces.length}`);
        console.log(`  • Classes: ${parsedData.classes.length}`);
        console.log(`  • Variables: ${parsedData.variables.length}`);
        console.log(`  • Imports: ${parsedData.imports.length}`);
        
        console.log('\n✅ Basic test completed!');
        
    } catch (error) {
        console.error('\n❌ Test failed:', error);
        console.error('Stack trace:', error.stack);
    }
}

debugTest();
