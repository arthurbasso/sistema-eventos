import { Router } from 'express'
import type { Request, Response } from 'express'

import type { User } from '../types/User'
import { UserError } from '../enums/UserError'

const router = Router()

import { UserController } from '../controllers/users.controller'

const controller = new UserController()

router.get('/', async (req: Request, res: Response) => {
  try {
    let users: User[] | unknown = await controller.getUsers()

    res.status(200).send(users)
  } catch (e: any) {
    res.status(500).send('Internal server error')
  }
})

router.get('/:id', async (req: Request, res: Response) => {
  let userId: number = parseInt(req.params.id)

  try {
    let user: User | unknown = await controller.getUserById(userId)

    res.status(200).send(user)
  } catch (e: any) {
    if (e.message === UserError.NotFound) {
      res.status(404).send(e.message)
    } else {
      res.status(500).send('Internal server error')
    }
  }
})

router.post('/', async (req: Request, res: Response) => {
  let user: User = req.body

  try {
    var user_password = user?.password
    delete user.password

    let newUser: User | unknown = await controller.createUser(user)

    if (user_password) {
      await controller.changePassword(newUser.id, '', user_password)
    }

    res.status(201).send(newUser)
  } catch (e: any) {
    if (e.message === UserError.NotCreated) {
      res.status(400).send(e.message)
    } else {
      res.status(500).send('Internal server error')
    }
  }
})

router.put('/:id', async (req: Request, res: Response) => {
  let userId: number = parseInt(req.params.id)
  let user: User = req.body

  delete user.id
  delete user.offline

  try {
    await controller.updateUser(userId, user)

    res.status(204).send()
  } catch (e: any) {
    if (e.message === UserError.NotUpdated) {
      res.status(404).send(e.message)
    } else {
      res.status(500).send('Internal server error')
    }
  }
})

router.delete('/:id', async (req: Request, res: Response) => {
  let userId: number = parseInt(req.params.id)

  try {
    await controller.deleteUser(userId)

    res.status(204).send()
  } catch (e: any) {
    if (e.message === UserError.NotDeleted) {
      res.status(404).send(e.message)
    } else {
      res.status(500).send('Internal server error')
    }
  }
})

router.post('/:id/change-password', async (req: Request, res: Response) => {
  let userId: number = parseInt(req.params.id)
  let { password, new_password } = req.body
  try {
    await controller.changePassword(userId, password, new_password)

    res.status(204).send()
  } catch (e: any) {
    res.status(500).send('Internal server error')
  }
})

router.post('/login', async (req: Request, res: Response) => {
  let { email, password } = req.body

  let token: string | unknown = await controller.login(email, password)

  if (token) {
    res.status(200).send(token)
  } else {
    res.status(401).send('Invalid credentials')
  }
})

export default router
