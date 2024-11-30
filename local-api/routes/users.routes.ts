import { Router } from 'express'
import type { Request, Response } from 'express'

import type { User } from '../types/User'
import { UserError } from '../enums/UserError'

const router = Router()

import { UserController } from '../controllers/users.controller'

const controller = new UserController()

router.get('/users', async (req: Request, res: Response) => {
  let users: User[] | unknown = await controller.getUsers()

  res.status(200).send(users)
})

router.get('/users/:id', async (req: Request, res: Response) => {
  let userId: number = parseInt(req.params.id)
  let user: User | unknown = await controller.getUserById(userId)

  res.status(200).send(user)
})

router.post('/users/', async (req: Request, res: Response) => {
  let user: User = req.body

  let newUser: User | unknown = await controller.createUser(user)

  res.status(201).send(newUser)
})

router.patch('/users/:id', async (req: Request, res: Response) => {
  let userId: number = parseInt(req.params.id)
  let user: User = req.body

  try {
    await controller.updateUser(userId, user)

    res.status(204).send()
  } catch (e: any) {
    if (e.message === UserError.NotUpdated) {
      res.status(404).send(e.message)
    }
  }
})

router.delete('/users/:id', async (req: Request, res: Response) => {
  let userId: number = parseInt(req.params.id)

  try {
    await controller.deleteUser(userId)

    res.status(204).send()
  } catch (e: any) {
    if (e.message === UserError.NotDeleted) {
      res.status(404).send(e.message)
    }
  }
})

export default router
