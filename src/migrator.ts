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
  const content = fs.readFileSync(filePath, 'utf-8')
  const parsedData = parseFile(content, filePath)

  if (parsedData.functions.length > 0 || parsedData.types.length > 0 || parsedData.interfaces.length > 0 || parsedData.classes.length > 0) {
    await generateFiles(parsedData, filePath)
  }
}
