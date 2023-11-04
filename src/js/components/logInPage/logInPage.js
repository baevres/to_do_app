import renderPage from '../../services/renderPage.js'
import UserVerification from '../../services/userVerification.js'
import FieldValidator from '../../utils/fieldValidator.js'

const View = () => {
  const locator = '.app'
  const pageContent = `
  <div class="container">
    <form class="login" novalidate>
      <div class="field-wrapper">
        <div>
          <input
          type="text"
          id="email"
          class="edit-item-input"
          placeholder="test@mail.co"
          required
          />
          <label for="email" class="input-label">Email</label>
        </div>
      </div>

      <div class="field-wrapper">
        <div>
          <input
          type="password"
          id="password"
          class="edit-item-input"
          placeholder="Pa55word$"
          required
          />
          <label for="password" class="input-label">Password</label>
        </div>
      </div>

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
      fieldValidator.validateField('email', value, 'Invalid email')
      fieldValidator.validateField('required', value, 'The field is required')
    } else {
      fieldValidator.validateField('password', value, '', {
        min: 8,
        required: true,
        hasNumber: true,
        hasLowerCase: true,
        hasUpperCase: true,
        hasSpecialSymbol: true,
      })
      fieldValidator.validateField('required', value, 'The field is required')
    }

    if (deleteForm) {
      fieldValidator.removeErrorWrapper()
    }

    fieldValidator.renderErrors()
    this.errors = fieldValidator.getErrors()
  }

  validateAndLogin = () => {
    View()

    const inputs = document.querySelectorAll('input')
    const emailField = document.querySelector('#email')
    const passwordField = document.querySelector('#password')
    const form = document.querySelector('form')
    const button = document.querySelector('button')

    form.addEventListener('submit', (e) => {
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

      const formValidator = new FieldValidator(button)
      if (this.errors.length <= 0) {
        const result = this.userVerification.verifyUser(
          emailField.value,
          passwordField.value,
        )

        formValidator.toggleError(!result, 'Username and password do not match')
        formValidator.renderErrors()
        this.errors = formValidator.getErrors()

        if (this.errors.length <= 0) {
          this.setLoggedIn(result)
          window.location.reload()
        }
      } else {
        formValidator.renderErrors()
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
