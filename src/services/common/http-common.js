import axios from "axios";

export default axios.create({
  baseURL: "http://192.168.20.87:5000",
  headers: {
    "Content-type": "application/json"
  }
});