const svg = `
  <svg width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path fill-rule="evenodd" clip-rule="evenodd" d="M10.9393 12L6.9696 15.9697L8.03026 17.0304L12 13.0607L15.9697 17.0304L17.0304 15.9697L13.0607 12L17.0303 8.03039L15.9696 6.96973L12 10.9393L8.03038 6.96973L6.96972 8.03039L10.9393 12Z" fill="#080341"/>
  </svg>
`

class ErrorToast {
  view = (text, toastClass) => {
    const wrapper = document.createElement('div')
    const content = document.createElement('div')
    const footer = document.createElement('div')
    const timer = document.createElement('div')
    const close = document.createElement('div')

    wrapper.classList.add(`${toastClass}-toast-wrapper`)

    content.classList.add(`${toastClass}-toast-content`)
    content.textContent = text

    footer.classList.add(`${toastClass}-toast-footer`)
    timer.classList.add(`${toastClass}-toast-timer`)

    close.classList.add(`${toastClass}-toast-close`)
    close.innerHTML = svg

    footer.append(timer)
    wrapper.append(content, footer, close)

    return wrapper
  }

  constructor(locator) {
    this.parentElem = document.querySelector(locator)
  }

  runTimer = (toastClass = 'error') => {
    const errorWrapper = this.parentElem.querySelector(
      `.${toastClass}-toast-wrapper`,
    )
    const timer = this.parentElem.querySelector(`.${toastClass}-toast-timer`)
    const close = this.parentElem.querySelector(`.${toastClass}-toast-close`)
    let t = 100

    const clear = (interval) => {
      errorWrapper.classList.add('hide')
      setTimeout(() => this.removeError(toastClass), 500)

      clearInterval(interval)
    }
    const interval = setInterval(() => {
      timer.style.width = t + '%'
      t--

      if (t <= 0) {
        clear(interval)
      }
    }, 50)

    close.addEventListener('click', () => clear(interval))
  }

  removeError = (toastClass = 'error') => {
    const view = this.parentElem.querySelector(`.${toastClass}-toast-wrapper`)
    if (view && view.classList.contains('hide')) {
      this.parentElem.removeChild(view)
    }
  }

  setToast = (errorMessage, toastClass = 'error') => {
    if (!this.parentElem.querySelector(`.${toastClass}-toast-wrapper`)) {
      const view = this.view(errorMessage, toastClass)
      this.parentElem.append(view)

      this.runTimer(toastClass)
    }
  }
}

export default ErrorToast
