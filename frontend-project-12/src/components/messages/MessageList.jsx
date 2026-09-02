function MessageList({ messages }) {
  return (
    <div className="messages-list">
      {messages.map((message) => (
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
      {messages.length === 0 && (
        <p className="empty-messages">В канале пока нет сообщений</p>
      )}
    </div>
  )
}

export default MessageList
