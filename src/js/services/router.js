class Router {
  constructor(locator) {
    this.locator = locator
  }

  routers = {
    '/': { view: './pages/todo.html', title: 'ToDo List' },
    '/login': { view: './pages/logIn.html', title: 'Log in' },
    '/signin': { view: './pages/signIn.html', title: 'Sign in' },
    404: { view: './pages/404.html', title: 'Not Found' },
  }

  checkPath = () => {
    const path = window.location.pathname
    if (!this.routers[path]) {
      return this.routers[404]
    }

    return this.routers[path]
  }

  handleLocation = async (func) => {
    const { view, title } = this.checkPath()

    document.title = title
    const html = await fetch(view).then((data) => data.text())
    document.querySelector(this.locator).innerHTML = html

    if (view.indexOf('todo') > -1) {
      func()
    }
  }

  route = (e, func) => {
    window.history.pushState({}, '', e.target.href)
    this.handleLocation(func)
  }
}

export default Router
