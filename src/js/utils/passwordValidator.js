class PasswordValidator {
  errors = []

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

  minLength = (value, len, errorMessage) => {
    this.toggleError(value.length < len, errorMessage)
  }

  isReqiured = (value, errorMessage) => {
    this.toggleError(/ /.test(value), errorMessage)
  }

  hasNumber = (value, errorMessage) => {
    this.toggleError(!/\d/.test(value), errorMessage)
  }

  hasLowerCase = (value, errorMessage) => {
    this.toggleError(!/[a-z]/.test(value), errorMessage)
  }

  hasUpperCase = (value, errorMessage) => {
    this.toggleError(!/[A-Z]/.test(value), errorMessage)
  }

  hasSpecialSymbol = (value, errorMessage) => {
    this.toggleError(!/[!@#$%^&*]/.test(value), errorMessage)
  }

  confirmPassword = (value, comparison, errorMessage) => {
    this.toggleError(
      value !== comparison || !value || !comparison,
      errorMessage,
    )
  }

  validatePassword = (value, options) => {
    const {
      min,
      required,
      hasNumber,
      hasLowerCase,
      hasUpperCase,
      hasSpecialSymbol,
      confirmPassword,
      comparison,
    } = options
    if (min) {
      this.minLength(value, min, `Length should be more than ${min}`)
    }
    if (required) {
      this.isReqiured(value, 'Should not consist whitespaces')
    }
    if (hasNumber) {
      this.hasNumber(value, 'Should consist at least 1 number')
    }
    if (hasLowerCase) {
      this.hasLowerCase(value, 'Should consist at least 1 lower case letter')
    }
    if (hasUpperCase) {
      this.hasUpperCase(value, 'Should consist at least 1 capitalize letter')
    }
    if (hasSpecialSymbol) {
      this.hasSpecialSymbol(value, 'Should consist at least 1 special sign')
    }
    if (confirmPassword) {
      this.confirmPassword(value, comparison, 'Passwords do not match')
    }
    return this.errors
  }
}

export default PasswordValidator
