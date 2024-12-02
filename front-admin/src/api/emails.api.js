import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3004",
  headers: {
    // Overwrite Axios's automatically set Content-Type
    'Content-Type': 'application/json'
  }
});

class EmailsApi {
  async sendEmail(email) {
    return api.post("/emails", email);
  }
}

export default new EmailsApi();
