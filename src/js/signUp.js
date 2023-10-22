import FieldValidator from './utils/fieldValidator.js'

const signupPage = () => {
  const inputs = document.querySelectorAll('input')
  const form = document.querySelector('form')

  let errors = []

  const validateField = (field) => {
    const fieldValidator = new FieldValidator(field)
    const value = field.value

    switch (field.id) {
      case 'email':
        fieldValidator.validateField('email', value, 'Invalid email')
        fieldValidator.validateField('required', value, 'The field is required')
        break
      case 'login':
        fieldValidator.validateField('required', value, 'The field is required')
        break
      case 'password':
        fieldValidator.validateField('password', value, '', {
          min: 8,
          required: true,
          hasNumber: true,
          hasLowerCase: true,
          hasUpperCase: true,
          hasSpecialSymbol: true,
        })
        fieldValidator.validateField('required', value, 'The field is required')
        break
      case 'confirmPassword':
        const password = document.querySelector('#password').value
        fieldValidator.validateField('password', value, '', {
          confirmPassword: true,
          comparison: password,
        })
    }

    fieldValidator.renderErrors()
    errors = fieldValidator.getErrors()
  }

  inputs.forEach((field) => {
    field.addEventListener('blur', () => {
      validateField(field)
    })
  })

  form.addEventListener('submit', (e) => {
    e.preventDefault()

    inputs.forEach((field) => {
      validateField(field)
    })

    if (errors.length <= 0) {
      console.log('Success')
    } else {
      console.log('Failure')
    }
  })
}

export default signupPage
