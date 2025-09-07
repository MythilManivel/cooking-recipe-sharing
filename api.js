import axios from 'axios'

const api = axios.create({
  baseURL: '/api', // proxy handles localhost:5000
  withCredentials: true, // send cookies (important for auth sessions)
})

export default api
