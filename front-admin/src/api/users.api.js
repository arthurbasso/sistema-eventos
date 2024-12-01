import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3001",
  headers: {
    'Content-Type': 'application/json'
  }
})

import { useAppStore } from "@/stores/app.store";
const appStore = useAppStore();

class UsersApi {
  async getUsers() {
    if (appStore.isOffline) {
      return { data: JSON.parse(localStorage.getItem("users") || '[]') };
    } else {
      return api.get("/users");
    }
  }

  async getUser(id) {
    if (appStore.isOffline) {
      return { data: JSON.parse(localStorage.getItem("users") || '[]').find(user => user.id === id) || {} };
    } else {
      return api.get(`/users/${id}`);
    }
  }

  async createUser(user) {
    if (appStore.isOffline) {
      const users = JSON.parse(localStorage.getItem("users") || "[]");

      user.id = users[users.length - 1]?.id + 1
      user.offline = true

      users.push(user);
      localStorage.setItem("users", JSON.stringify(users));

      return { data: user };
    }

    return api.post("/users", user);
  }

  async updateUser(id, user) {
    return api.put(`/users/${id}`, user);
  }

  async deleteUser(id) {
    if (appStore.isOffline) {
      var users = JSON.parse(localStorage.getItem("users") || "[]");

      users = users.map(user => {
        if (user.id === id) {
          user.offline = true
        }

        return user
      })

      const newUsers = users.filter(user => user.id !== id);
      localStorage.setItem("users", JSON.stringify(newUsers));

      return { data: {} }
    } else {
      return api.delete(`/users/${id}`);
    }
  }

  async changePassword(id, password, new_password) {
    return api.put(`/users/${id}/change-password`, { password, new_password });
  }

  async login(email, password) {
    return api.post("/users/login", { email, password });
  }
}

export default new UsersApi();
