function MessageForm({
  channel,
  value,
  isPending,
  isError,
  onChange,
  onSubmit,
}) {
  return (
    <form className="auth-form message-input-form" onSubmit={onSubmit}>
      <div className="form-field">
        <label htmlFor="message">Новое сообщение</label>
        <input
          id="message"
          name="message"
          type="text"
          placeholder={`Сообщение в #${channel?.name ?? ''}`}
          value={value}
          aria-describedby={isError ? 'message-error' : undefined}
          aria-invalid={isError}
          disabled={!channel || isPending}
          onChange={onChange}
        />
        {isError && (
          <p className="form-error" id="message-error" role="alert">
            Не удалось отправить сообщение. Проверьте соединение и попробуйте
            снова.
          </p>
        )}
      </div>
      <button
        className="submit-button"
        type="submit"
        disabled={!channel || !value.trim() || isPending}
        aria-busy={isPending}
      >
        {isPending ? 'Отправляем…' : 'Отправить'}
      </button>
    </form>
  )
}

export default MessageForm
