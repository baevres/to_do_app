import renderPage from '../renderPage/renderPage.js'

const error404 = () => {
  const locator = '.app'
  const pageContent = `
  <div class="container">
    <h2>Error occured!</h2>
    <div>Please, return to available page</div>
  </div>
  `
  renderPage(locator, pageContent)
}

export default error404
