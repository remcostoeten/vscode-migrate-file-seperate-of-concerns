import * as fs from 'fs'
import * as path from 'path'
import { TParsed, TFunction, TClass, TImport } from './types'
import { getFileNameFromFunctionName, extractUsedVariables, extractUsedImports, generateImportStatement, isTypeImport } from './utils'

export async function generateFiles(parsedData: TParsed, originalFilePath: string) {
  console.log(`Starting file generation for: ${originalFilePath}`)

  const dirPath = path.dirname(originalFilePath)
  const baseName = path.basename(originalFilePath, path.extname(originalFilePath))
  const folderPath = path.join(dirPath, baseName)

  console.log(`Creating folder: ${folderPath}`)
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true })
    console.log(`Created folder: ${folderPath}`)
  }

  const exportStatements: string[] = []

  console.log(`Processing ${parsedData.functions.length} functions...`)
  for (const func of parsedData.functions) {
    const fileName = getFileNameFromFunctionName(func.name)
    const filePath = path.join(folderPath, fileName)
    const content = generateFunctionFile(func, parsedData)

    console.log(`Creating function file: ${filePath}`)
    fs.writeFileSync(filePath, content)
    exportStatements.push(`export * from './${fileName.replace('.ts', '')}'`)
  }

  console.log(`Processing ${parsedData.classes.length} classes...`)
  for (const cls of parsedData.classes) {
    const fileName = getFileNameFromFunctionName(cls.name)
    const filePath = path.join(folderPath, fileName)
    const content = generateClassFile(cls, parsedData)

    console.log(`Creating class file: ${filePath}`)
    fs.writeFileSync(filePath, content)
    exportStatements.push(`export * from './${fileName.replace('.ts', '')}'`)
  }

  console.log(`Processing ${parsedData.types.length} types...`)
  for (const type of parsedData.types) {
    const fileName = getFileNameFromFunctionName(type.name)
    const filePath = path.join(folderPath, fileName)
    const content = generateTypeFile(type, parsedData)

    console.log(`Creating type file: ${filePath}`)
    fs.writeFileSync(filePath, content)
    exportStatements.push(`export * from './${fileName.replace('.ts', '')}'`)
  }

  console.log(`Processing ${parsedData.interfaces.length} interfaces...`)
  for (const iface of parsedData.interfaces) {
    const fileName = getFileNameFromFunctionName(iface.name)
    const filePath = path.join(folderPath, fileName)
    const content = generateInterfaceFile(iface, parsedData)

    console.log(`Creating interface file: ${filePath}`)
    fs.writeFileSync(filePath, content)
    exportStatements.push(`export * from './${fileName.replace('.ts', '')}'`)
  }

  if (exportStatements.length > 0) {
    const indexPath = path.join(folderPath, 'index.ts')
    console.log(`Creating index file: ${indexPath}`)
    fs.writeFileSync(indexPath, exportStatements.join('\n') + '\n')
  }

  console.log(`File generation completed. Created ${exportStatements.length} files in: ${folderPath}`)
}

function generateFunctionFile(func: TFunction, parsedData: TParsed): string {
  const lines: string[] = []

  // Find local types that this function depends on
  const localTypes = findLocalTypeDependencies(func, parsedData)
  const localInterfaces = findLocalInterfaceDependencies(func, parsedData)

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

  // Add local types that this function depends on
  localTypes.forEach(type => {
    const exportKeyword = type.isExported ? 'export ' : ''
    lines.push(`${exportKeyword}${type.code}`)
  })

  localInterfaces.forEach(iface => {
    const exportKeyword = iface.isExported ? 'export ' : ''
    lines.push(`${exportKeyword}${iface.code}`)
  })

  if (localTypes.length > 0 || localInterfaces.length > 0) {
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

function findLocalTypeDependencies(func: TFunction, parsedData: TParsed) {
  const localTypes = []

  for (const typeName of func.dependencies) {
    const localType = parsedData.types.find(t => t.name === typeName)
    if (localType && !localTypes.some(lt => lt.name === localType.name)) {
      localTypes.push(localType)

      // Recursively find dependencies of this type
      const nestedDeps = findNestedTypeDependencies(localType, parsedData, new Set([localType.name]))
      nestedDeps.forEach(dep => {
        if (!localTypes.some(lt => lt.name === dep.name)) {
          localTypes.push(dep)
        }
      })
    }
  }

  return localTypes
}

function findLocalInterfaceDependencies(func: TFunction, parsedData: TParsed) {
  const localInterfaces = []

  for (const interfaceName of func.dependencies) {
    const localInterface = parsedData.interfaces.find(i => i.name === interfaceName)
    if (localInterface && !localInterfaces.some(li => li.name === localInterface.name)) {
      localInterfaces.push(localInterface)

      // Recursively find dependencies of this interface
      const nestedDeps = findNestedInterfaceDependencies(localInterface, parsedData, new Set([localInterface.name]))
      nestedDeps.forEach(dep => {
        if (!localInterfaces.some(li => li.name === dep.name)) {
          localInterfaces.push(dep)
        }
      })
    }
  }

  return localInterfaces
}

function findNestedTypeDependencies(type: any, parsedData: TParsed, visited: Set<string>): any[] {
  const nestedTypes = []

  for (const depName of type.dependencies) {
    if (visited.has(depName)) continue

    const nestedType = parsedData.types.find(t => t.name === depName)
    if (nestedType) {
      visited.add(depName)
      nestedTypes.push(nestedType)

      const deeperDeps = findNestedTypeDependencies(nestedType, parsedData, visited)
      nestedTypes.push(...deeperDeps)
    }
  }

  return nestedTypes
}

function findNestedInterfaceDependencies(iface: any, parsedData: TParsed, visited: Set<string>): any[] {
  const nestedInterfaces = []

  for (const depName of iface.dependencies) {
    if (visited.has(depName)) continue

    const nestedInterface = parsedData.interfaces.find(i => i.name === depName)
    if (nestedInterface) {
      visited.add(depName)
      nestedInterfaces.push(nestedInterface)

      const deeperDeps = findNestedInterfaceDependencies(nestedInterface, parsedData, visited)
      nestedInterfaces.push(...deeperDeps)
    }
  }

  return nestedInterfaces
}

function cleanFunctionCode(code: string): string {
  return code
    .replace(/^export\s+/, '')
    .replace(/^async\s+/, '')
    .trim()
}

