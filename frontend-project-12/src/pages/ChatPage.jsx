import { useEffect, useState } from 'react'
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
    <section className="chat-page chat-data-page page-enter" aria-label="Чат">
      <div className="chat-preview chat-preview-data">
        <aside className="preview-rail channels-rail">
          <strong>Каналы</strong>
          {channels.map((channel) => {
            const isActive = String(channel.id) === String(activeChannelId)

            return (
              <button
                className={`nav-link channel-link${isActive ? ' nav-link-active' : ''}`}
                type="button"
                key={channel.id}
                onClick={() => setActiveChannelId(channel.id)}
              >
                # {channel.name}
              </button>
            )
          })}
        </aside>

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

          <div className="messages-list">
            {activeMessages.map((message) => (
              <div className="message-row" key={message.id}>
                <span className="avatar avatar-violet" aria-hidden="true">
                  {message.username?.charAt(0).toUpperCase() || '?'}
                </span>
                <div>
                  <strong>{message.username}</strong>
                  <p>{message.body}</p>
                </div>
              </div>
            ))}
            {activeMessages.length === 0 && (
              <p className="empty-messages">В канале пока нет сообщений</p>
            )}
          </div>

          <form
            className="auth-form message-input-form"
            onSubmit={handleMessageSubmit}
          >
            <div className="form-field">
              <label htmlFor="message">Новое сообщение</label>
              <input
                id="message"
                name="message"
                type="text"
                placeholder={`Сообщение в #${activeChannel?.name ?? ''}`}
                value={messageBody}
                aria-describedby={messageMutation.isError ? 'message-error' : undefined}
                aria-invalid={messageMutation.isError}
                disabled={!activeChannel || messageMutation.isPending}
                onChange={(event) => {
                  setMessageBody(event.target.value)
                  if (messageMutation.isError) {
                    messageMutation.reset()
                  }
                }}
              />
              {messageMutation.isError && (
                <p className="form-error" id="message-error" role="alert">
                  Не удалось отправить сообщение. Проверьте соединение и
                  попробуйте снова.
                </p>
              )}
            </div>
            <button
              className="submit-button"
              type="submit"
              disabled={
                !activeChannel ||
                !messageBody.trim() ||
                messageMutation.isPending
              }
              aria-busy={messageMutation.isPending}
            >
              {messageMutation.isPending ? 'Отправляем…' : 'Отправить'}
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}

export default ChatPage
