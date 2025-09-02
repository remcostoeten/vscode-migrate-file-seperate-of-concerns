import * as fs from 'fs'
import * as path from 'path'
import { useState, useEffect } from 'react'

type TUser = {
  id: number
  name: string
  email: string
}

type TApiResponse = {
  data: TUser[]
  status: number
}

// Non-exported helper type that should be included
type TProps = {
  userId: number
  onSelect: (user: TUser) => void
}

// Non-exported constant that should be included with functions that use it
const API_BASE_URL = 'https://api.example.com'
const CACHE_DURATION = 5000

// Exported function that uses imports, types, and constants
export async function fetchUserData(userId: number): Promise<TApiResponse> {
  const [loading, setLoading] = useState(false)
  const url = `${API_BASE_URL}/users/${userId}`
  
  try {
    setLoading(true)
    const response = await fetch(url)
    const data = await response.json()
    
    return {
      data: data.users,
      status: response.status
    }
  } finally {
    setLoading(false)
  }
}

// Exported function that uses local types and variables
export function UserComponent({ userId, onSelect }: TProps) {
  const [users, setUsers] = useState<TUser[]>([])
  
  useEffect(() => {
    fetchUserData(userId).then(response => {
      setUsers(response.data)
    })
  }, [userId])
  
  function handleSelect(user: TUser) {
    onSelect(user)
  }
  
  return users.map(user => (
    <button key={user.id} onClick={() => handleSelect(user)}>
      {user.name} ({user.email})
    </button>
  ))
}

// Exported utility function
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Non-exported function that should NOT be migrated
function internalHelper(data: string) {
  return data.trim().toLowerCase()
}

// Exported type alias
export type TUserWithValidation = TUser & {
  isEmailValid: boolean
}

// Exported class
export class UserManager {
  private users: TUser[] = []
  
  addUser(user: TUser) {
    this.users.push(user)
  }
  
  findUser(id: number): TUser | undefined {
    return this.users.find(u => u.id === id)
  }
  
  validateAllEmails(): TUserWithValidation[] {
    return this.users.map(user => ({
      ...user,
      isEmailValid: validateEmail(user.email)
    }))
  }
}
