import axios from "axios";

export default axios.create({
  baseURL: process.env.PRODUCTION_API,
  headers: {
    "Content-type": "application/json"
  }
});