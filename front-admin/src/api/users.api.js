import axios from "axios";
import { useAppStore } from "@/stores/app.store";

const api = axios.create({
  baseURL: "http://localhost:3001",
  headers: {
    'Content-Type': 'application/json'
  }
})

class UsersApi {
  async getUsers() {
    const appStore = useAppStore()
    if (appStore.isOffline) {
      return { data: JSON.parse(localStorage.getItem("users") || '[]') };
    } else {
      return await api.get("/users");
    }
  }

  async getUser(id) {
    const appStore = useAppStore()
    if (appStore.isOffline) {
      return { data: JSON.parse(localStorage.getItem("users") || '[]').find(user => user.id === id) || {} };
    } else {
      return await api.get(`/users/${id}`);
    }
  }

  async createUser(user) {
    const appStore = useAppStore()
    if (appStore.isOffline) {
      const users = JSON.parse(localStorage.getItem("users") || "[]");

      user.id = users[users.length - 1]?.id + 1
      user.offline = true

      users.push(user);
      localStorage.setItem("users", JSON.stringify(users));

      return { data: user };
    } else {
      return await api.post("/users", user);
    }
  }

  async updateUser(id, user) {
    return await api.put(`/users/${id}`, user);
  }

  async deleteUser(id) {
    const appStore = useAppStore()
    if (appStore.isOffline) {
      var users = JSON.parse(localStorage.getItem("users") || "[]");

      const newUsers = users.filter(user => user.id !== id);
      localStorage.setItem("users", JSON.stringify(newUsers));

      return { data: {} }
    } else {
      return await api.delete(`/users/${id}`);
    }
  }

  async changePassword(id, password, new_password) {
    return await api.put(`/users/${id}/change-password`, { password, new_password });
  }

  async login(email, password) {
    let data = { email }
    if (password) {
      data.password = password
    }
    return await api.post("/users/login", data);
  }

  async register(user) {
    return await api.post("/users", user);
  }

  setToken(token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`
  }
}

export default new UsersApi();
