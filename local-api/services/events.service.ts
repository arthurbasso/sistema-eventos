import { BaseService } from "./base.service"

import type { Event } from "../types/Event"

export class EventService extends BaseService<Event> {
  constructor() {
    super('events')
  }
}
