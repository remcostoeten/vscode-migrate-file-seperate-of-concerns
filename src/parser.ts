import { parse } from '@babel/parser'
import { TParsed, TImport, TFunction, TType, TInterface, TClass, TVariable } from './types'

export function parseFile(content: string, filePath: string): TParsed {
  try {
    const ast = parse(content, {
      sourceType: 'module',
      plugins: ['typescript', 'decorators-legacy'],
      ranges: true
    })

    const result: TParsed = {
      imports: [],
      functions: [],
      types: [],
      interfaces: [],
      classes: [],
      variables: [],
      filePath
    }

    // Babel parser returns a File node with a program property containing the actual AST
    const program = ast.program || ast
    traverseAST(program, result, content)
    return result
  } catch (error) {
    console.error('Parse error:', error)
    return {
      imports: [],
      functions: [],
      types: [],
      interfaces: [],
      classes: [],
      variables: [],
      filePath
    }
  }
}

function traverseAST(node: any, result: TParsed, content: string) {
  if (!node) return

  // First pass: collect all declarations
  const declarations = new Map<string, any>()
  
  switch (node.type) {
    case 'Program':
      // Collect all top-level declarations first
      node.body.forEach((child: any) => {
        collectDeclarations(child, declarations)
      })
      
      // Process exports only
      node.body.forEach((child: any) => {
        processExports(child, result, content, declarations)
      })
      
      // Process imports
      node.body.forEach((child: any) => {
        if (child.type === 'ImportDeclaration') {
          result.imports.push(parseImportDeclaration(child))
        }
      })
      break
  }
}

function collectDeclarations(node: any, declarations: Map<string, any>) {
  switch (node.type) {
    case 'FunctionDeclaration':
      if (node.id && node.id.name) {
        declarations.set(node.id.name, { type: 'function', node })
      }
      break
    case 'VariableDeclaration':
      node.declarations.forEach((decl: any) => {
        if (decl.id && decl.id.name) {
          declarations.set(decl.id.name, { type: 'variable', node: decl, parent: node })
        }
      })
      break
    case 'ClassDeclaration':
      if (node.id && node.id.name) {
        declarations.set(node.id.name, { type: 'class', node })
      }
      break
    case 'TSTypeAliasDeclaration':
      if (node.id && node.id.name) {
        declarations.set(node.id.name, { type: 'type', node })
      }
      break
    case 'TSInterfaceDeclaration':
      if (node.id && node.id.name) {
        declarations.set(node.id.name, { type: 'interface', node })
      }
      break
  }
}

function processExports(node: any, result: TParsed, content: string, declarations: Map<string, any>) {
  switch (node.type) {
    case 'ExportNamedDeclaration':
      if (node.declaration) {
        // Direct exports: export function foo() {}, export const bar = ...
        processExportedDeclaration(node.declaration, result, content, true)
      } else if (node.specifiers) {
        // Named exports: export { foo, bar }
        node.specifiers.forEach((spec: any) => {
          const exportedName = spec.exported.name
          const localName = spec.local.name
          const declaration = declarations.get(localName)
          
          if (declaration) {
            processExportedDeclaration(declaration.node, result, content, true, declaration.parent)
          }
        })
      }
      break
      
    case 'ExportDefaultDeclaration':
      // export default function() {} or export default foo
      if (node.declaration) {
        processExportedDeclaration(node.declaration, result, content, true, null, true)
      }
      break
  }
}

function processExportedDeclaration(node: any, result: TParsed, content: string, isExported: boolean, parent?: any, isDefault = false) {
  switch (node.type) {
    case 'FunctionDeclaration':
      // Only process functions that are exported
      result.functions.push(parseFunctionDeclaration(node, content, isExported, result.imports, isDefault))
      break
      
    case 'VariableDeclaration':
      // Only process exported variables (const/let functions)
      node.declarations.forEach((decl: any) => {
        if (decl.id && decl.id.name && isArrowFunctionOrFunction(decl)) {
          result.functions.push(parseVariableFunction(decl, content, isExported, result.imports, parent || node, isDefault))
        } else if (decl.id && decl.id.name) {
          result.variables.push(parseVariableDeclaration(decl, content, isExported, parent || node))
        }
      })
      break
      
    case 'ClassDeclaration':
      result.classes.push(parseClassDeclaration(node, content, isExported, result.imports))
      break
      
    case 'TSTypeAliasDeclaration':
      result.types.push(parseTypeDeclaration(node, content, isExported))
      break
      
    case 'TSInterfaceDeclaration':
      result.interfaces.push(parseInterfaceDeclaration(node, content, isExported))
      break
      
    case 'Identifier':
      // This handles cases like: const foo = () => {}; export default foo;
      // We need to look up the declaration
      break
  }
}

function isArrowFunctionOrFunction(decl: any): boolean {
  return decl.init && (decl.init.type === 'ArrowFunctionExpression' || decl.init.type === 'FunctionExpression')
}

function parseVariableFunction(decl: any, content: string, isExported: boolean, fileImports: TImport[], parent: any, isDefault = false): TFunction {
  const name = isDefault ? 'default' : decl.id.name
  const startLine = parent.loc.start.line
  const endLine = parent.loc.end.line
  const code = extractCodeFromNode(parent, content)
  
  const dependencies = extractDependencies(code)
  const imports = filterRelevantImports(dependencies, fileImports)
  const variables = extractLocalVariables(code)
  
  return {
    name,
    code,
    dependencies,
    imports,
    variables,
    isExported,
    isAsync: decl.init?.async || false,
    parameters: decl.init?.params ? decl.init.params.map((p: any) => p.name || 'param') : [],
    returnType: decl.init?.returnType ? extractCodeFromNode(decl.init.returnType, content) : undefined,
    startLine,
    endLine
  }
}

function markAsExported(name: string, result: TParsed) {
  // Mark functions as exported
  const func = result.functions.find(f => f.name === name)
  if (func) func.isExported = true
  
  // Mark types as exported
  const type = result.types.find(t => t.name === name)
  if (type) type.isExported = true
  
  // Mark interfaces as exported
  const interface_ = result.interfaces.find(i => i.name === name)
  if (interface_) interface_.isExported = true
  
  // Mark classes as exported
  const class_ = result.classes.find(c => c.name === name)
  if (class_) class_.isExported = true
  
  // Mark variables as exported
  const variable = result.variables.find(v => v.name === name)
  if (variable) variable.isExported = true
}

function parseImportDeclaration(node: any): TImport {
  const source = node.source.value
  const imports: string[] = []
  let isTypeOnly = false
  let isDefault = false
  let namespace: string | undefined

  if (node.importKind === 'type') {
    isTypeOnly = true
  }

  if (node.specifiers) {
    node.specifiers.forEach((spec: any) => {
      switch (spec.type) {
        case 'ImportDefaultSpecifier':
          imports.push(spec.local.name)
          isDefault = true
          break
        case 'ImportNamespaceSpecifier':
          namespace = spec.local.name
          break
        case 'ImportSpecifier':
          imports.push(spec.imported.name)
          if (spec.importKind === 'type') {
            isTypeOnly = true
          }
          break
      }
    })
  }

  return {
    source,
    imports,
    isTypeOnly,
    isDefault,
    namespace
  }
}

function parseFunctionDeclaration(node: any, content: string, isExported: boolean, fileImports: TImport[], isDefault = false): TFunction {
  const name = isDefault ? 'default' : (node.id ? node.id.name : 'anonymous')
  const startLine = node.loc.start.line
  const endLine = node.loc.end.line
  const code = extractCodeFromNode(node, content)

  const dependencies = extractDependencies(code)
  const imports = filterRelevantImports(dependencies, fileImports)
  const variables = extractLocalVariables(code)

  return {
    name,
    code,
    dependencies,
    imports,
    variables,
    isExported,
    isAsync: node.async || false,
    parameters: node.params ? node.params.map((p: any) => p.name || 'param') : [],
    returnType: node.returnType ? extractCodeFromNode(node.returnType, content) : undefined,
    startLine,
    endLine
  }
}

function parseTypeDeclaration(node: any, content: string, isExported: boolean): TType {
  const name = node.id.name
  const code = extractCodeFromNode(node, content)
  const dependencies = extractTypeDependencies(code)

  return {
    name,
    code,
    isExported,
    dependencies,
    startLine: node.loc.start.line,
    endLine: node.loc.end.line
  }
}

function parseInterfaceDeclaration(node: any, content: string, isExported: boolean): TInterface {
  const name = node.id.name
  const code = extractCodeFromNode(node, content)
  const dependencies = extractTypeDependencies(code)

  return {
    name,
    code,
    isExported,
    dependencies,
    startLine: node.loc.start.line,
    endLine: node.loc.end.line
  }
}

function parseClassDeclaration(node: any, content: string, isExported: boolean, fileImports: TImport[]): TClass {
  const name = node.id ? node.id.name : 'AnonymousClass'
  const code = extractCodeFromNode(node, content)
  const dependencies = extractDependencies(code)
  const imports = filterRelevantImports(dependencies, fileImports)
  const variables = extractLocalVariables(code)

  return {
    name,
    code,
    isExported,
    dependencies,
    imports,
    variables,
    startLine: node.loc.start.line,
    endLine: node.loc.end.line
  }
}

function parseVariableDeclaration(node: any, content: string, isExported: boolean, parent: any): TVariable {
  const name = node.id.name
  const code = extractCodeFromNode(parent, content)

  return {
    name,
    value: node.init ? extractCodeFromNode(node.init, content) : '',
    type: node.id.typeAnnotation ? extractCodeFromNode(node.id.typeAnnotation, content) : undefined,
    isExported,
    startLine: parent.loc.start.line,
    endLine: parent.loc.end.line
  }
}

function extractCodeFromNode(node: any, content: string): string {
  if (!node || !node.range) return ''
  return content.slice(node.range[0], node.range[1])
}

function extractDependencies(code: string): string[] {
  const dependencies = new Set<string>()
  const identifierRegex = /\b[a-zA-Z_$][a-zA-Z0-9_$]*\b/g
  const matches = code.match(identifierRegex) || []

  matches.forEach(match => {
    if (!isKeyword(match) && !isBuiltIn(match)) {
      dependencies.add(match)
    }
  })

  return Array.from(dependencies)
}

function extractTypeDependencies(code: string): string[] {
  const dependencies = new Set<string>()
  const typeRegex = /\b[A-Z][a-zA-Z0-9_]*\b/g
  const matches = code.match(typeRegex) || []

  matches.forEach(match => {
    if (!isBuiltInType(match)) {
      dependencies.add(match)
    }
  })

  return Array.from(dependencies)
}

function extractLocalVariables(code: string): TVariable[] {
  const variables: TVariable[] = []
  const constRegex = /const\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*=\s*(.+?)(?=\n|$)/g
  let match

  while ((match = constRegex.exec(code)) !== null) {
    variables.push({
      name: match[1],
      value: match[2].trim(),
      isExported: false,
      startLine: 0,
      endLine: 0
    })
  }

  return variables
}

function filterRelevantImports(dependencies: string[], fileImports: TImport[]): TImport[] {
  return fileImports.filter(imp =>
    imp.imports.some(importName => dependencies.includes(importName)) ||
    (imp.namespace && dependencies.includes(imp.namespace))
  )
}

function isKeyword(word: string): boolean {
  const keywords = [
    'abstract', 'any', 'as', 'asserts', 'assert', 'async', 'await', 'boolean', 'break', 'case',
    'catch', 'class', 'const', 'constructor', 'continue', 'debugger', 'declare', 'default',
    'delete', 'do', 'else', 'enum', 'export', 'extends', 'false', 'finally', 'for', 'from',
    'function', 'get', 'if', 'implements', 'import', 'in', 'instanceof', 'interface', 'is',
    'keyof', 'let', 'module', 'namespace', 'never', 'new', 'null', 'number', 'object', 'of',
    'package', 'private', 'protected', 'public', 'readonly', 'require', 'return', 'set',
    'static', 'string', 'super', 'switch', 'symbol', 'this', 'throw', 'true', 'try', 'type',
    'typeof', 'undefined', 'unique', 'unknown', 'var', 'void', 'while', 'with', 'yield'
  ]
  return keywords.includes(word)
}

function isBuiltIn(word: string): boolean {
  const builtIns = [
    'console', 'JSON', 'Date', 'Math', 'Object', 'Array', 'String', 'Number', 'Boolean',
    'RegExp', 'Error', 'Promise', 'Map', 'Set', 'WeakMap', 'WeakSet', 'Symbol', 'BigInt'
  ]
  return builtIns.includes(word)
}

function isBuiltInType(word: string): boolean {
  const builtInTypes = [
    'String', 'Number', 'Boolean', 'Array', 'Object', 'Date', 'RegExp', 'Error', 'Promise',
    'Map', 'Set', 'WeakMap', 'WeakSet', 'Symbol', 'BigInt', 'Function', 'Record', 'Partial',
    'Required', 'Readonly', 'Pick', 'Omit', 'Exclude', 'Extract', 'NonNullable', 'Parameters',
    'ConstructorParameters', 'ReturnType', 'InstanceType', 'ThisParameterType', 'OmitThisParameter',
    'ThisType', 'Uppercase', 'Lowercase', 'Capitalize', 'Uncapitalize'
  ]
  return builtInTypes.includes(word)
}
