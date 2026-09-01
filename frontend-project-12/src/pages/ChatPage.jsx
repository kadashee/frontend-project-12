import { Link } from 'react-router-dom'

function ChatPage() {
  return (
    <section className="chat-page page-enter" aria-labelledby="chat-title">
      <div className="chat-copy">
        <p className="eyebrow">Real-time пространство</p>
        <h1 id="chat-title">Разговор начинается здесь.</h1>
        <p className="lead">
          Каналы, сообщения и вся команда в одном месте. Авторизуйтесь, чтобы
          присоединиться к беседе от своего имени.
        </p>
        <Link className="primary-link" to="/login">
          Перейти ко входу
          <span aria-hidden="true">↗</span>
        </Link>
      </div>

      <div className="chat-preview" aria-label="Предпросмотр каналов чата">
        <div className="preview-rail">
          <span className="preview-dot preview-dot-accent" />
          <span className="preview-dot" />
          <span className="preview-dot" />
        </div>
        <div className="preview-content">
          <div className="preview-heading">
            <div>
              <span className="preview-kicker">Канал</span>
              <strong># general</strong>
            </div>
            <span className="online-badge">online</span>
          </div>
          <div className="message-row">
            <span className="avatar avatar-violet">A</span>
            <div>
              <strong>admin</strong>
              <p>Добро пожаловать в Hexlet Chat!</p>
            </div>
          </div>
          <div className="message-row message-row-muted">
            <span className="avatar">?</span>
            <div>
              <strong>Ваше имя</strong>
              <p>Войдите, чтобы продолжить разговор…</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ChatPage
