function ChannelsSidebar({
  channels,
  activeChannelId,
  onSelectChannel,
  onOpenModal,
}) {
  return (
    <aside className="preview-rail channels-rail">
      <div className="channels-heading">
        <strong>Каналы</strong>
        <button
          className="add-channel-button"
          type="button"
          aria-label="Добавить канал"
          onClick={() => onOpenModal({ type: 'add' })}
        >
          +
        </button>
      </div>

      <div className="channels-list">
        {channels.map((channel) => {
          const isActive = String(channel.id) === String(activeChannelId)

          return (
            <div className="channel-item" key={channel.id}>
              <button
                className={`nav-link channel-link${isActive ? ' nav-link-active' : ''}`}
                type="button"
                onClick={() => onSelectChannel(channel.id)}
              >
                # {channel.name}
              </button>

              {channel.removable && (
                <details className="channel-menu">
                  <summary aria-label={`Управление каналом ${channel.name}`}>
                    ⋮
                  </summary>
                  <div className="channel-menu-content">
                    <button
                      type="button"
                      onClick={(event) => {
                        event.currentTarget
                          .closest('details')
                          ?.removeAttribute('open')
                        onOpenModal({ type: 'rename', channel })
                      }}
                    >
                      Переименовать
                    </button>
                    <button
                      className="channel-menu-danger"
                      type="button"
                      onClick={(event) => {
                        event.currentTarget
                          .closest('details')
                          ?.removeAttribute('open')
                        onOpenModal({ type: 'remove', channel })
                      }}
                    >
                      Удалить
                    </button>
                  </div>
                </details>
              )}
            </div>
          )
        })}
      </div>
    </aside>
  )
}

export default ChannelsSidebar
