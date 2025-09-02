import * as vscode from 'vscode'
import { migrateFolderToSeparationOfConcerns } from './migrator'

export function activate(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand(
    'separationOfConcerns.migrate',
    async (uri: vscode.Uri) => {
      try {
        await migrateFolderToSeparationOfConcerns(uri)
        vscode.window.showInformationMessage('Migration completed successfully!')
      } catch (error) {
        vscode.window.showErrorMessage(`Migration failed: ${error}`)
      }
    }
  )

  context.subscriptions.push(disposable)
}

export function deactivate() { }
