import { Link } from 'react-router-dom'

function NotFoundPage() {
  return (
    <section className="not-found-page page-enter" aria-labelledby="not-found-title">
      <p className="error-code" aria-hidden="true">
        404
      </p>
      <div className="not-found-copy">
        <p className="eyebrow">Маршрут не найден</p>
        <h1 id="not-found-title">Здесь пока никто не разговаривает.</h1>
        <p className="lead">
          Возможно, адрес введён с ошибкой. Вернитесь на главную страницу и
          продолжите оттуда.
        </p>
        <Link className="primary-link" to="/">
          Вернуться в чат
          <span aria-hidden="true">←</span>
        </Link>
      </div>
    </section>
  )
}

export default NotFoundPage
