import { User } from './user.type'
import { Subject } from './subject.type'

export interface Request {
  id: string
  user: User 
  subject: Subject 
  option: number
  description?: string
}