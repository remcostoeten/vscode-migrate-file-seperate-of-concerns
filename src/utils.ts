export function convertToKebabCase(str: string): string {
  return str
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .toLowerCase()
}

export function getFileNameFromFunctionName(functionName: string): string {
  return convertToKebabCase(functionName) + '.ts'
}

export function extractUsedVariables(code: string, availableVariables: string[]): string[] {
  const usedVars = new Set<string>()

  availableVariables.forEach(varName => {
    const regex = new RegExp(`\\b${varName}\\b`, 'g')
    if (regex.test(code)) {
      usedVars.add(varName)
    }
  })

  return Array.from(usedVars)
}

export function extractUsedImports(code: string, imports: any[]): any[] {
  return imports.filter(imp => {
    return imp.imports.some((importName: string) => {
      const regex = new RegExp(`\\b${importName}\\b`, 'g')
      return regex.test(code)
    }) || (imp.namespace && new RegExp(`\\b${imp.namespace}\\b`, 'g').test(code))
  })
}

export function generateImportStatement(imp: any): string {
  const { source, imports, isTypeOnly, isDefault, namespace } = imp

  if (namespace) {
    return `import ${isTypeOnly ? 'type ' : ''}* as ${namespace} from '${source}'`
  }

  if (isDefault) {
    return `import ${isTypeOnly ? 'type ' : ''}${imports[0]} from '${source}'`
  }

  if (imports.length === 0) {
    return `import '${source}'`
  }

  const importList = imports.join(', ')
  return `import ${isTypeOnly ? 'type ' : ''}{ ${importList} } from '${source}'`
}

export function isTypeImport(importName: string): boolean {
  return /^[A-Z]/.test(importName) && importName !== importName.toUpperCase()
}
