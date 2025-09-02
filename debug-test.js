const fs = require('fs');
const path = require('path');

// Import the compiled JS files - using dynamic import since it's bundled
const testFilePath = require('path').join(__dirname, '_TEST-FILES', 'test-sample.ts');
const fs = require('fs');

// Since the extension is bundled, we'll test the logic directly
const { parseFile } = require('./dist/extension.js');
const { generateFiles } = require('./dist/extension.js');

async function debugTest() {
    const testFilePath = path.join(__dirname, '_TEST-FILES', 'test-sample.ts');
    const content = fs.readFileSync(testFilePath, 'utf-8');
    
    console.log('🧪 Testing migration logic...');
    console.log(`📄 File: ${testFilePath}`);
    console.log(`📏 Content length: ${content.length} characters`);
    
    try {
        // Parse the file
        console.log('\n🔍 Parsing file...');
        const parsedData = parseFile(content, testFilePath);
        
        console.log('\n📊 Parse Results:');
        console.log(`  • Functions: ${parsedData.functions.length}`);
        console.log(`  • Types: ${parsedData.types.length}`);
        console.log(`  • Interfaces: ${parsedData.interfaces.length}`);
        console.log(`  • Classes: ${parsedData.classes.length}`);
        console.log(`  • Variables: ${parsedData.variables.length}`);
        console.log(`  • Imports: ${parsedData.imports.length}`);
        
        // Show detailed breakdown
        console.log('\n📝 Detailed breakdown:');
        
        console.log('Functions:');
        parsedData.functions.forEach(func => {
            console.log(`  - ${func.name} (exported: ${func.isExported}, async: ${func.isAsync}, deps: ${func.dependencies.length})`);
            if (func.dependencies.length > 0) {
                console.log(`    Dependencies: ${func.dependencies.slice(0, 5).join(', ')}${func.dependencies.length > 5 ? '...' : ''}`);
            }
        });
        
        console.log('Types:');
        parsedData.types.forEach(type => {
            console.log(`  - ${type.name} (exported: ${type.isExported}, deps: ${type.dependencies.length})`);
        });
        
        console.log('Classes:');
        parsedData.classes.forEach(cls => {
            console.log(`  - ${cls.name} (exported: ${cls.isExported}, deps: ${cls.dependencies.length})`);
        });
        
        console.log('Variables:');
        parsedData.variables.forEach(variable => {
            console.log(`  - ${variable.name} (exported: ${variable.isExported})`);
        });
        
        console.log('Imports:');
        parsedData.imports.forEach(imp => {
            console.log(`  - from '${imp.source}': ${imp.imports.join(', ')} (typeOnly: ${imp.isTypeOnly})`);
        });
        
        // Try to generate files
        console.log('\n🚀 Generating files...');
        await generateFiles(parsedData, testFilePath);
        
        console.log('\n✅ Test completed successfully!');
        
    } catch (error) {
        console.error('\n❌ Test failed:', error);
        console.error('Stack trace:', error.stack);
    }
}

debugTest();
