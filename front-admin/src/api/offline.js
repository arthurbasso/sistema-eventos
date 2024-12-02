import apiUsers from "./users.api";
import apiEvents from "./events.api";

async function downloadUsers() {
  let users = await apiUsers.getUsers()
  localStorage.removeItem("users")
  localStorage.setItem("users", JSON.stringify(users.data))
}

async function uploadUsers() {
  let users = JSON.parse(localStorage.getItem("users") || "[]")
  let participants = JSON.parse(localStorage.getItem("participants") || "[]")

  users = users.filter(user => user.offline)

  await users.map(async user => {
    let newUser = await apiUsers.createUser(user)

    if (participants.some(participant => participant.userId === user.id)) {
      participants = participants.map(participant => {
        if (participant.offline && participant.user_id === user.id) {
          participant.user_id = newUser.data.id
        }
        return participant
      })

      localStorage.setItem("participants", JSON.stringify(participants))
    }

    return newUser.data
  })

  localStorage.setItem("users", JSON.stringify(users))
  await uploadParticipants()
}

async function downloadEvents() {
  let events = await apiEvents.getEvents()
  localStorage.setItem("events", JSON.stringify(events.data))
}

async function downloadParticipants() {
  let participants = await apiEvents.getRegistrations()
  localStorage.setItem("participants", JSON.stringify(participants.data))
}

async function uploadParticipants() {
  let participants = JSON.parse(localStorage.getItem("participants") || "[]")
  participants = participants.filter(participant => participant.offline)

  await participants.map(async participant => {
    delete participant.offline
    let newParticipant = await apiEvents.createRegistration(participant)

    return newParticipant.data
  })

  localStorage.setItem("participants", JSON.stringify(participants))
}

export const enableOfflineMode = async () => {

  await downloadUsers()
  await downloadEvents()
  await downloadParticipants()

  localStorage.setItem("offlineMode", true)
  window.location.reload()
}

export const disableOfflineMode = async () => {
  await uploadUsers()

  localStorage.removeItem("offlineMode")
  localStorage.removeItem("users")
  localStorage.removeItem("events")
  localStorage.removeItem("participants")

  // setTimeout(() => {
  //   window.location.reload()
  // }, 2000);
}
