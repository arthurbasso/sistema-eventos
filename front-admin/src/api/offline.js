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
  let participants = JSON.parse(localStorage.getItem("participants") || "[]")

  users = users.filter(user => user.offline)

  await users.forEach(async user => {
    let newUser = await apiUsers.post("/users", user)

    if (participants.some(participant => participant.userId === user.id)) {
      participants = participants.map(participant => {
        if (participant.offline && participant.userId === user.id) {
          participant.userId = newUser.data.id
        }
        return participant
      })

      localStorage.setItem("participants", JSON.stringify(participants))
    }

    user = newUser.data
  })

  localStorage.setItem("users", JSON.stringify(users))
}

async function downloadEvents() {
  let events = await apiEvents.get("/events")
  localStorage.setItem("events", JSON.stringify(events.data))
}

async function uploadEvents() { }

async function downloadParticipants() {
  let participants = await apiEvents.get("/registrations")
  localStorage.setItem("participants", JSON.stringify(participants.data))
}

async function uploadParticipants() {
  let participants = JSON.parse(localStorage.getItem("participants") || "[]")
  participants = participants.filter(participant => participant.offline)

  await participants.forEach(async participant => {
    let newParticipant = await apiEvents.post("/participants", participant)
    participant = newParticipant.data
  })

  localStorage.setItem("participants", JSON.stringify(participants))
}

export const changeOfflineMode = async (offlineMode) => {
  if (offlineMode) {
    await downloadUsers()
    await downloadEvents()
    await downloadParticipants()
  } else {
    await doUpload()
  }

  window.location.reload()
}

const doUpload = async () => {
  await uploadUsers()
}
