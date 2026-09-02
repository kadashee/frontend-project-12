import axios from 'axios'

const getAuthConfig = (token) => ({
  headers: {
    Authorization: `Bearer ${token}`,
  },
})

export const fetchChannels = async (token) => {
  const { data } = await axios.get('/api/v1/channels', getAuthConfig(token))
  return data
}

export const fetchMessages = async (token) => {
  const { data } = await axios.get('/api/v1/messages', getAuthConfig(token))
  return data
}

export const createMessage = async (token, message) => {
  const { data } = await axios.post(
    '/api/v1/messages',
    message,
    getAuthConfig(token),
  )
  return data
}
