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

    if (parsedData.functions.length > 0 || parsedData.types.length > 0 || parsedData.interfaces.length > 0 || parsedData.classes.length > 0) {
      console.log(`Generating files for: ${filePath}`)
      await generateFiles(parsedData, filePath)
      console.log(`Files generated successfully for: ${filePath}`)
    } else {
      console.log(`No functions/types/interfaces/classes found in: ${filePath}`)
    }
  } catch (error) {
    console.error(`Error processing file ${filePath}:`, error)
    throw error
  }
}
