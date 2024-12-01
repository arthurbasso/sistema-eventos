
import axios from "axios";


const apiUsers = axios.create({
  baseURL: "http://localhost:3001",
  headers: {
    'Content-Type': 'application/json'
  }
})

const apiEvents = axios.create({
  baseURL: "http://localhost:3002",
  headers: {
    'Content-Type': 'application/json'
  }
})

async function downloadUsers() {
  let users = await apiUsers.get("/users")
  localStorage.setItem("users", JSON.stringify(users.data))
}

async function downloadEvents() {
  let events = await apiEvents.get("/events")
  localStorage.setItem("events", JSON.stringify(events.data))
}

async function downloadParticipants() {
  let eventUsers = await apiEvents.get("/event-users")
  localStorage.setItem("event-users", JSON.stringify(eventUsers.data))
}

async function importCreatedUsers() {
  var users = JSON.parse(localStorage.getItem("users") || "[]");
  users = users.filter(user => user.offline);

  await users.forEach(async user => {
    let newUser = await apiUsers.post("/users", user)
    user = newUser.data
  })
}

async function importParticipants() {
  var eventUsers = JSON.parse(localStorage.getItem("event-users") || "[]");
}

export const enableOfflineMode = async () => {
}

export const doUpload = () => {
  importCreatedUsers()
}
