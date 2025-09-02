import * as fs from 'fs'
import * as path from 'path'
import { TParsed, TFunction, TClass, TImport } from './types'
import { getFileNameFromFunctionName, extractUsedVariables, extractUsedImports, generateImportStatement, isTypeImport } from './utils'

export async function generateFiles(parsedData: TParsed, originalFilePath: string) {
  const dirPath = path.dirname(originalFilePath)
  const baseName = path.basename(originalFilePath, path.extname(originalFilePath))
  const folderPath = path.join(dirPath, baseName)

  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true })
  }

  const exportStatements: string[] = []

  for (const func of parsedData.functions) {
    const fileName = getFileNameFromFunctionName(func.name)
    const filePath = path.join(folderPath, fileName)
    const content = generateFunctionFile(func, parsedData)

    fs.writeFileSync(filePath, content)
    exportStatements.push(`export * from './${fileName.replace('.ts', '')}'`)
  }

  for (const cls of parsedData.classes) {
    const fileName = getFileNameFromFunctionName(cls.name)
    const filePath = path.join(folderPath, fileName)
    const content = generateClassFile(cls, parsedData)

    fs.writeFileSync(filePath, content)
    exportStatements.push(`export * from './${fileName.replace('.ts', '')}'`)
  }

  for (const type of parsedData.types) {
    const fileName = getFileNameFromFunctionName(type.name)
    const filePath = path.join(folderPath, fileName)
    const content = generateTypeFile(type, parsedData)

    fs.writeFileSync(filePath, content)
    exportStatements.push(`export * from './${fileName.replace('.ts', '')}'`)
  }

  for (const iface of parsedData.interfaces) {
    const fileName = getFileNameFromFunctionName(iface.name)
    const filePath = path.join(folderPath, fileName)
    const content = generateInterfaceFile(iface, parsedData)

    fs.writeFileSync(filePath, content)
    exportStatements.push(`export * from './${fileName.replace('.ts', '')}'`)
  }

  if (exportStatements.length > 0) {
    const indexPath = path.join(folderPath, 'index.ts')
    fs.writeFileSync(indexPath, exportStatements.join('\n') + '\n')
  }
}

function generateFunctionFile(func: TFunction, parsedData: TParsed): string {
  const lines: string[] = []

  const usedVarNames = parsedData.variables.map(v => v.name)
  const usedVariables = extractUsedVariables(func.code, usedVarNames)
  const relevantVariables = parsedData.variables.filter(v => usedVariables.includes(v.name))
  const usedImports = extractUsedImports(func.code, func.imports)

  const typeImports: TImport[] = []
  const regularImports: TImport[] = []

  usedImports.forEach(imp => {
    const typeOnlyImports = imp.imports.filter((name: string) => isTypeImport(name))
    const regularOnlyImports = imp.imports.filter((name: string) => !isTypeImport(name))

    if (typeOnlyImports.length > 0) {
      typeImports.push({
        ...imp,
        imports: typeOnlyImports,
        isTypeOnly: true
      })
    }

    if (regularOnlyImports.length > 0) {
      regularImports.push({
        ...imp,
        imports: regularOnlyImports,
        isTypeOnly: false
      })
    }
  })

  typeImports.forEach(imp => {
    lines.push(generateImportStatement(imp))
  })

  regularImports.forEach(imp => {
    lines.push(generateImportStatement(imp))
  })

  if (usedImports.length > 0) {
    lines.push('')
  }

  relevantVariables.forEach(variable => {
    const exportKeyword = variable.isExported ? 'export ' : ''
    lines.push(`${exportKeyword}const ${variable.name} = ${variable.value}`)
  })

  if (relevantVariables.length > 0) {
    lines.push('')
  }

  const exportKeyword = func.isExported ? 'export ' : ''
  const asyncKeyword = func.isAsync ? 'async ' : ''

  const cleanedCode = cleanFunctionCode(func.code)
  lines.push(`${exportKeyword}${asyncKeyword}${cleanedCode}`)

  return lines.join('\n')
}

function generateClassFile(cls: TClass, parsedData: TParsed): string {
  const lines: string[] = []

  const usedVarNames = parsedData.variables.map(v => v.name)
  const usedVariables = extractUsedVariables(cls.code, usedVarNames)
  const relevantVariables = parsedData.variables.filter(v => usedVariables.includes(v.name))
  const usedImports = extractUsedImports(cls.code, cls.imports)

  usedImports.forEach(imp => {
    lines.push(generateImportStatement(imp))
  })

  if (usedImports.length > 0) {
    lines.push('')
  }

  relevantVariables.forEach(variable => {
    const exportKeyword = variable.isExported ? 'export ' : ''
    lines.push(`${exportKeyword}const ${variable.name} = ${variable.value}`)
  })

  if (relevantVariables.length > 0) {
    lines.push('')
  }

  const exportKeyword = cls.isExported ? 'export ' : ''
  lines.push(`${exportKeyword}${cls.code}`)

  return lines.join('\n')
}

function generateTypeFile(type: any, parsedData: TParsed): string {
  const lines: string[] = []

  const usedImports = parsedData.imports.filter(imp =>
    type.dependencies.some((dep: string) => imp.imports.includes(dep))
  )

  usedImports.forEach(imp => {
    lines.push(generateImportStatement(imp))
  })

  if (usedImports.length > 0) {
    lines.push('')
  }

  const exportKeyword = type.isExported ? 'export ' : ''
  lines.push(`${exportKeyword}${type.code}`)

  return lines.join('\n')
}

function generateInterfaceFile(iface: any, parsedData: TParsed): string {
  const lines: string[] = []

  const usedImports = parsedData.imports.filter(imp =>
    iface.dependencies.some((dep: string) => imp.imports.includes(dep))
  )

  usedImports.forEach(imp => {
    lines.push(generateImportStatement(imp))
  })

  if (usedImports.length > 0) {
    lines.push('')
  }

  const exportKeyword = iface.isExported ? 'export ' : ''
  lines.push(`${exportKeyword}${iface.code}`)

  return lines.join('\n')
}

function cleanFunctionCode(code: string): string {
  return code
    .replace(/^export\s+/, '')
    .replace(/^async\s+/, '')
    .trim()
}
