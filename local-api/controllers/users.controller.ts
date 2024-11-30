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
    delete user.id;
  
    try {
      const userWithDefaults = {
        ...user,
        synchronized: user.synchronized ?? false,
      };
  
      let newUser: number | bigint = await this.service.create(userWithDefaults);
  
      if (!newUser) {
        throw new Error(UserError.NotCreated);
      }
  
      return { id: newUser, ...userWithDefaults };
    } catch (e) {
      console.error(e);
      throw new Error(UserError.NotCreated);
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
