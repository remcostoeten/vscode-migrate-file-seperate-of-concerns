export type TImport = {
  source: string
  imports: string[]
  isTypeOnly: boolean
  isDefault: boolean
  namespace?: string
}

export type TVariable = {
  name: string
  value: string
  type?: string
  isExported: boolean
  startLine: number
  endLine: number
}

export type TFunction = {
  name: string
  code: string
  dependencies: string[]
  imports: TImport[]
  variables: TVariable[]
  isExported: boolean
  isAsync: boolean
  parameters: string[]
  returnType?: string
  startLine: number
  endLine: number
}

export type TType = {
  name: string
  code: string
  isExported: boolean
  dependencies: string[]
  startLine: number
  endLine: number
}

export type TInterface = {
  name: string
  code: string
  isExported: boolean
  dependencies: string[]
  startLine: number
  endLine: number
}

export type TClass = {
  name: string
  code: string
  isExported: boolean
  dependencies: string[]
  imports: TImport[]
  variables: TVariable[]
  startLine: number
  endLine: number
}

export type TParsed = {
  imports: TImport[]
  functions: TFunction[]
  types: TType[]
  interfaces: TInterface[]
  classes: TClass[]
  variables: TVariable[]
  filePath: string
}
