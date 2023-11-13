import renderPage from '../renderPage/renderPage.js'
import FieldValidator from '../../utils/fieldValidator.js'

const View = () => {
  const locator = '.app'
  let fields = [
    'name',
    'age',
    'link',
    'gender',
    'phone',
    'login',
    'email',
    'password',
    'confirmPassword',
  ]
  fields = fields.map((field) => {
    let type, id, placeholder, label
    if (field !== 'gender') {
      switch (field) {
        case 'name':
          type = 'text'
          id = field
          placeholder = 'John'
          label = 'Name'
          break
        case 'age':
          type = 'number'
          id = field
          placeholder = '18'
          label = 'Age'
          break
        case 'link':
          type = 'text'
          id = field
          placeholder = 'proj-link.com'
          label = 'Link to your project'
          break
        case 'phone':
          type = 'tel'
          id = field
          placeholder = '+12(345)6789 or 123-456-7890'
          label = 'Phone number'
          break
        case 'login':
          type = 'text'
          id = field
          placeholder = 'john21'
          label = 'Login'
          break
        case 'email':
          type = 'text'
          id = field
          placeholder = 'john21@mail.co'
          label = 'Email'
          break
        case 'password':
          type = 'password'
          id = field
          placeholder = 'Pa55word$'
          label = 'Password'
          break
        case 'confirmPassword':
          type = 'password'
          id = field
          placeholder = 'Pa55word$'
          label = 'Confirm Password'
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
          data-validation
          required
          />
          <label for="${id}" class="input-label">${label}</label>
        </div>
      </div>
      `
    } else {
      type = 'text'
      id = field
      label = 'Gender'
      return `
        <div class="field-wrapper">
          <div class="${field}">
            <select
            type="${type}"
            id="${id}"
            class="edit-item-input"
            value=""
            data-validation
            required
            >
              <option value=""></option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
            <label for="${id}" class="input-label">${label}</label>
          </div>
        </div>
      `
    }
  })

  const pageContent = `
  <div class="container">
    <form class="registration" novalidate>
      
      ${fields.join('\n')}

      <button class="btn save-btn">Sign in</button>
    </form>
  </div>
  `
  renderPage(locator, pageContent)
}

const signUpPage = () => {
  View()

  const fieldsForValidation = document.querySelectorAll('[data-validation]')
  const form = document.querySelector('form')

  let errors = []

  const validateField = (field, parent, deleteForm = false) => {
    const fieldValidator = new FieldValidator(field, parent)
    const value = field.value

    fieldValidator.validateField('required', value, {
      errorMessage: 'The field is required.',
    })

    switch (field.id) {
      case 'age':
        fieldValidator.validateField('range', value, {
          min: 18,
          errorMessage: {
            minError: 'User is too young',
            maxError: 'User is too old',
          },
          max: 60,
        })
        break
      case 'link':
        fieldValidator.validateField('link', value, {
          errorMessage: 'Not a link',
        })
        break
      case 'phone':
        fieldValidator.validateField('tel', value, {
          errorMessage: 'Not a valid phone number',
        })
        break
      case 'email':
        fieldValidator.validateField('email', value, {
          errorMessage: 'Invalid email.',
        })
        break
      case 'password':
        fieldValidator.validateField('password', value, {
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
        fieldValidator.validateField('password', value, {
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

export default signUpPage
