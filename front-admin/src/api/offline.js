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
  localStorage.removeItem("users")
  let users = await apiUsers.get("/users")
  localStorage.setItem("users", JSON.stringify(users.data))
}

async function uploadUsers() {
  let users = JSON.parse(localStorage.getItem("users") || "[]")
  users = users.filter(user => user.offline)

  await users.forEach(async user => {
    let newUser = await apiUsers.post("/users", user)
    user = newUser.data
  })

  localStorage.setItem("users", JSON.stringify(users))
}

async function downloadEvents() {
  let events = await apiEvents.get("/events")
  localStorage.setItem("events", JSON.stringify(events.data))
}

export const changeOfflineMode = async (offlineMode) => {
  if (offlineMode) {
    await downloadUsers()
    await downloadEvents()
    // await downloadParticipants()
  } else {
    await doUpload()
  }

  window.location.reload()
}

const doUpload = async () => {
  await uploadUsers()
}
