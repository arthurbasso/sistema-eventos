import { BaseService } from "./base.service"

import type { User } from "../types/User"

export class UserService extends BaseService<User> {
  constructor() {
    super('users')
  }
}
