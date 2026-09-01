import { Link, NavLink, Outlet } from 'react-router-dom'

const getNavLinkClassName = ({ isActive }) =>
  isActive ? 'nav-link nav-link-active' : 'nav-link'

function AppLayout() {
  return (
    <div className="app-shell">
      <header className="app-header">
        <Link className="brand" to="/" aria-label="Hexlet Chat — на главную">
          <span className="brand-mark" aria-hidden="true">
            H
          </span>
          <span>Hexlet Chat</span>
        </Link>

        <nav className="main-nav" aria-label="Основная навигация">
          <NavLink className={getNavLinkClassName} to="/" end>
            Чат
          </NavLink>
          <NavLink className={getNavLinkClassName} to="/login">
            Войти
          </NavLink>
        </nav>
      </header>

      <main className="app-main">
        <Outlet />
      </main>

      <footer className="app-footer">
        <span>Учебный проект Хекслета</span>
        <span aria-hidden="true">●</span>
        <span>Онлайн-чат</span>
      </footer>
    </div>
  )
}

export default AppLayout
