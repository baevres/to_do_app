'use-strict'

import Router from './services/router.js'
import todoPage from './todoPage.js'

const routes = {
  '/': { view: './pages/todo.html', title: 'ToDo List' },
  '/login': { view: './pages/logIn.html', title: 'Log in' },
  '/signin': { view: './pages/signIn.html', title: 'Sign in' },
  404: { view: './pages/404.html', title: 'Not Found' },
}

const router = new Router('.app', routes)

window.route = router.route
window.onpopstate = router.handleLocation
router.handleLocation(todoPage)

document.addEventListener('DOMContentLoaded', () => {
  const links = document.querySelectorAll('.menu a')
  links.forEach((link) => {
    link.addEventListener('click', (e) => {
      if (e.target.tagName === 'A') {
        e.preventDefault()

        router.route(e, todoPage)
      }
    })
  })
})
