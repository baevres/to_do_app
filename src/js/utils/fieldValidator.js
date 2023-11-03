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
    if (typeof this.passwordErrors === 'string') {
      return [...this.errors, this.passwordErrors]
    } else return [...this.errors, ...this.passwordErrors]
  }

  validateField(func, value, errorMessage = '', options = {}) {
    if (value) {
      switch (func) {
        case 'email':
          this.toggleError(!validator.isEmail(value), errorMessage)
          break
        case 'password':
          this.passwordErrors = this.validatePassword(value, options)
          break
        case 'range':
          value = +value
          if (typeof value === 'number' && value > 0) {
            const { min, minError, max, maxError } = options
            this.toggleError(value < min, minError)
            this.toggleError(value > max, maxError)
          } else
            this.toggleError(true, 'Should be a valid number greater than 0')
          break
        case 'link':
          this.toggleError(
            !/((https?|ftp):\/\/)?[\w-]+(\.[\w-]+)+([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?/.test(
              value,
            ),
            errorMessage,
          )
          break
        case 'tel':
          if (!/[a-zA-Z]/.test(value)) {
            if (value.length >= 8) {
              this.toggleError(
                !/^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/.test(value),
                errorMessage,
              )
            } else this.toggleError(true, 'Too short number')
          } else this.toggleError(true, 'Should not contain letters')
          break
        default:
          null
      }
    } else {
      if (func === 'required') {
        this.toggleError(
          validator.isEmpty(value, { ignore_whitespace: true }),
          errorMessage,
        )
      }
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
        this.errorWrapper.innerHTML += error + ' '
      })
    } else {
      this.field.classList.remove('error')
      this.removeErrorWrapper()
    }
  }
}

export default FieldValidator
