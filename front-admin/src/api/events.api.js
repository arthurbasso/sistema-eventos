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


  async getRegistrations() {
    return api.get("/registrations");
  }

  async getRegistration(registrationId) {
    return api.get(`/registrations/${registrationId}`);
  }

  async getRegistrationsByUserId(userId) {
    return api.get(`/registrations/user/${userId}`);
  }

  async getRegistrationsByEventId(eventId) {
    return api.get(`/registrations/event/${eventId}`);
  }

  async createRegistration(registration) {
    return api.post("/registrations", registration);
  }

  async deleteRegistration(registrationId) {
    return api.delete(`/registrations/${registrationId}`);
  }

  async registerPresence(registrationId) {
    return api.put(`/checkin/${registrationId}`);
  }

  async cancelRegistration(registrationId) {
    return api.put(`/cancel/${registrationId}`);
  }

}

export default new EventsApi();
