'use-strict'

import todoScript from './components/todoPage/todoScript.js'
import LoginPageScript from './components/logInPage/loginPageScript.js'
import signUpScript from './components/signUpPage/signUpScript.js'
import error404 from './components/404error/error404.js'

import Router from './services/router.js'
import logout from './services/logout.js'

const loginPage = new LoginPageScript()
const checkLoggedIn = loginPage.getLoggedIn

const routes = {
  publicLink: {
    '/': {
      title: 'Log in',
      func: loginPage.validateAndLogin,
    },
    '/signup': {
      title: 'Sign up',
      func: signUpScript,
    },
    links: ['/', '/signup'],
  },
  privatLink: {
    '/': { title: 'ToDo List', func: todoScript },
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
