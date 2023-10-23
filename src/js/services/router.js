class Router {
  constructor(locator, routes, checkLoggedIn) {
    this.locator = locator
    this.routes = routes
    this.checkLoggedIn = checkLoggedIn
  }

  checkPath = () => {
    const path = window.location.pathname
    const { publicLink, privatLink } = this.routes
    const routes = this.checkLoggedIn() ? privatLink : publicLink
    if (!routes[path]) {
      return this.routes[404]
    }

    return routes[path]
  }

  handleLocation = async () => {
    const { view, title, func } = this.checkPath()

    if (window.location.pathname !== '/logout') {
      document.title = title
      const html = await fetch(view).then((data) => data.text())
      document.querySelector(this.locator).innerHTML = html
    }

    if (func) {
      func()
    }

    if (window.location.pathname === '/logout') {
      window.location.assign('/')
    }
  }

  route = (target) => {
    window.history.pushState({}, '', target.href)
    this.handleLocation()
    this.setActiveLink()
  }

  generateNavLinks = () => {
    const navWrapper = document.querySelector('nav')
    const { publicLink, privatLink } = this.routes
    const visibleLinks = this.checkLoggedIn() ? privatLink : publicLink

    const links = visibleLinks.links.map((link) => {
      const linkA = document.createElement('a')
      linkA.href = link
      linkA.setAttribute('data-link', link)
      linkA.textContent = visibleLinks[link].title

      return linkA
    })

    navWrapper.innerHTML = ''
    navWrapper.append(...links)

    this.setActiveLink()
  }

  setActiveLink = () => {
    const links = document.querySelectorAll('.menu a')
    links.forEach((link) => {
      if (link.getAttribute('data-link') === window.location.pathname) {
        link.classList.add('selected-link')
      } else {
        link.classList.remove('selected-link')
      }
    })
  }
}

export default Router
