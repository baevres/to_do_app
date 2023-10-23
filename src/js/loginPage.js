import UserVerification from './services/userVerification.js'
import FieldValidator from './utils/fieldValidator.js'

class LoginPage {
  userVerification = new UserVerification()
  errors = []

  validateField = (field) => {
    const fieldValidator = new FieldValidator(field)
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

    fieldValidator.renderErrors()
    this.errors = fieldValidator.getErrors()
  }

  validateAndLogin = () => {
    const inputs = document.querySelectorAll('input')
    const emailField = document.querySelector('#email')
    const passwordField = document.querySelector('#password')
    const form = document.querySelector('form')
    const button = document.querySelector('button')

    inputs.forEach((field) => {
      field.addEventListener('blur', () => {
        this.validateField(field)
      })
      field.addEventListener('input', () => {
        this.validateField(field)
      })
    })

    form.addEventListener('submit', (e) => {
      e.preventDefault()

      inputs.forEach((field) => {
        this.validateField(field)
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
        console.log('error')
        formValidator.toggleError(true, 'Unresolved errors')
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
