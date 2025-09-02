import * as vscode from 'vscode'
import * as fs from 'fs'
import * as path from 'path'
import { parseFile } from './parser'
import { generateFiles } from './generator'

export async function migrateFolderToSeparationOfConcerns(uri: vscode.Uri) {
  const folderPath = uri.fsPath
  const stat = fs.statSync(folderPath)

  if (stat.isFile()) {
    await migrateFile(folderPath)
  } else if (stat.isDirectory()) {
    const files = fs.readdirSync(folderPath)
    for (const file of files) {
      const filePath = path.join(folderPath, file)
      const fileStat = fs.statSync(filePath)
      if (fileStat.isFile() && (file.endsWith('.ts') || file.endsWith('.js'))) {
        await migrateFile(filePath)
      }
    }
  }
}

async function migrateFile(filePath: string) {
  try {
    console.log(`Processing file: ${filePath}`)
    const content = fs.readFileSync(filePath, 'utf-8')
    const parsedData = parseFile(content, filePath)
    
    console.log(`Parsed data:`, {
      functions: parsedData.functions.length,
      types: parsedData.types.length,
      interfaces: parsedData.interfaces.length,
      classes: parsedData.classes.length,
      variables: parsedData.variables.length
    })

    const totalItems = parsedData.functions.length + parsedData.types.length + parsedData.interfaces.length + parsedData.classes.length
    const exportedItems = [
      ...parsedData.functions.filter(f => f.isExported),
      ...parsedData.types.filter(t => t.isExported),
      ...parsedData.interfaces.filter(i => i.isExported),
      ...parsedData.classes.filter(c => c.isExported)
    ]

    if (totalItems === 0) {
      const warningMsg = `No exportable items found in file: ${path.basename(filePath)}. File contains no functions, types, interfaces, or classes to migrate.`
      console.warn(`⚠️  ${warningMsg}`)
      vscode.window.showWarningMessage(`Migration Warning: ${warningMsg}`)
      return
    }

    if (exportedItems.length === 0) {
      const itemsList = []
      if (parsedData.functions.length > 0) itemsList.push(`${parsedData.functions.length} function(s)`)
      if (parsedData.types.length > 0) itemsList.push(`${parsedData.types.length} type(s)`)
      if (parsedData.interfaces.length > 0) itemsList.push(`${parsedData.interfaces.length} interface(s)`)
      if (parsedData.classes.length > 0) itemsList.push(`${parsedData.classes.length} class(es)`)
      
      const warningMsg = `No exported items found in file: ${path.basename(filePath)}. Found ${totalItems} item(s) but none are exported: ${itemsList.join(', ')}. Only exported items can be migrated.`
      console.warn(`⚠️  ${warningMsg}`)
      vscode.window.showWarningMessage(`Migration Warning: ${warningMsg}`)
      return
    }

    console.log(`✓ Found ${exportedItems.length} exported item(s) to migrate from: ${filePath}`)
    await generateFiles(parsedData, filePath)
    console.log(`✅ Files generated successfully for: ${filePath}`)
    
    // Show summary of what was migrated
    const migratedSummary = []
    if (parsedData.functions.some(f => f.isExported)) migratedSummary.push(`${parsedData.functions.filter(f => f.isExported).length} function(s)`)
    if (parsedData.types.some(t => t.isExported)) migratedSummary.push(`${parsedData.types.filter(t => t.isExported).length} type(s)`)
    if (parsedData.interfaces.some(i => i.isExported)) migratedSummary.push(`${parsedData.interfaces.filter(i => i.isExported).length} interface(s)`)
    if (parsedData.classes.some(c => c.isExported)) migratedSummary.push(`${parsedData.classes.filter(c => c.isExported).length} class(es)`)
    
    console.log(`📦 Successfully migrated: ${migratedSummary.join(', ')}`)
  } catch (error) {
    console.error(`❌ Error processing file ${filePath}:`, error)
    throw error
  }
}
