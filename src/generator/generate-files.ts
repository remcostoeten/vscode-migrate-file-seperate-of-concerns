export async function generateFiles(parsedData: TParsed, originalFilePath: string) {
  console.log(`🚀 Starting file generation for: ${originalFilePath}`)
  
  const dirPath = path.dirname(originalFilePath)
  const baseName = path.basename(originalFilePath, path.extname(originalFilePath))
  const folderPath = path.join(dirPath, baseName)

  console.log(`📁 Creating folder: ${folderPath}`)
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true })
    console.log(`✅ Created folder: ${folderPath}`)
  }

  const exportStatements: string[] = []
  const migrationDetails: string[] = []

  // Filter only exported items
  const exportedFunctions = parsedData.functions.filter(f => f.isExported)
  const exportedClasses = parsedData.classes.filter(c => c.isExported)
  const exportedTypes = parsedData.types.filter(t => t.isExported)
  const exportedInterfaces = parsedData.interfaces.filter(i => i.isExported)

  console.log(`🔧 Processing ${exportedFunctions.length} exported functions...`)
  for (const func of exportedFunctions) {
    const fileName = getFileNameFromFunctionName(func.name)
    const filePath = path.join(folderPath, fileName)
    const content = generateFunctionFile(func, parsedData)
    
    // Analyze what was included
    const localTypes = findLocalTypeDependencies(func, parsedData)
    const localInterfaces = findLocalInterfaceDependencies(func, parsedData)
    const includedTypes = localTypes.length + localInterfaces.length

    console.log(`  📄 Creating function file: ${fileName}${includedTypes > 0 ? ` (+ ${includedTypes} local type${includedTypes > 1 ? 's' : ''})` : ''}`)
    fs.writeFileSync(filePath, content)
    exportStatements.push(`export * from './${fileName.replace('.ts', '')}'`)
    
    migrationDetails.push(`Function '${func.name}' -> ${fileName}${includedTypes > 0 ? ` (included ${includedTypes} local type dependencies)` : ''}`)
  }

  console.log(`🏗️  Processing ${exportedClasses.length} exported classes...`)
  for (const cls of exportedClasses) {
    const fileName = getFileNameFromFunctionName(cls.name)
    const filePath = path.join(folderPath, fileName)
    const content = generateClassFile(cls, parsedData)

    console.log(`  📄 Creating class file: ${fileName}`)
    fs.writeFileSync(filePath, content)
    exportStatements.push(`export * from './${fileName.replace('.ts', '')}'`)
    
    migrationDetails.push(`Class '${cls.name}' -> ${fileName}`)
  }

  console.log(`🏷️  Processing ${exportedTypes.length} exported types...`)
  for (const type of exportedTypes) {
    const fileName = getFileNameFromFunctionName(type.name)
    const filePath = path.join(folderPath, fileName)
    const content = generateTypeFile(type, parsedData)

    console.log(`  📄 Creating type file: ${fileName}`)
    fs.writeFileSync(filePath, content)
    exportStatements.push(`export * from './${fileName.replace('.ts', '')}'`)
    
    migrationDetails.push(`Type '${type.name}' -> ${fileName}`)
  }

  console.log(`🔌 Processing ${exportedInterfaces.length} exported interfaces...`)
  for (const iface of exportedInterfaces) {
    const fileName = getFileNameFromFunctionName(iface.name)
    const filePath = path.join(folderPath, fileName)
    const content = generateInterfaceFile(iface, parsedData)

    console.log(`  📄 Creating interface file: ${fileName}`)
    fs.writeFileSync(filePath, content)
    exportStatements.push(`export * from './${fileName.replace('.ts', '')}'`)
    
    migrationDetails.push(`Interface '${iface.name}' -> ${fileName}`)
  }

  // Show warnings for non-exported items that weren't migrated
  const nonExportedFunctions = parsedData.functions.filter(f => !f.isExported)
  const nonExportedClasses = parsedData.classes.filter(c => !c.isExported)
  const nonExportedTypes = parsedData.types.filter(t => !t.isExported)
  const nonExportedInterfaces = parsedData.interfaces.filter(i => !i.isExported)
  
  // Find which non-exported types were actually included as dependencies
  const includedNonExportedTypes = new Set<string>()
  exportedFunctions.forEach(func => {
    const localTypes = findLocalTypeDependencies(func, parsedData)
    const localInterfaces = findLocalInterfaceDependencies(func, parsedData)
    localTypes.forEach(type => {
      if (!type.isExported) includedNonExportedTypes.add(type.name)
    })
    localInterfaces.forEach(iface => {
      if (!iface.isExported) includedNonExportedTypes.add(iface.name)
    })
  })
  
  const trulyUnmigrated = [
    ...nonExportedFunctions,
    ...nonExportedClasses,
    ...nonExportedTypes.filter(t => !includedNonExportedTypes.has(t.name)),
    ...nonExportedInterfaces.filter(i => !includedNonExportedTypes.has(i.name))
  ]

  if (trulyUnmigrated.length > 0) {
    console.warn(`⚠️  Note: ${trulyUnmigrated.length} non-exported item(s) were not migrated (not used by any exported function):`)
    trulyUnmigrated.forEach(item => {
      const itemType = 'isAsync' in item ? 'function' : 'dependencies' in item ? (item.code.includes('interface') ? 'interface' : item.code.includes('type') ? 'type' : 'class') : 'unknown'
      console.warn(`    • ${itemType}: ${item.name} (not exported, so not migrated)`)
    })
  }
  
  if (includedNonExportedTypes.size > 0) {
    console.log(`✓ ${includedNonExportedTypes.size} non-exported type(s) were automatically included as dependencies: ${Array.from(includedNonExportedTypes).join(', ')}`)
  }

  if (exportStatements.length > 0) {
    const indexPath = path.join(folderPath, 'index.ts')
    console.log(`📋 Creating index file: index.ts`)
    fs.writeFileSync(indexPath, exportStatements.join('\n') + '\n')
  }

  console.log(`\n🎉 File generation completed successfully!`)
  console.log(`📦 Created ${exportStatements.length} files in: ${folderPath}`)
  console.log(`\n📊 Migration Summary:`)
  migrationDetails.forEach(detail => console.log(`  • ${detail}`))
  
  if (exportStatements.length === 0) {
    console.warn(`⚠️  Warning: No files were created. This usually means no exported items were found.`)
  }
}