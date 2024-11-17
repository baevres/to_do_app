import { useContext } from 'react'
import { NavLink } from 'react-router-dom'

import AccountMenu from '../AccountMenu'

import LoggedInContext from '../../context/LoggedInContext.js'

const NavLinks = () => {
  const { loggedIn } = useContext(LoggedInContext)

  const routes = {
    publicLink: [
      {
        url: '/',
        title: 'Log in',
      },
      {
        url: '/signup',
        title: 'Sign up',
      },
    ],
    privatLink: [
      {
        url: '/',
        title: 'ToDo Boards',
      },
    ],
    404: { title: 'Not Found' },
  }

  const { publicLink, privatLink } = routes
  const visibleLinks = loggedIn ? privatLink : publicLink

  const generateNavLinks = (links) => {
    return links.map(({ url, title }) => {
      return (
        <NavLink
          to={url}
          key={title}
          className={({ isActive }) => {
            if (isActive) {
              document.title = title === 'ToDo Boards' ? 'Boards | ToDo' : title
              return 'selected-link'
            }
            return ''
          }}
        >
          {title}
        </NavLink>
      )
    })
  }
  const links = generateNavLinks(visibleLinks)

  return (
    <nav className="menu">
      {links}
      <AccountMenu />
    </nav>
  )
}

export default NavLinks
