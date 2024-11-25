import type { User } from "./User"

export type Session = {
  id: number
  user_id: number
  token: string
  date: Date
  active?: boolean
  user?: User
}
