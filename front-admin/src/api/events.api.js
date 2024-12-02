import axios from "axios";
import { useAppStore } from "@/stores/app.store";

const api = axios.create({
  baseURL: "http://localhost:3002",
  headers: {
    'Content-Type': 'application/json'
  }
});

class EventsApi {
  async getEvents() {
    const appStore = useAppStore()
    if (appStore.isOffline) {
      return { data: JSON.parse(localStorage.getItem("events") || '[]') };
    } else {
      return api.get("/events");
    }
  }

  async getEvent(eventId) {
    const appStore = useAppStore()
    if (appStore.isOffline) {
      return { data: JSON.parse(localStorage.getItem("events") || '[]').find(event => event.id === eventId) || {} };
    } else {
      return api.get(`/events/${eventId}`);
    }
  }

  async createEvent(event) {
    const appStore = useAppStore()
    if (appStore.isOffline) {
      const events = JSON.parse(localStorage.getItem("events") || "[]");

      event.id = events[events.length - 1]?.id + 1
      event.offline = true

      events.push(event);
      localStorage.setItem("events", JSON.stringify(events));

      return { data: event };
    } else {
      return api.post("/events", event);
    }
  }

  async updateEvent(id, event) {
    return api.put(`/events/${id}`, event);
  }

  async deleteEvent(eventId) {
    const appStore = useAppStore()
    if (appStore.isOffline) {
      var events = JSON.parse(localStorage.getItem("events") || "[]");

      events = events.map(event => event.id !== eventId)

      localStorage.setItem("events", JSON.stringify(events));

      return { data: {} };
    } else {
      return api.delete(`/events/${eventId}`);
    }
  }


  async getRegistrations() {
    const appStore = useAppStore()
    if (appStore.isOffline) {
      return { data: JSON.parse(localStorage.getItem("participants") || '[]') };
    } else {
      return api.get("/registrations");
    }
  }

  async getRegistration(registrationId) {
    const appStore = useAppStore()
    if (appStore.isOffline) {
      return { data: JSON.parse(localStorage.getItem("participants") || '[]').find(participant => participant.id === registrationId) || {} };
    } else {
      return api.get(`/registrations/${registrationId}`);
    }
  }

  async getRegistrationsByUserId(userId) {
    return api.get(`/registrations/user/${userId}`);
  }

  async getRegistrationsByEventId(eventId) {
    const appStore = useAppStore()
    if (appStore.isOffline) {
      return { data: JSON.parse(localStorage.getItem("participants") || '[]').filter(participant => participant.event_id === eventId) || [] };
    } else {
      return api.get(`/registrations/event/${eventId}`);
    }
  }

  async createRegistration(registration) {
    const appStore = useAppStore()
    if (appStore.isOffline) {
      const participants = JSON.parse(localStorage.getItem("participants") || "[]");

      registration.id = participants[participants.length - 1]?.id + 1
      registration.offline = true

      participants.push(registration);
      localStorage.setItem("participants", JSON.stringify(participants));

      return { data: registration };
    } else {
      return api.post("/registrations", registration);
    }
  }

  async deleteRegistration(registrationId) {
    return api.delete(`/registrations/${registrationId}`);
  }

  async registerPresence(registrationId, user_id) {
    return api.put(`/checkin/${registrationId}`, { user_id });
  }

  async cancelRegistration(registrationId) {
    return api.put(`/cancel/${registrationId}`);
  }

}

export default new EventsApi();
