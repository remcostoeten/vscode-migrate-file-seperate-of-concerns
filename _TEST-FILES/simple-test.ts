import * as fs from 'fs'
import * as path from 'path'
import { useState, useEffect } from 'react'

// Non-exported types that should be included with functions
type TUser = {
  id: number
  name: string
  email: string
}

type TApiResponse = {
  data: TUser[]
  status: number
}

// Non-exported constant that should be included
const API_BASE_URL = 'https://api.example.com'
const CACHE_DURATION = 5000

// Exported function that uses imports, types, and constants
export async function fetchUserData(userId: number): Promise<TApiResponse> {
  const url = `${API_BASE_URL}/users/${userId}`
  
  try {
    const response = await fetch(url)
    const data = await response.json()
    
    return {
      data: data.users,
      status: response.status
    }
  } catch (error) {
    throw new Error(`Failed to fetch user data: ${error}`)
  }
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

// Exported function that uses other functions and types
export function createValidatedUser(id: number, name: string, email: string): TUserWithValidation {
  return {
    id,
    name,
    email,
    isEmailValid: validateEmail(email)
  }
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
