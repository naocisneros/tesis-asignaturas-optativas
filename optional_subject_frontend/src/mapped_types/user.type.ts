
export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
}

export interface User {
  id: string
  email: string
  username: string
  name: string
  role: UserRole
  isActive: boolean
  country?: string
  createdAt: Date | string
  updatedAt: Date | string
  faculty: string 
}