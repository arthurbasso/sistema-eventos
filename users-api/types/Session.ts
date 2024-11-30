import type { User } from './User.ts';

export type Session = {
    id?: number
    user_id: number
    user?: User
    token: string
    date?: Date
    expiration?: Date
    active?: boolean
}