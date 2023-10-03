'use-strict'

import Router from './services/router.js'
import todoPage from './todoPage.js'

const router = new Router('.app')

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
