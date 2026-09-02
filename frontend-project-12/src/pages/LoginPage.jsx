import { useForm } from '@mantine/form'
import axios from 'axios'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth.js'

function LoginPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate()
  const { logIn } = useAuth()
  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      username: '',
      password: '',
    },
  })

  const handleSubmit = async (values) => {
    form.clearErrors()
    setIsSubmitting(true)

    try {
      const { data } = await axios.post('/api/v1/login', values)
      logIn(data)
      navigate('/', { replace: true })
    } catch (error) {
      const message =
        axios.isAxiosError(error) && error.response?.status === 401
          ? 'Неверные имя пользователя или пароль'
          : 'Не удалось связаться с сервером. Попробуйте ещё раз'

      form.setFieldError('password', message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const passwordError = form.errors.password

  return (
    <section className="login-page page-enter" aria-labelledby="login-title">
      <div className="login-context">
        <p className="eyebrow">Личный доступ</p>
        <h1 id="login-title">С возвращением в чат.</h1>
        <p className="lead">
          Введите данные аккаунта, чтобы писать сообщения и видеть беседы в
          реальном времени.
        </p>
        <div className="signal-card" aria-hidden="true">
          <span className="signal-pulse" />
          <div>
            <strong>Соединение готово</strong>
            <span>Осталось представиться</span>
          </div>
        </div>
      </div>

      <div className="form-panel">
        <div className="form-heading">
          <span className="step-number">01</span>
          <div>
            <h2>Вход</h2>
            <p>Используйте имя и пароль аккаунта</p>
          </div>
        </div>

        <form
          className="auth-form"
          onSubmit={form.onSubmit(handleSubmit)}
        >
          <div className="form-field">
            <label htmlFor="username">Имя пользователя</label>
            <input
              id="username"
              name="username"
              type="text"
              autoComplete="username"
              placeholder="Введите ваше имя"
              disabled={isSubmitting}
              required
              key={form.key('username')}
              {...form.getInputProps('username', { withError: false })}
            />
          </div>

          <div className="form-field">
            <label htmlFor="password">Пароль</label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              placeholder="Введите пароль"
              aria-describedby={passwordError ? 'password-error' : undefined}
              aria-invalid={Boolean(passwordError)}
              disabled={isSubmitting}
              required
              key={form.key('password')}
              {...form.getInputProps('password', { withError: false })}
            />
            {passwordError && (
              <p className="form-error" id="password-error" role="alert">
                {passwordError}
              </p>
            )}
          </div>

          <button
            className="submit-button"
            type="submit"
            disabled={isSubmitting}
            aria-busy={isSubmitting}
          >
            {isSubmitting ? 'Входим…' : 'Войти'}
            <span aria-hidden="true">→</span>
          </button>
        </form>

        <p className="form-note">
          Данные передаются серверу по защищённому маршруту авторизации.
        </p>
      </div>
    </section>
  )
}

export default LoginPage
