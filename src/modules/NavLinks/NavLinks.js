import { NavLink } from 'react-router-dom'

import logout from '../../services/logout.js'

const NavLinks = ({ isLoggedIn }) => {
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
      {
        url: '/logout',
        title: 'Log out',
      },
    ],
    404: { title: 'Not Found' },
  }

  const { publicLink, privatLink } = routes
  const visibleLinks = isLoggedIn ? privatLink : publicLink

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
          onClick={() => {
            if (title === 'Log out') logout()
          }}
        >
          {title}
        </NavLink>
      )
    })
  }
  const links = generateNavLinks(visibleLinks)

  return <nav className="menu">{links}</nav>
}

export default NavLinks
