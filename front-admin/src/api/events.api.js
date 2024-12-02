import axios from "axios";
import { useAppStore } from "@/stores/app.store";

const api = axios.create({
  baseURL: "http://localhost:3000",
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
      return await api.get("/events");
    }
  }

  async getEvent(eventId) {
    const appStore = useAppStore()
    if (appStore.isOffline) {
      return { data: JSON.parse(localStorage.getItem("events") || '[]').find(event => event.id === eventId) || {} };
    } else {
      return await api.get(`/events/${eventId}`);
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
      return await api.post("/events", event);
    }
  }

  async updateEvent(id, event) {
    return await api.put(`/events/${id}`, event);
  }

  async deleteEvent(eventId) {
    const appStore = useAppStore()
    if (appStore.isOffline) {
      var events = JSON.parse(localStorage.getItem("events") || "[]");

      events = events.map(event => event.id !== eventId)

      localStorage.setItem("events", JSON.stringify(events));

      return { data: {} };
    } else {
      return await api.delete(`/events/${eventId}`);
    }
  }


  async getRegistrations() {
    const appStore = useAppStore()
    if (appStore.isOffline) {
      return { data: JSON.parse(localStorage.getItem("participants") || '[]') };
    } else {
      return await api.get("/registrations");
    }
  }

  async getRegistration(registrationId) {
    const appStore = useAppStore()
    if (appStore.isOffline) {
      return { data: JSON.parse(localStorage.getItem("participants") || '[]').find(participant => participant.id === registrationId) || {} };
    } else {
      return await api.get(`/registrations/${registrationId}`);
    }
  }

  async getRegistrationsByUserId(userId) {
    const appStore = useAppStore()
    if (appStore.isOffline) {
      return { data: JSON.parse(localStorage.getItem("participants") || '[]').filter(participant => participant.user_id === userId) || [] };
    } else {
      return await api.get(`/registrations/user/${userId}`);
    }
  }

  async getRegistrationsByEventId(eventId) {
    const appStore = useAppStore()
    if (appStore.isOffline) {
      return { data: JSON.parse(localStorage.getItem("participants") || '[]').filter(participant => participant.event_id === eventId) || [] };
    } else {
      return await api.get(`/registrations/event/${eventId}`);
    }
  }

  async createRegistration(registration) {
    const appStore = useAppStore()
    if (appStore.isOffline) {
      const participants = JSON.parse(localStorage.getItem("participants") || "[]");

      registration.id = participants[participants.length - 1]?.id + 1
      registration.status = "checked-in"
      registration.offline = true

      participants.push(registration);
      localStorage.setItem("participants", JSON.stringify(participants));

      return { data: registration };
    } else {
      return await api.post("/registrations", registration);
    }
  }

  async deleteRegistration(registrationId) {
    return await api.delete(`/registrations/${registrationId}`);
  }

  async registerPresence(registrationId, user_id) {
    const appStore = useAppStore()
    if (appStore.isOffline) {
      var participants = JSON.parse(localStorage.getItem("participants") || "[]");

      participants = participants.map(participant => {
        if (participant.id === registrationId) {
          participant.status = "checked-in"
        }

        return participant
      })

      localStorage.setItem("participants", JSON.stringify(participants));

      return { data: {} };
    } else {
      return await api.put(`/checkin/${registrationId}`, { user_id });
    }
  }

  async cancelRegistration(registrationId, user_id) {
    return await api.put(`/cancel/${registrationId}`, { user_id });
  }

  async finishEvent(eventId) {
    return await api.post(`/events/${eventId}/finish`);
  }

  setToken(token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`
  }
}

export default new EventsApi();
