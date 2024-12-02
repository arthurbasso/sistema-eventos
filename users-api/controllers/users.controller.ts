import { UserService } from "../services/users.service"
import { UserError } from "../enums/UserError"

import type { User } from "../types/User"

import { sendEmail } from "../mail/mailer"

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
    delete user.offline

    try {
      const userWithDefaults = {
        ...user
      }

      if (user.password) userWithDefaults.password = await Bun.password.hash(user.password)

      let newUser: number | bigint = await this.service.create(userWithDefaults);

      if (!newUser) {
        throw new Error(UserError.NotCreated);
      }

      try {
        var text = ''
        if (user.password) {
          text = 'Your registration is complete!'
        } else {
          text = `Please finish your registration by clicking the link <a href="http://localhost:5173/finish/${user.email}">here</a>.`
        }
        await sendEmail(user.email, 'Welcome to Eventovates!', text);
      } catch (e) {
        console.error('Error sending email:', e);
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
      throw new Error(UserError.NotUpdated)
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
      throw new Error(UserError.NotDeleted)
    }
  }

  async changePassword(id: number, password: string, newPassword: string) {
    try {
      let userPassword: User = await this.service.getUserPassword(id)
      let isPasswordValid: boolean = userPassword.password ? await Bun.password.verify(password, userPassword.password) : true

      if (isPasswordValid) {
        let updatedPassword = await this.service.changePassword(id, newPassword)

        if (!updatedPassword) {
          throw new Error(UserError.NotUpdated)
        }

        sendEmail(userPassword.email, 'Password changed', 'Your password has been changed successfully')

        return updatedPassword
      } else {
        throw new Error(UserError.NotMatch)
      }
    } catch (e: any) {
      console.error(e)
      if (e.message === UserError.NotMatch) {
        throw new Error(UserError.NotMatch)
      } else {
        throw new Error(UserError.NotUpdated)
      }
    }
  }

  async login(email: string, password: string) {
    try {
      let token = await this.service.login(email, password)

      if (!token) {
        throw new Error(UserError.NotLoggedIn)
      }

      return token
    } catch (e) {
      console.error(e)
    }
  }
}
