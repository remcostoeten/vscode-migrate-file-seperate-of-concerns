import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { parse } from '@babel/parser';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Simulate what the extension would generate
function simulateMigration(testFileName) {
    const filePath = path.join(__dirname, '_TEST-FILES', testFileName);
    const content = fs.readFileSync(filePath, 'utf-8');
    
    console.log(`🧪 Simulating migration for: ${testFileName}`);
    console.log('=' .repeat(60));
    
    try {
        const ast = parse(content, {
            sourceType: 'module',
            plugins: ['typescript', 'jsx', 'decorators-legacy'],
            ranges: true
        });
        
        // Parse the file structure
        const parsed = parseStructure(ast, content);
        
        console.log('📊 Parsed Structure:');
        console.log(`   Functions: ${parsed.functions.length}`);
        console.log(`   Types: ${parsed.types.length}`);
        console.log(`   Classes: ${parsed.classes.length}`);
        console.log(`   Imports: ${parsed.imports.length}`);
        
        // Generate files
        const outputDir = path.join(__dirname, '_TEST-OUTPUT', path.basename(testFileName, '.ts'));
        
        if (fs.existsSync(outputDir)) {
            fs.rmSync(outputDir, { recursive: true });
        }
        fs.mkdirSync(outputDir, { recursive: true });
        
        const exportStatements = [];
        
        // Generate function files
        parsed.functions.forEach(func => {
            if (func.isExported) {
                const fileName = convertToKebabCase(func.name) + '.ts';
                const filePath = path.join(outputDir, fileName);
                const fileContent = generateFunctionFile(func, parsed);
                
                fs.writeFileSync(filePath, fileContent);
                exportStatements.push(`export * from './${fileName.replace('.ts', '')}'`);
                console.log(`   ✓ Generated: ${fileName}`);
            }
        });
        
        // Generate type files
        parsed.types.forEach(type => {
            if (type.isExported) {
                const fileName = convertToKebabCase(type.name) + '.ts';
                const filePath = path.join(outputDir, fileName);
                const fileContent = generateTypeFile(type, parsed);
                
                fs.writeFileSync(filePath, fileContent);
                exportStatements.push(`export * from './${fileName.replace('.ts', '')}'`);
                console.log(`   ✓ Generated: ${fileName}`);
            }
        });
        
        // Generate class files
        parsed.classes.forEach(cls => {
            if (cls.isExported) {
                const fileName = convertToKebabCase(cls.name) + '.ts';
                const filePath = path.join(outputDir, fileName);
                const fileContent = generateClassFile(cls, parsed);
                
                fs.writeFileSync(filePath, fileContent);
                exportStatements.push(`export * from './${fileName.replace('.ts', '')}'`);
                console.log(`   ✓ Generated: ${fileName}`);
            }
        });
        
        // Generate index.ts
        if (exportStatements.length > 0) {
            const indexPath = path.join(outputDir, 'index.ts');
            fs.writeFileSync(indexPath, exportStatements.join('\\n') + '\\n');
            console.log(`   ✓ Generated: index.ts`);
        }
        
        console.log(`\\n✅ Migration complete! Generated ${exportStatements.length} files in: ${outputDir}`);
        
        // Show generated files
        console.log('\\n📁 Generated Files:');
        const files = fs.readdirSync(outputDir);
        files.forEach(file => {
            console.log(`   📄 ${file}`);
            const content = fs.readFileSync(path.join(outputDir, file), 'utf-8');
            console.log(`      ${content.split('\\n').length} lines, ${content.length} characters`);
        });
        
    } catch (error) {
        console.log(`❌ Error: ${error.message}`);
    }
}

function parseStructure(ast, content) {
    const result = {
        imports: [],
        functions: [],
        types: [],
        classes: [],
        variables: []
    };
    
    ast.program.body.forEach(node => {
        switch (node.type) {
            case 'ImportDeclaration':
                result.imports.push({
                    source: node.source.value,
                    imports: node.specifiers.map(spec => spec.local.name),
                    isTypeOnly: node.importKind === 'type'
                });
                break;
                
            case 'ExportNamedDeclaration':
                if (node.declaration) {
                    const decl = node.declaration;
                    processDeclaration(decl, result, content, true);
                }
                break;
                
            case 'TSTypeAliasDeclaration':
                processDeclaration(node, result, content, false);
                break;
                
            case 'VariableDeclaration':
                node.declarations.forEach(decl => {
                    if (decl.id && decl.id.name) {
                        result.variables.push({
                            name: decl.id.name,
                            value: extractCode(decl.init, content),
                            isExported: false
                        });
                    }
                });
                break;
        }
    });
    
    return result;
}

function processDeclaration(node, result, content, isExported) {
    switch (node.type) {
        case 'FunctionDeclaration':
            result.functions.push({
                name: node.id.name,
                code: extractCode(node, content),
                isExported,
                dependencies: extractTypeDependencies(extractCode(node, content))
            });
            break;
            
        case 'TSTypeAliasDeclaration':
            result.types.push({
                name: node.id.name,
                code: extractCode(node, content),
                isExported,
                dependencies: extractTypeDependencies(extractCode(node, content))
            });
            break;
            
        case 'ClassDeclaration':
            result.classes.push({
                name: node.id.name,
                code: extractCode(node, content),
                isExported,
                dependencies: []
            });
            break;
    }
}

function extractCode(node, content) {
    if (!node || !node.range) return '';
    return content.slice(node.range[0], node.range[1]);
}

function extractTypeDependencies(code) {
    const deps = new Set();
    const typePattern = /\\b(T[A-Z][a-zA-Z0-9_]*)/g;
    let match;
    
    while ((match = typePattern.exec(code)) !== null) {
        deps.add(match[1]);
    }
    
    return Array.from(deps);
}

function generateFunctionFile(func, parsed) {
    const lines = [];
    
    // Add needed imports
    parsed.imports.forEach(imp => {
        if (func.code.includes(imp.imports.some ? imp.imports[0] : '')) {
            lines.push(`import { ${imp.imports.join(', ')} } from '${imp.source}'`);
        }
    });
    
    if (lines.length > 0) lines.push('');
    
    // Add dependent types
    const neededTypes = parsed.types.filter(type => 
        !type.isExported && func.dependencies.includes(type.name)
    );
    
    neededTypes.forEach(type => {
        lines.push(type.code);
    });
    
    if (neededTypes.length > 0) lines.push('');
    
    // Add dependent variables  
    const neededVars = parsed.variables.filter(v => 
        func.code.includes(v.name)
    );
    
    neededVars.forEach(v => {
        lines.push(`const ${v.name} = ${v.value}`);
    });
    
    if (neededVars.length > 0) lines.push('');
    
    // Add the function
    const cleanCode = func.code.replace(/^export\\s+/, '');
    lines.push(`export ${cleanCode}`);
    
    return lines.join('\\n');
}

function generateTypeFile(type, parsed) {
    const lines = [];
    
    // Add dependent types
    const neededTypes = parsed.types.filter(t => 
        !t.isExported && type.dependencies.includes(t.name)
    );
    
    neededTypes.forEach(t => {
        lines.push(t.code);
    });
    
    if (neededTypes.length > 0) lines.push('');
    
    // Add the type
    const cleanCode = type.code.replace(/^export\\s+/, '');
    lines.push(`export ${cleanCode}`);
    
    return lines.join('\\n');
}

function generateClassFile(cls, parsed) {
    const lines = [];
    
    // Add the class
    const cleanCode = cls.code.replace(/^export\\s+/, '');
    lines.push(`export ${cleanCode}`);
    
    return lines.join('\\n');
}

function convertToKebabCase(str) {
    return str
        .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
        .toLowerCase();
}

// Test the minimal file
simulateMigration('minimal-test.ts');
