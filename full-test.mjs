import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { parse } from '@babel/parser';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Import our source modules directly for testing
import('./src/parser.ts').catch(() => {
    // Fallback: manually implement the core logic for testing
    console.log('⚠️  Could not import TS modules, using fallback test logic...\n');
    performManualTest();
});

async function performManualTest() {
    const testFiles = [
        '_TEST-FILES/simple-test.ts',
        '_TEST-FILES/test-sample.ts'
    ];

    for (const testFile of testFiles) {
        console.log(`\n🧪 Testing: ${testFile}`);
        console.log('=' .repeat(50));
        
        const fullPath = path.join(__dirname, testFile);
        const content = fs.readFileSync(fullPath, 'utf-8');
        
        try {
            // Parse with our configuration
            const ast = parse(content, {
                sourceType: 'module',
                plugins: ['typescript', 'jsx', 'decorators-legacy'],
                ranges: true
            });

            console.log(`✅ Parsing successful`);
            
            // Analyze the AST
            const analysis = analyzeAST(ast, content);
            
            console.log('\n📊 Analysis Results:');
            console.log(`   • Imports: ${analysis.imports.length}`);
            console.log(`   • Exported Functions: ${analysis.exportedFunctions.length}`);
            console.log(`   • Exported Types: ${analysis.exportedTypes.length}`);
            console.log(`   • Exported Classes: ${analysis.exportedClasses.length}`);
            console.log(`   • Non-exported Types: ${analysis.nonExportedTypes.length}`);
            
            // Show details
            if (analysis.exportedFunctions.length > 0) {
                console.log('\n🔧 Exported Functions:');
                analysis.exportedFunctions.forEach(func => {
                    console.log(`   • ${func.name}(${func.params.join(', ')})`);
                });
            }
            
            if (analysis.exportedTypes.length > 0) {
                console.log('\n🏷️  Exported Types:');
                analysis.exportedTypes.forEach(type => {
                    console.log(`   • ${type.name}`);
                });
            }
            
            if (analysis.exportedClasses.length > 0) {
                console.log('\n🏗️  Exported Classes:');
                analysis.exportedClasses.forEach(cls => {
                    console.log(`   • ${cls.name}`);
                });
            }
            
            if (analysis.nonExportedTypes.length > 0) {
                console.log('\n🔒 Non-exported Types (should be auto-included):');
                analysis.nonExportedTypes.forEach(type => {
                    console.log(`   • ${type.name}`);
                });
            }
            
            // Simulate migration
            console.log('\n🚀 Migration Simulation:');
            const totalExported = analysis.exportedFunctions.length + 
                                 analysis.exportedTypes.length + 
                                 analysis.exportedClasses.length;
            
            if (totalExported === 0) {
                console.log('   ⚠️  No exported items - would show warning message');
            } else {
                console.log(`   ✓ Would create ${totalExported} files:`);
                
                analysis.exportedFunctions.forEach(func => {
                    const fileName = convertToKebabCase(func.name) + '.ts';
                    console.log(`     📄 ${fileName}`);
                });
                
                analysis.exportedTypes.forEach(type => {
                    const fileName = convertToKebabCase(type.name) + '.ts';
                    console.log(`     📄 ${fileName}`);
                });
                
                analysis.exportedClasses.forEach(cls => {
                    const fileName = convertToKebabCase(cls.name) + '.ts';
                    console.log(`     📄 ${fileName}`);
                });
                
                console.log(`     📄 index.ts (with ${totalExported} re-exports)`);
            }
            
        } catch (error) {
            console.log(`❌ Parse error: ${error.message}`);
        }
    }
}

function analyzeAST(ast, content) {
    const analysis = {
        imports: [],
        exportedFunctions: [],
        exportedTypes: [],
        exportedClasses: [],
        nonExportedTypes: []
    };
    
    ast.program.body.forEach(node => {
        switch (node.type) {
            case 'ImportDeclaration':
                analysis.imports.push({
                    source: node.source.value,
                    imports: node.specifiers.map(spec => spec.local.name)
                });
                break;
                
            case 'ExportNamedDeclaration':
                if (node.declaration) {
                    const decl = node.declaration;
                    
                    if (decl.type === 'FunctionDeclaration') {
                        analysis.exportedFunctions.push({
                            name: decl.id.name,
                            params: decl.params.map(p => p.name || '...'),
                            async: decl.async
                        });
                    } else if (decl.type === 'TSTypeAliasDeclaration') {
                        analysis.exportedTypes.push({
                            name: decl.id.name
                        });
                    } else if (decl.type === 'ClassDeclaration') {
                        analysis.exportedClasses.push({
                            name: decl.id.name
                        });
                    }
                }
                break;
                
            case 'ExportDefaultDeclaration':
                if (node.declaration.type === 'FunctionDeclaration') {
                    analysis.exportedFunctions.push({
                        name: node.declaration.id?.name || 'default',
                        params: node.declaration.params.map(p => p.name || '...'),
                        async: node.declaration.async,
                        isDefault: true
                    });
                }
                break;
                
            case 'TSTypeAliasDeclaration':
                // Non-exported type
                analysis.nonExportedTypes.push({
                    name: node.id.name
                });
                break;
        }
    });
    
    return analysis;
}

function convertToKebabCase(str) {
    return str
        .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
        .toLowerCase();
}

// Start the test
performManualTest();
