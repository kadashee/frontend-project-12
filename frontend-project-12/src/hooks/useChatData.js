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
    const handleNewChannel = (channel) => {
      queryClient.setQueryData(['channels', token], (cachedChannels = []) => [
        ...cachedChannels,
        channel,
      ])
    }
    const handleRenameChannel = (renamedChannel) => {
      queryClient.setQueryData(['channels', token], (cachedChannels = []) =>
        cachedChannels.map((channel) =>
          String(channel.id) === String(renamedChannel.id)
            ? renamedChannel
            : channel,
        ),
      )
    }
    const handleRemoveChannel = ({ id }) => {
      queryClient.setQueryData(['channels', token], (cachedChannels = []) =>
        cachedChannels.filter((channel) => String(channel.id) !== String(id)),
      )
      queryClient.setQueryData(['messages', token], (cachedMessages = []) =>
        cachedMessages.filter(
          (message) => String(message.channelId) !== String(id),
        ),
      )
    }

    socket.on('newMessage', handleNewMessage)
    socket.on('newChannel', handleNewChannel)
    socket.on('renameChannel', handleRenameChannel)
    socket.on('removeChannel', handleRemoveChannel)

    return () => {
      socket.off('newMessage', handleNewMessage)
      socket.off('newChannel', handleNewChannel)
      socket.off('renameChannel', handleRenameChannel)
      socket.off('removeChannel', handleRemoveChannel)
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
