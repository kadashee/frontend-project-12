import {
  hasLength,
  isNotEmpty,
  matchesField,
  useForm,
} from '@mantine/form'
import axios from 'axios'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { signUpUser } from '../api/authApi.js'
import useAuth from '../hooks/useAuth.js'

const required = isNotEmpty('Обязательное поле')
const validUsernameLength = hasLength(
  { min: 3, max: 20 },
  'От 3 до 20 символов',
)
const validPasswordLength = hasLength(
  { min: 6 },
  'Не менее 6 символов',
)
const passwordsMatch = matchesField(
  'password',
  'Пароли должны совпадать',
)

function SignupPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate()
  const { logIn } = useAuth()
  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      username: '',
      password: '',
      passwordConfirmation: '',
    },
    validate: {
      username: (value) => required(value) || validUsernameLength(value),
      password: (value) => required(value) || validPasswordLength(value),
      passwordConfirmation: (value, values) =>
        required(value) || passwordsMatch(value, values),
    },
  })

  const handleSubmit = async ({ username, password }) => {
    setIsSubmitting(true)

    try {
      const auth = await signUpUser({ username: username.trim(), password })
      logIn(auth)
      navigate('/', { replace: true })
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 409) {
        form.setFieldError('username', 'Такой пользователь уже существует')
      } else {
        form.setFieldError(
          'username',
          'Не удалось связаться с сервером. Попробуйте ещё раз',
        )
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="login-page page-enter" aria-labelledby="signup-title">
      <div className="login-context">
        <p className="eyebrow">Новый аккаунт</p>
        <h1 id="signup-title">Присоединяйтесь к чату.</h1>
        <p className="lead">
          Создайте аккаунт, чтобы выбирать каналы и общаться с другими
          пользователями.
        </p>
      </div>

      <div className="form-panel">
        <div className="form-heading">
          <span className="step-number">01</span>
          <div>
            <h2>Регистрация</h2>
            <p>Заполните данные нового аккаунта</p>
          </div>
        </div>

        <form className="auth-form" onSubmit={form.onSubmit(handleSubmit)}>
          <div className="form-field">
            <label htmlFor="signup-username">Имя пользователя</label>
            <input
              id="signup-username"
              name="username"
              type="text"
              autoComplete="username"
              placeholder="От 3 до 20 символов"
              aria-describedby={
                form.errors.username ? 'signup-username-error' : undefined
              }
              aria-invalid={Boolean(form.errors.username)}
              disabled={isSubmitting}
              required
              autoFocus
              key={form.key('username')}
              {...form.getInputProps('username', { withError: false })}
            />
            {form.errors.username && (
              <p
                className="form-error"
                id="signup-username-error"
                role="alert"
              >
                {form.errors.username}
              </p>
            )}
          </div>

          <div className="form-field">
            <label htmlFor="signup-password">Пароль</label>
            <input
              id="signup-password"
              name="password"
              type="password"
              autoComplete="new-password"
              placeholder="Не менее 6 символов"
              aria-describedby={
                form.errors.password ? 'signup-password-error' : undefined
              }
              aria-invalid={Boolean(form.errors.password)}
              disabled={isSubmitting}
              required
              key={form.key('password')}
              {...form.getInputProps('password', { withError: false })}
            />
            {form.errors.password && (
              <p
                className="form-error"
                id="signup-password-error"
                role="alert"
              >
                {form.errors.password}
              </p>
            )}
          </div>

          <div className="form-field">
            <label htmlFor="password-confirmation">Подтвердите пароль</label>
            <input
              id="password-confirmation"
              name="passwordConfirmation"
              type="password"
              autoComplete="new-password"
              placeholder="Повторите пароль"
              aria-describedby={
                form.errors.passwordConfirmation
                  ? 'password-confirmation-error'
                  : undefined
              }
              aria-invalid={Boolean(form.errors.passwordConfirmation)}
              disabled={isSubmitting}
              required
              key={form.key('passwordConfirmation')}
              {...form.getInputProps('passwordConfirmation', {
                withError: false,
              })}
            />
            {form.errors.passwordConfirmation && (
              <p
                className="form-error"
                id="password-confirmation-error"
                role="alert"
              >
                {form.errors.passwordConfirmation}
              </p>
            )}
          </div>

          <button
            className="submit-button"
            type="submit"
            disabled={isSubmitting}
            aria-busy={isSubmitting}
          >
            {isSubmitting ? 'Регистрируем…' : 'Зарегистрироваться'}
            <span aria-hidden="true">→</span>
          </button>
        </form>
      </div>
    </section>
  )
}

export default SignupPage
