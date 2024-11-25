import { Router } from 'express'
import type { Request, Response } from 'express'

import type { User } from '../types/User'
const router = Router()

import { UserController } from '../controllers/users.controller'

const controller = new UserController()

router.get('/', async (req: Request, res: Response) => {
  let users: User[] | unknown = await controller.getUsers()

  res.status(200).send(users)
})

router.get('/:id', async (req: Request, res: Response) => {
  let userId: number = parseInt(req.params.id)
  let user: User | unknown = await controller.getUserById(userId)

  res.status(200).send(user)
})

export default router
