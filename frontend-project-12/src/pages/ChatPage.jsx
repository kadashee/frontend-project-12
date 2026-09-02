import { useEffect, useState } from 'react'
import ChannelModal from '../components/channels/ChannelModal.jsx'
import ChannelsSidebar from '../components/channels/ChannelsSidebar.jsx'
import MessageForm from '../components/messages/MessageForm.jsx'
import MessageList from '../components/messages/MessageList.jsx'
import useChatData from '../hooks/useChatData.js'
import useAuth from '../hooks/useAuth.js'
import useChatUiStore from '../store/useChatUiStore.js'

const EMPTY_LIST = []

function ChatPage() {
  const [messageBody, setMessageBody] = useState('')
  const { username } = useAuth()
  const {
    channelsQuery,
    messagesQuery,
    messageMutation,
    isLoading,
    isError,
  } = useChatData()
  const activeChannelId = useChatUiStore((state) => state.activeChannelId)
  const setActiveChannelId = useChatUiStore(
    (state) => state.setActiveChannelId,
  )
  const modal = useChatUiStore((state) => state.modal)
  const openModal = useChatUiStore((state) => state.openModal)

  const channels = channelsQuery.data ?? EMPTY_LIST
  const messages = messagesQuery.data ?? EMPTY_LIST

  useEffect(() => {
    const activeChannelExists = channels.some(
      (channel) => String(channel.id) === String(activeChannelId),
    )

    if (channels.length > 0 && !activeChannelExists) {
      const generalChannel = channels.find(({ name }) => name === 'general')
      setActiveChannelId(generalChannel?.id ?? channels[0].id)
    }
  }, [activeChannelId, channels, setActiveChannelId])

  const handleMessageSubmit = async (event) => {
    event.preventDefault()

    const body = messageBody.trim()
    if (!body || !activeChannelId || messageMutation.isPending) {
      return
    }

    try {
      await messageMutation.mutateAsync({
        body,
        channelId: activeChannelId,
        username,
      })
      setMessageBody('')
    } catch {
      // Mutation state renders the error and keeps the message in the input.
    }
  }

  if (isLoading) {
    return (
      <section className="chat-page chat-state-page page-enter">
        <div className="chat-copy">
          <p className="eyebrow">Чат</p>
          <h1>Загрузка…</h1>
        </div>
      </section>
    )
  }

  if (isError) {
    return (
      <section className="chat-page chat-state-page page-enter" role="alert">
        <div className="chat-copy">
          <h1>Не удалось загрузить чат</h1>
        </div>
      </section>
    )
  }

  const activeChannel = channels.find(
    (channel) => String(channel.id) === String(activeChannelId),
  )
  const activeMessages = messages.filter(
    (message) => String(message.channelId) === String(activeChannelId),
  )

  return (
    <>
      <section className="chat-page chat-data-page page-enter" aria-label="Чат">
        <div className="chat-preview chat-preview-data">
          <ChannelsSidebar
            channels={channels}
            activeChannelId={activeChannelId}
            onSelectChannel={setActiveChannelId}
            onOpenModal={openModal}
          />

          <div className="preview-content chat-content">
            <div className="preview-heading">
              <div>
                <span className="preview-kicker">Канал</span>
                <strong># {activeChannel?.name}</strong>
              </div>
              <span className="online-badge">
                {activeMessages.length} сообщений
              </span>
            </div>

            <MessageList messages={activeMessages} />
            <MessageForm
              channel={activeChannel}
              value={messageBody}
              isPending={messageMutation.isPending}
              isError={messageMutation.isError}
              onSubmit={handleMessageSubmit}
              onChange={(event) => {
                setMessageBody(event.target.value)
                if (messageMutation.isError) {
                  messageMutation.reset()
                }
              }}
            />
          </div>
        </div>
      </section>

      {modal && <ChannelModal modal={modal} channels={channels} />}
    </>
  )
}

export default ChatPage
