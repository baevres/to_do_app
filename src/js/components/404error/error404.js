const error404 = () => {
  const app = document.querySelector('.app')

  app.innerHTML = `
  <div class="container">
    <h2>Error occured!</h2>
    <div>Please, return to available page</div>
  </div>
  `
}

export default error404
