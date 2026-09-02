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

export const createChannel = async (token, channel) => {
  const { data } = await axios.post(
    '/api/v1/channels',
    channel,
    getAuthConfig(token),
  )
  return data
}

export const renameChannel = async (token, channelId, channel) => {
  const { data } = await axios.patch(
    `/api/v1/channels/${channelId}`,
    channel,
    getAuthConfig(token),
  )
  return data
}

export const removeChannel = async (token, channelId) => {
  const { data } = await axios.delete(
    `/api/v1/channels/${channelId}`,
    getAuthConfig(token),
  )
  return data
}
