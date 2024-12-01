import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3002",
  headers: {
    // Overwrite Axios's automatically set Content-Type
    'Content-Type': 'application/json'
  }
});

class EventsApi {
  async getEvents() {
    return api.get("/events");
  }

  async getEvent(eventId) {
    return api.get(`/events/${eventId}`);
  }

  async createEvent(event) {
    return api.post("/events", event);
  }

  async updateEvent(event) {
    return api.put(`/events/${event.id}`, event);
  }

  async deleteEvent(eventId) {
    return api.delete(`/events/${eventId}`);
  }

}

export default new EventsApi();
