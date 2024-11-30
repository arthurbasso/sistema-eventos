import { BaseService } from "./base.service"

import type { Register } from "../types/Register"

export class RegisterService extends BaseService<Register> {
  constructor() {
    super('registers')
  }
}
