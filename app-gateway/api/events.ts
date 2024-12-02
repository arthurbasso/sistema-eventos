import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:3002",
})

export const getEvents = async () => {
    return await api.get("/events")
}

export const getEvent = async (id: number) => {
    return await api.get(`/events/${id}`)
}

export const createEvent = async (event: any) => {
    return await api.post("/events", event)
}

export const updateEvent = async (id: number, event: any) => {
    return await api.put(`/events/${id}`, event)
}

export const deleteEvent = async (id: number) => {
    return await api.delete(`/events/${id}`)
}

export const getEventParticipants = async (id: number) => {
    return await api.get(`/registrations/event/${id}`)
}

export const getRegistrations = async () => {
    return await api.get("/registrations")
}

export const getParticipantEvents = async (id: number) => {
    return await api.get(`/registrations/user/${id}`)
}

export const registerParticipant = async (event_id: number, user_id: number) => {
    return await api.post("/registrations", { event_id, user_id, status: "registered" })
}

export const checkinParticipant = async (id: number, user_id: number) => {
    return await api.put(`/checkin/${id}`, { user_id })
}

export const cancelRegistration = async (id: number, user_id: number) => {
    return await api.put(`/cancel/${id}`, { user_id })
}

export const finishEvent = async (id: number) => {
    return await api.post(`/events/${id}/finish`)
}