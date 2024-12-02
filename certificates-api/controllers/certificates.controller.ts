import { CertificateService } from "../services/certificates.service"
import { CertificateError } from "../enums/CertificateError"

import type { Certificate } from "../types/Certificate"

export class CertificateController {
  protected service: CertificateService

  constructor() {
    this.service = new CertificateService()
  }

  async getCertificates() {
    try {
      let certificates: Certificate[] | [] = await this.service.getAll()

      if (!certificates) {
        throw new Error('No certificates found')
      }

      return certificates
    } catch (e) {
      console.error(e)
    }
  }

  async getCertificateById(id: number) {
    try {
      let certificate: Certificate | any = await this.service.getById(id)

      if (!certificate) {
        throw new Error('No certificates found')
      }

      delete certificate.password
      return certificate
    } catch (e) {
      console.error(e)
    }
  }

  async createCertificate(certificate: Certificate) {
    try {
      const certificateWithDefaults = {
        user_id: certificate.user_id,
        event_id: certificate.event_id,
        date: certificate.date,
        auth_token: certificate.auth_token,
      };
  
      let newCertificate: number | bigint = await this.service.create(certificateWithDefaults);
  
      if (!newCertificate) {
        throw new Error(CertificateError.NotCreated);
      }
  
      return { id: newCertificate, ...certificateWithDefaults };
    } catch (e) {
      console.error(e);
      throw new Error(CertificateError.NotCreated);
    }
  }

  async updateCertificate(id: number, certificate: Certificate) {
    delete certificate.id

    try {
      let updatedCertificate = await this.service.update(id, certificate)

      if (!updatedCertificate) {
        throw new Error(CertificateError.NotUpdated)
      }

      return updatedCertificate
    } catch (e) {
      console.error(e)
    }
  }

  async deleteCertificate(id: number) {
    try {
      let deletedCertificate = await this.service.delete(id)

      if (!deletedCertificate) {
        throw new Error(CertificateError.NotDeleted)
      }

      return deletedCertificate
    } catch (e) {
      console.error(e)
    }
  }
}
