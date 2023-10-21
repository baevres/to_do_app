import PasswordValidator from './passwordValidator.js'

class FieldValidator {
  errors = []
  passwordErrors = []
  errorWrapper = null

  constructor(fieldElement, parent = null) {
    this.field = fieldElement
    this.parent = parent
    this.passwordValidator = new PasswordValidator()
    this.validatePassword = this.passwordValidator.validatePassword
  }

  createErrorWrapper = () => {
    const div = document.createElement('div')
    div.classList.add('error-message')
    if (this.parent) {
      this.parent.after(div)
    } else {
      this.field.after(div)
    }
    return div
  }

  removeErrorWrapper = () => {
    if (this.parent) {
      const nextNode = this.parent.nextElementSibling
      if (nextNode && nextNode.classList.contains('error-message')) {
        this.errorWrapper = nextNode
      }
    }

    if (this.errorWrapper) {
      this.errorWrapper.remove()
    }
  }

  addError = (errorMessage) => {
    const index = this.errors.indexOf(errorMessage)
    if (index === -1) {
      this.errors.push(errorMessage)
    }
  }

  removeError = (errorMessage) => {
    const index = this.errors.indexOf(errorMessage)
    if (index > -1) {
      this.errors.splice(index)
    }
  }

  toggleError = (validation, errorMessage) => {
    if (validation) {
      this.addError(errorMessage)
    } else {
      this.removeError(errorMessage)
    }
  }

  getErrors = () => {
    return [...this.errors, ...this.passwordErrors]
  }

  validateField(func, value, errorMessage = '', options = {}) {
    switch (func) {
      case 'email':
        this.toggleError(!validator.isEmail(value), errorMessage)
        break
      case 'required':
        this.toggleError(
          validator.isEmpty(value, { ignore_whitespace: true }),
          errorMessage,
        )
        break
      case 'password':
        this.passwordErrors = this.validatePassword(value, options)
      default:
        null
    }
  }

  renderErrors = () => {
    const parentWrapper = this.field.parentElement
    this.errorWrapper = parentWrapper.querySelector('.error-message')
    const allErrors = this.getErrors()

    if (allErrors.length > 0) {
      this.field.classList.add('error')

      if (this.errorWrapper) {
        this.errorWrapper.innerHTML = ''
      } else {
        this.errorWrapper = this.createErrorWrapper()
      }

      allErrors.forEach((error) => {
        this.errorWrapper.innerHTML += error + '<br/>'
      })
    } else {
      this.field.classList.remove('error')
      this.removeErrorWrapper()
    }
  }
}

export default FieldValidator
