// Simple test file for migration validation
type TUser = {
  id: number
  name: string
}

const API_URL = 'https://api.test.com'

export function getUser(id: number): TUser {
  return { id, name: `User ${id}` }
}

export function getUserUrl(id: number): string {
  return `${API_URL}/users/${id}`
}

export type TUserData = TUser & {
  url: string
}
