const renderPage = (locator, pageContent) => {
  const parent = document.querySelector(locator)
  parent.innerHTML = pageContent
}

export default renderPage
