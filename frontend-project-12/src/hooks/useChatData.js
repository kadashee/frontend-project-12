import { useEffect } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { io } from 'socket.io-client'
import {
  createMessage,
  fetchChannels,
  fetchMessages,
} from '../api/chatApi.js'
import useAuth from './useAuth.js'

const useChatData = () => {
  const { token } = useAuth()
  const queryClient = useQueryClient()

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

  const messageMutation = useMutation({
    mutationFn: (message) => createMessage(token, message),
  })

  useEffect(() => {
    if (!token) {
      return undefined
    }

    const socket = io()
    const handleNewMessage = (message) => {
      queryClient.setQueryData(['messages', token], (cachedMessages = []) => [
        ...cachedMessages,
        message,
      ])
    }

    socket.on('newMessage', handleNewMessage)

    return () => {
      socket.off('newMessage', handleNewMessage)
      socket.disconnect()
    }
  }, [queryClient, token])

  return {
    channelsQuery,
    messagesQuery,
    messageMutation,
    isLoading: channelsQuery.isPending || messagesQuery.isPending,
    isError: channelsQuery.isError || messagesQuery.isError,
  }
}

export default useChatData
