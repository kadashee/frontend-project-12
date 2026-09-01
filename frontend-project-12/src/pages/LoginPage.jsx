import { useForm } from '@mantine/form'

function LoginPage() {
  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      username: '',
      password: '',
    },
  })

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
          onSubmit={form.onSubmit(() => undefined)}
        >
          <div className="form-field">
            <label htmlFor="username">Имя пользователя</label>
            <input
              id="username"
              name="username"
              type="text"
              autoComplete="username"
              placeholder="Введите ваше имя"
              required
              key={form.key('username')}
              {...form.getInputProps('username')}
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
              required
              key={form.key('password')}
              {...form.getInputProps('password')}
            />
          </div>

          <button className="submit-button" type="submit">
            Войти
            <span aria-hidden="true">→</span>
          </button>
        </form>

        <p className="form-note">
          Отправка данных будет подключена на следующем этапе.
        </p>
      </div>
    </section>
  )
}

export default LoginPage
