import { Router } from 'express'
import type { Request, Response } from 'express'

import type { Event } from '../types/Event'
import { EventError } from '../enums/EventError'

const router = Router()

import { EventController } from '../controllers/events.controller'

const controller = new EventController()

router.get('/events', async (req: Request, res: Response) => {
  let events: Event[] | unknown = await controller.getEvents()

  res.status(200).send(events)
})

router.get('/events/:id', async (req: Request, res: Response) => {
  let eventId: number = parseInt(req.params.id)
  let event: Event | unknown = await controller.getEventById(eventId)

  res.status(200).send(event)
})

export default router
