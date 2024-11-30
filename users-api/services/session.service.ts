import type { Session } from "../types/Session";
import { BaseService } from "./base.service";
import jwt from 'jsonwebtoken'

export class SessionService extends BaseService<Session> {
    constructor() {
        super('sessions')
    }

    async getSessionByToken(token: string): Promise<Session> {
        const query = this.db.prepare(`SELECT * FROM sessions WHERE token = ?`)
        return query.get(token) as Session
    }

    async createSession(userId: number): Promise<string> {
        const token = jwt.sign({ userId }, 'secret', { expiresIn: '1h' })
        const currentTimestamp = new Date().toISOString()
        const expiration = new Date(new Date().getTime() + 60 * 60 * 1000).toISOString()

        const query = this.db.prepare(`INSERT INTO sessions (user_id, token, date, expiration) VALUES (?, ?, ?, ?)`)
        query.run(userId, token, currentTimestamp, expiration)

        return token
    }

    async verifySession(token: string): Promise<boolean> {
        try {
            jwt.verify(token, 'secret')
            const session = await this.getSessionByToken(token)

            return !!session && new Date(session.expiration ?? '') > new Date()
        } catch (error) {
            return false
        }
    }
}