import { UserService } from "../services/users.service"
import { UserError } from "../enums/UserError"

import type { User } from "../types/User"

export class UserController {
  protected service: UserService

  constructor() {
    this.service = new UserService()
  }

  async getUsers() {
    try {
      let users: User[] | [] = await this.service.getAll()

      if (!users) {
        throw new Error('No users found')
      }

      users = users.map((user: User) => {
        delete user.password
        return user
      })

      return users
    } catch (e) {
      console.error(e)
    }
  }

  async getUserById(id: number) {
    try {
      let user: User | any = await this.service.getById(id)

      if (!user) {
        throw new Error('No user found')
      }

      delete user.password
      return user
    } catch (e) {
      console.error(e)
    }
  }

  async createUser(user: User) {
    delete user.id

    try {
      let newUser: number | bigint = await this.service.create(user)

      if (!newUser) {
        throw new Error(UserError.NotCreated)
      }

      return { id: newUser, ...user }
    } catch (e) {
      console.error(e)
    }
  }

  async updateUser(id: number, user: User) {
    delete user.id

    try {
      let updatedUser = await this.service.update(id, user)

      if (!updatedUser) {
        throw new Error(UserError.NotUpdated)
      }

      return updatedUser
    } catch (e) {
      console.error(e)
    }
  }

  async deleteUser(id: number) {
    try {
      let deletedUser = await this.service.delete(id)

      if (!deletedUser) {
        throw new Error(UserError.NotDeleted)
      }

      return deletedUser
    } catch (e) {
      console.error(e)
    }
  }
}
