import { Router } from 'express'
import type { Request, Response } from 'express'

import type { Certificate } from '../types/Certificate'
import { CertificateError } from '../enums/CertificateError'

const router = Router()

import { CertificateController } from '../controllers/certificates.controller'

const controller = new CertificateController()

router.get('/', async (req: Request, res: Response) => {
  let certificates: Certificate[] | unknown = await controller.getCertificates()

  res.status(200).send(certificates)
})

router.get('/:id', async (req: Request, res: Response) => {
  let certificateId: number = parseInt(req.params.id)
  let certificate: Certificate | unknown = await controller.getCertificateById(certificateId)

  res.status(200).send(certificate)
})

router.post('/', async (req: Request, res: Response) => {
  let certificate: Certificate = req.body

  let newCertificate: Certificate | unknown = await controller.createCertificate(certificate)

  res.status(201).send(newCertificate)
})

router.patch('/:id', async (req: Request, res: Response) => {
  let certificateId: number = parseInt(req.params.id)
  let certificate: Certificate = req.body

  try {
    await controller.updateCertificate(certificateId, certificate)

    res.status(204).send()
  } catch (e: any) {
    if (e.message === CertificateError.NotUpdated) {
      res.status(404).send(e.message)
    }
  }
})

router.delete('/:id', async (req: Request, res: Response) => {
  let certificateId: number = parseInt(req.params.id)

  try {
    await controller.deleteCertificate(certificateId)

    res.status(204).send()
  } catch (e: any) {
    if (e.message === CertificateError.NotDeleted) {
      res.status(404).send(e.message)
    }
  }
})

export default router
