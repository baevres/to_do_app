'use-strict'

import Router from './services/router.js'
import todoPage from './todoPage.js'
import LoginPage from './loginPage.js'
import signupPage from './signUp.js'
import logout from './services/logout.js'

const loginPage = new LoginPage()
const checkLoggedIn = loginPage.getLoggedIn

const routes = {
  publicLink: {
    '/': {
      view: './pages/logIn.html',
      title: 'Log in',
      func: loginPage.validateAndLogin,
    },
    '/signup': {
      view: './pages/signUp.html',
      title: 'Sign up',
      func: signupPage,
    },
    links: ['/', '/signup'],
  },
  privatLink: {
    '/': { view: './pages/todo.html', title: 'ToDo List', func: todoPage },
    '/logout': { view: null, title: 'Log out', func: logout },
    links: ['/', '/logout'],
  },
  404: { view: './pages/404.html', title: 'Not Found', func: null },
}

const router = new Router('.app', routes, checkLoggedIn)

window.route = router.route
window.onpopstate = router.handleLocation
router.generateNavLinks()
router.handleLocation()

document.addEventListener('DOMContentLoaded', () => {
  const links = document.querySelectorAll('.menu a')
  links.forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault()
      const target = e.target
      router.route(target)
    })
  })
})
