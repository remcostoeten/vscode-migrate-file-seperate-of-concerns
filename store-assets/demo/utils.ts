import { useState, useEffect } from 'react'
import * as fs from 'fs'

type TUser = {
  id: number
  name: string
  email: string
}

type TApiResponse = {
  data: TUser[]
  status: number
}

const API_BASE_URL = 'https://api.example.com'

// Exported function - will be migrated
export function fetchUserData(userId: number): Promise<TApiResponse> {
  const url = `${API_BASE_URL}/users/${userId}`
  
  return fetch(url).then(response => response.json())
}

// Exported function - will be migrated  
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Exported class - will be migrated
export class UserManager {
  private users: TUser[] = []
  
  addUser(user: TUser) {
    this.users.push(user)
  }
  
  validateAllEmails(): boolean[] {
    return this.users.map(user => validateEmail(user.email))
  }
}

// Exported type - will be migrated
export type TUserWithValidation = TUser & {
  isEmailValid: boolean
}

// Private function - will NOT be migrated
function internalHelper(data: string) {
  return data.trim().toLowerCase()
}
