class Router {
  constructor(locator, routes) {
    this.locator = locator
    this.routes = routes
  }

  mainPath = '/'

  checkPath = () => {
    const path = window.location.pathname
    if (!this.routes[path]) {
      return this.routes[404]
    }

    return this.routes[path]
  }

  handleLocation = async (func) => {
    const { view, title } = this.checkPath()

    document.title = title
    const html = await fetch(view).then((data) => data.text())
    document.querySelector(this.locator).innerHTML = html

    if (view === this.routes[this.mainPath].view) {
      func()
    }
  }

  route = (e, func) => {
    window.history.pushState({}, '', e.target.href)
    this.handleLocation(func)
  }
}

export default Router
