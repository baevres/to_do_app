'use-strict'

import todoPage from './components/todoPage/todoPage.js'
import LoginPage from './components/logInPage/logInPage.js'
import signUpPage from './components/signUpPage/signUpPage.js'
import error404 from './components/404error/error404.js'

import Router from './services/router.js'
import logout from './services/logout.js'

const loginPage = new LoginPage()
const checkLoggedIn = loginPage.getLoggedIn

const routes = {
  publicLink: {
    '/': {
      title: 'Log in',
      func: loginPage.validateAndLogin,
    },
    '/signup': {
      title: 'Sign up',
      func: signUpPage,
    },
    links: ['/', '/signup'],
  },
  privatLink: {
    '/': { title: 'ToDo List', func: todoPage },
    '/logout': { title: 'Log out', func: logout },
    links: ['/', '/logout'],
  },
  404: { title: 'Not Found', func: error404 },
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
