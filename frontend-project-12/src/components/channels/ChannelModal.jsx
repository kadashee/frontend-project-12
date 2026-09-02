import { useEffect, useRef } from 'react'
import { hasLength, useForm } from '@mantine/form'
import { useMutation } from '@tanstack/react-query'
import {
  createChannel,
  removeChannel,
  renameChannel,
} from '../../api/chatApi.js'
import useAuth from '../../hooks/useAuth.js'
import useChatUiStore from '../../store/useChatUiStore.js'

const validateNameLength = hasLength(
  { min: 3, max: 20 },
  'От 3 до 20 символов',
)

const modalCopy = {
  add: {
    title: 'Добавить канал',
    submit: 'Добавить',
    pending: 'Добавляем…',
  },
  rename: {
    title: 'Переименовать канал',
    submit: 'Переименовать',
    pending: 'Сохраняем…',
  },
  remove: {
    title: 'Удалить канал?',
    submit: 'Удалить',
    pending: 'Удаляем…',
  },
}

function ChannelModal({ modal, channels }) {
  const dialogRef = useRef(null)
  const { token } = useAuth()
  const closeModal = useChatUiStore((state) => state.closeModal)
  const setActiveChannelId = useChatUiStore(
    (state) => state.setActiveChannelId,
  )
  const copy = modalCopy[modal.type]
  const isRemoveModal = modal.type === 'remove'

  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      name: modal.channel?.name ?? '',
    },
    validate: {
      name: (value) => {
        const lengthError = validateNameLength(value)
        if (lengthError) {
          return lengthError
        }

        const normalizedName = value.trim().toLowerCase()
        const channelExists = channels.some(
          (channel) =>
            channel.name.toLowerCase() === normalizedName &&
            String(channel.id) !== String(modal.channel?.id),
        )

        return channelExists ? 'Канал с таким именем уже существует' : null
      },
    },
  })

  const mutation = useMutation({
    mutationFn: ({ name } = {}) => {
      if (modal.type === 'add') {
        return createChannel(token, { name })
      }
      if (modal.type === 'rename') {
        return renameChannel(token, modal.channel.id, { name })
      }
      return removeChannel(token, modal.channel.id)
    },
    onSuccess: (channel) => {
      if (modal.type === 'add') {
        setActiveChannelId(channel.id)
      }
      closeModal()
    },
  })

  useEffect(() => {
    const dialog = dialogRef.current
    dialog.showModal()

    return () => {
      if (dialog.open) {
        dialog.close()
      }
    }
  }, [])

  const handleNameSubmit = form.onSubmit(({ name }) => {
    mutation.mutate({ name: name.trim() })
  })

  const handleRemoveSubmit = (event) => {
    event.preventDefault()
    mutation.mutate()
  }

  const handleCancel = (event) => {
    if (mutation.isPending) {
      event.preventDefault()
      return
    }
    closeModal()
  }

  const nameError = form.errors.name

  return (
    <dialog
      className="channel-modal"
      ref={dialogRef}
      aria-labelledby="channel-modal-title"
      onCancel={handleCancel}
      onClick={(event) => {
        if (event.target === event.currentTarget && !mutation.isPending) {
          closeModal()
        }
      }}
    >
      <form
        className="channel-modal-form"
        onSubmit={isRemoveModal ? handleRemoveSubmit : handleNameSubmit}
      >
        <div className="channel-modal-heading">
          <h2 id="channel-modal-title">{copy.title}</h2>
          <button
            className="modal-close-button"
            type="button"
            aria-label="Закрыть"
            disabled={mutation.isPending}
            onClick={closeModal}
          >
            ×
          </button>
        </div>

        {isRemoveModal ? (
          <p className="modal-description">
            Канал <strong># {modal.channel.name}</strong> и все его сообщения
            будут удалены.
          </p>
        ) : (
          <div className="form-field">
            <label htmlFor="channel-name">Имя канала</label>
            <input
              id="channel-name"
              name="name"
              type="text"
              autoComplete="off"
              placeholder="Введите имя канала"
              aria-describedby={nameError ? 'channel-name-error' : undefined}
              aria-invalid={Boolean(nameError)}
              disabled={mutation.isPending}
              autoFocus
              key={form.key('name')}
              {...form.getInputProps('name', { withError: false })}
            />
            {nameError && (
              <p className="form-error" id="channel-name-error" role="alert">
                {nameError}
              </p>
            )}
          </div>
        )}

        {mutation.isError && (
          <p className="form-error" role="alert">
            Не удалось выполнить запрос. Попробуйте ещё раз.
          </p>
        )}

        <div className="channel-modal-actions">
          <button
            className="secondary-button"
            type="button"
            disabled={mutation.isPending}
            onClick={closeModal}
          >
            Отмена
          </button>
          <button
            className={`submit-button${isRemoveModal ? ' danger-button' : ''}`}
            type="submit"
            disabled={mutation.isPending}
            aria-busy={mutation.isPending}
          >
            {mutation.isPending ? copy.pending : copy.submit}
          </button>
        </div>
      </form>
    </dialog>
  )
}

export default ChannelModal
