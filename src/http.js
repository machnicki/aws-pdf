import axios from 'axios'

const instance = axios.create({
  baseURL: process.env.NODE_ENV === 'development' ? 'http://localhost:3001/api/' : '/api/',
  // timeout: 1000,
  // headers: {'X-Custom-Header': 'foobar'}
})

export default instance
