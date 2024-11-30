import { EventService } from "../services/events.service"
import { EventError } from "../enums/EventError"

import type { Event } from "../types/Event"

export class EventController {
  protected service: EventService

  constructor() {
    this.service = new EventService()
  }

  async getEvents() {
    try {
      let events: Event[] | [] = await this.service.getAll()

      if (!events) {
        throw new Error('No events found')
      }

      return events
    } catch (e) {
      console.error(e)
    }
  }

  async getEventById(id: number) {
    try {
      let event: Event | any = await this.service.getById(id)

      if (!event) {
        throw new Error('No event found')
      }

      delete event.password
      return event
    } catch (e) {
      console.error(e)
    }
  }
}
