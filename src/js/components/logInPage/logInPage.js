import renderPage from '../renderPage/renderPage.js'
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
