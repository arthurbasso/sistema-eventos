import { BaseService } from "./base.service"

import type { User } from "../types/User"

import { SessionService } from "./session.service"

export class UserService extends BaseService<User> {
  constructor() {
    super('users')
  }

  async getUserPassword(id: number): Promise<User> {
    const query = this.db.prepare(`SELECT * FROM users WHERE id = ?`)
    return query.get(id) as User
  }

  async changePassword(id: number, password: string): Promise<boolean> {
    const hashedPassword = await Bun.password.hash(password)
    const query = this.db.prepare(`UPDATE users SET password = ? WHERE id = ?`)
    let result = query.run(hashedPassword, id)

    return !!result.changes
  }

  async login(email: string, password: string): Promise<string | null> {
    const query = this.db.prepare(`SELECT * FROM users WHERE email = ?`)
    const user = query.get(email) as User

    if (user && await Bun.password.verify(password, user.password ?? '')) {
      const sessionService = new SessionService()
      return sessionService.createSession(user.id ?? 0)
    }

    return null
  }
}
