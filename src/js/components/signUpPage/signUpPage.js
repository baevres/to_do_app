import renderPage from '../../services/renderPage.js'
import FieldValidator from '../../utils/fieldValidator.js'

const View = () => {
  const locator = '.app'
  const pageContent = `
  <div class="container">
    <form class="registration" novalidate>
      <div class="field-wrapper">
        <div>
          <input
          type="text"
          id="name"
          class="edit-item-input"
          placeholder="John"
          data-validation
          required
          />
          <label for="name" class="input-label">Name</label>
        </div>
      </div>

      <div class="field-wrapper">
        <div>
          <input
          type="number"
          id="age"
          class="edit-item-input"
          placeholder="18"
          data-validation
          required
          />
          <label for="age" class="input-label">Age</label>
        </div>
      </div>

      <div class="field-wrapper">
        <div>
          <input
          type="text"
          id="link"
          class="edit-item-input"
          placeholder="proj-link.com"
          data-validation
          required
          />
          <label for="link" class="input-label">Link to your project</label>
        </div>
      </div>

      <div class="field-wrapper">
        <div class="gender">
          <select
          type="text"
          id="gender"
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
          <label for="gender" class="input-label">Gender</label>
        </div>
      </div>

      <div class="field-wrapper">
        <div>
          <input
          type="tel"
          id="phone"
          class="edit-item-input"
          placeholder="+12(345)6789 or 123-456-7890"
          data-validation
          required
          />
          <label for="phone" class="input-label">Phone number</label>
        </div>
      </div>

      <div class="field-wrapper">
        <div>
          <input
          type="text"
          id="login"
          class="edit-item-input"
          placeholder="john21"
          data-validation
          required
          />
          <label for="login" class="input-label">Login</label>
        </div>
      </div>

      <div class="field-wrapper">
        <div>
          <input
          type="text"
          id="email"
          class="edit-item-input"
          placeholder="john21@mail.co"
          data-validation
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
          placeholder="Pa55word#"
          data-validation
          required
          />
          <label for="password" class="input-label">Password</label>
        </div>
      </div>

      <div class="field-wrapper">
        <div>
          <input
          type="password"
          id="confirmPassword"
          class="edit-item-input"
          placeholder="Pa55word#"
          data-validation
          required
          />
          <label for="confirmPassword" class="input-label">
          Confirm Password</label>
        </div>
      </div>

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
