import { useQuery } from '@tanstack/react-query'
import { fetchChannels, fetchMessages } from '../api/chatApi.js'
import useAuth from './useAuth.js'

const useChatData = () => {
  const { token } = useAuth()

  const channelsQuery = useQuery({
    queryKey: ['channels', token],
    queryFn: () => fetchChannels(token),
    enabled: Boolean(token),
  })

  const messagesQuery = useQuery({
    queryKey: ['messages', token],
    queryFn: () => fetchMessages(token),
    enabled: Boolean(token),
  })

  return {
    channelsQuery,
    messagesQuery,
    isLoading: channelsQuery.isPending || messagesQuery.isPending,
    isError: channelsQuery.isError || messagesQuery.isError,
  }
}

export default useChatData
