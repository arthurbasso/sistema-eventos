import { BaseService } from "./base.service"

import type { Certificate } from "../types/Certificate"

export class CertificateService extends BaseService<Certificate> {
  constructor() {
    super('certificates')
  }
}
