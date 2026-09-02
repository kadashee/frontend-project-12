import axios from 'axios'

export const logInUser = async (credentials) => {
  const { data } = await axios.post('/api/v1/login', credentials)
  return data
}

export const signUpUser = async (credentials) => {
  const { data } = await axios.post('/api/v1/signup', credentials)
  return data
}
