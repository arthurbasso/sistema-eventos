import { UserService } from "../services/users.service"
import type { User } from "../types/User"

export class UserController {
  protected service: UserService

  constructor() {
    this.service = new UserService()
  }

  async getUsers() {
    try {
      let users: User[] | unknown = await this.service.getAll()

      if (!users) {
        throw new Error('No users found')
      }

      return users
    } catch (e) {
      console.error(e)
    }
  }

  async getUserById(id: number) {
    try {
      let user: User | unknown = await this.service.getById(id)

      if (!user) {
        throw new Error('No user found')
      }

      return user
    } catch (e) {
      console.error(e)
    }
  }

  async updateUser(id: number, user: User) {
    try {

    } catch (e) {
      console.error(e)
    }
  }
}
