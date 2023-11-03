import signUpView from './signUpView.js'

import FieldValidator from '../../utils/fieldValidator.js'

const signUpScript = () => {
  signUpView()

  const fieldsForValidation = document.querySelectorAll('[data-validation]')
  const form = document.querySelector('form')

  let errors = []

  const validateField = (field, parent, deleteForm = false) => {
    const fieldValidator = new FieldValidator(field, parent)
    const value = field.value

    fieldValidator.validateField('required', value, 'The field is required.')

    switch (field.id) {
      case 'age':
        fieldValidator.validateField('range', value, '', {
          min: 18,
          minError: 'User is too young',
          max: 60,
          maxError: 'User is too old',
        })
        break
      case 'link':
        fieldValidator.validateField('link', value, 'Not a link')
        break
      case 'phone':
        fieldValidator.validateField('tel', value, 'Not a valid phone number')
        break
      case 'email':
        fieldValidator.validateField('email', value, 'Invalid email.')
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
        break
      case 'confirmPassword':
        const password = document.querySelector('#password').value
        fieldValidator.validateField('password', value, '', {
          confirmPassword: true,
          comparison: password,
        })
        break
    }

    if (deleteForm) {
      fieldValidator.removeErrorWrapper()
    }

    fieldValidator.renderErrors()
    errors = fieldValidator.getErrors()
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault()

    fieldsForValidation.forEach((field) => {
      validateField(field, field.parentElement, true)
      field.addEventListener('blur', () => {
        validateField(field, field.parentElement, true)
      })
      field.addEventListener('input', () => {
        validateField(field, field.parentElement, true)
      })
    })

    if (errors.length <= 0) {
      console.log('Success')
    }
  })
}

export default signUpScript
