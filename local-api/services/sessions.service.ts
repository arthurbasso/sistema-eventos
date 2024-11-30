import { BaseService } from "./base.service"

import type { Session } from "../types/Session"

export class SessionService extends BaseService<Session> {
  constructor() {
    super('users')
  }
}
