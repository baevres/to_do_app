import renderPage from '../renderPage/renderPage.js'
import ErrorToast from '../errorToast/errorToast.js'

import UserVerification from '../../services/userVerification.js'

import FieldValidator from '../../utils/fieldValidator.js'

const View = () => {
  const locator = '.app'
  let fields = ['email', 'password']
  fields = fields.map((field) => {
    let type, id, placeholder, label
    switch (field) {
      case 'email':
        type = 'text'
        id = field
        placeholder = 'test@mail.co'
        label = 'Email'
        break
      case 'password':
        type = 'password'
        id = field
        placeholder = 'Pa55word$'
        label = 'Password'
        break
      default:
        type = ''
        id = ''
        placeholder = ''
        label = ''
        break
    }

    return `
      <div class="field-wrapper">
        <div>
          <input
          type="${type}"
          id="${id}"
          class="edit-item-input"
          placeholder="${placeholder}"
          required
          />
          <label for="${id}" class="input-label">${label}</label>
        </div>
      </div>
    `
  })

  const pageContent = `
  <div class="container">
    <form class="login" novalidate>
      
      ${fields.join('\n')}

      <div class="login-btn">
        <button class="btn save-btn">Log in</button>
      </div>
    </form>
  </div>
  `
  renderPage(locator, pageContent)
}

class LoginPage {
  userVerification = new UserVerification()
  errors = []

  validateField = (field, parent, deleteForm = false) => {
    const fieldValidator = new FieldValidator(field, parent)
    const value = field.value

    if (field.id === 'email') {
      fieldValidator.validateField('email', value, {
        errorMessage: 'Invalid email',
      })
      fieldValidator.validateField('required', value, {
        errorMessage: 'The field is required',
      })
    } else {
      fieldValidator.validateField('password', value, {
        min: 8,
        required: true,
        hasNumber: true,
        hasLowerCase: true,
        hasUpperCase: true,
        hasSpecialSymbol: true,
      })
      fieldValidator.validateField('required', value, {
        errorMessage: 'The field is required',
      })
    }

    if (deleteForm) {
      fieldValidator.removeErrorWrapper()
    }

    fieldValidator.renderErrors()
  }

  generateAcceptCookiesModal = () => {
    const wrapper = document.createElement('div')
    const modal = document.createElement('div')
    const text = document.createElement('div')
    const title = document.createElement('div')
    const body = document.createElement('div')
    const button = document.createElement('button')

    wrapper.classList.add('accept-cookies-wrapper')
    modal.classList.add('accept-cookies-modal')
    text.classList.add('accept-cookies-text')
    title.classList.add('title')
    body.classList.add('body')
    button.classList.add('accept-cookies-button', 'btn', 'save-btn')

    title.textContent = 'This website uses cookies'
    body.textContent =
      'We use cookies to personalise content and ads, to provide social media features and to analyse our traffic. We also share information about your use of our site with our social media, advertising and analytics partners who may combine it with other information that you’ve provided to them or that they’ve collected from your use of their services.'
    button.textContent = 'accept all'

    text.append(title, body)
    modal.append(text, button)
    wrapper.append(modal)

    return wrapper
  }

  removeAcceptCookiesModal = () => {
    const cookieWrapper = document.querySelector('.accept-cookies-wrapper')
    const button = cookieWrapper.querySelector('.accept-cookies-button')

    button.addEventListener('click', () => {
      cookieWrapper.classList.add('hide')
      setTimeout(() => cookieWrapper.remove(), 1000)
      localStorage.setItem('acceptCookies', true)
    })
  }

  acceptCookies = () => {
    if (!localStorage.getItem('acceptCookies')) {
      setTimeout(() => {
        const cookieWrapper = this.generateAcceptCookiesModal()
        document.body.prepend(cookieWrapper)
        this.removeAcceptCookiesModal()
      }, 1000)
    }
  }

  validateAndLogin = () => {
    View()
    this.acceptCookies()

    const inputs = document.querySelectorAll('input')
    const emailField = document.querySelector('#email')
    const passwordField = document.querySelector('#password')
    const form = document.querySelector('form')

    const errorToast = new ErrorToast('.container')

    form.addEventListener('submit', async (e) => {
      e.preventDefault()

      inputs.forEach((field) => {
        this.validateField(field, field.parentElement, true)
        inputs.forEach((field) => {
          field.addEventListener('blur', () => {
            this.validateField(field, field.parentElement, true)
          })
          field.addEventListener('input', () => {
            this.validateField(field, field.parentElement, true)
          })
        })
      })

      const errors = document.querySelectorAll('.error-message')
      if (errors.length <= 0) {
        try {
          const res = await this.userVerification.verifyUser(
            emailField.value,
            passwordField.value,
          )

          if (res && !res.type && res.message != 'Failed to fetch') {
            errorToast.setToast('Success', 'success')
            localStorage.setItem(
              'accessToken',
              JSON.stringify(res.content[0].accessToken),
            )
            setTimeout(() => {
              this.setLoggedIn(true)
              window.location.reload()
            }, 500)
          } else {
            errorToast.setToast(`Something went wrong - ${res.message}`)
          }
        } catch (err) {
          errorToast.setToast(`Something went wrong`)
        }
      }
    })
  }

  setLoggedIn = (result) => {
    this.userVerification.setLoggedIn(result)
  }

  getLoggedIn = () => {
    return this.userVerification.getLoggedIn()
  }
}

export default LoginPage
