import axios from "axios"

export default axios.create({
  timeout: 60000,
  withCredentials: false,
  xsrfCookieName: "csrftoken",
  xsrfHeaderName: "X-CSRFTOKEN",
  withXSRFToken: true,
  headers: {
    "Content-Type": "application/json"
  }
})
