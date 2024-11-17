import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'

import FormTemplate from '../../FormTemplate'

import useUserRegistration from '../services/userRegistration'
import FieldValidator from '../../../utils/fieldValidator'
import { ToastContext } from '../../ToastStack'

const SignUpPage = () => {
  const { checkUniqueData, createNewUser } = useUserRegistration()
  const { setNewToast } = useContext(ToastContext)
  const navigate = useNavigate()

  const fieldsOpts = [
    {
      type: 'text',
      id: 'name',
      placeholder: 'John',
      label: 'Name',
      fieldClass: 'edit-item-input',
      labelClass: 'input-label',
    },
    {
      type: 'number',
      id: 'age',
      placeholder: '18',
      label: 'Age',
      fieldClass: 'edit-item-input',
      labelClass: 'input-label',
    },
    {
      type: 'text',
      id: 'link',
      placeholder: 'proj-link.com',
      label: 'Link to your project',
      fieldClass: 'edit-item-input',
      labelClass: 'input-label',
    },
    {
      type: 'select',
      id: 'gender',
      label: 'Gender',
      fieldClass: 'edit-item-input',
      labelClass: 'input-label',
      options: [
        {
          name: 'Male',
          value: 'male',
        },
        {
          name: 'Female',
          value: 'female',
        },
        {
          name: 'Other',
          value: 'other',
        },
      ],
    },
    {
      type: 'tel',
      id: 'phone',
      placeholder: '+12(345)6789 or 123-456-7890',
      label: 'Phone number',
      fieldClass: 'edit-item-input',
      labelClass: 'input-label',
    },
    {
      type: 'text',
      id: 'login',
      placeholder: 'john21',
      label: 'Login',
      fieldClass: 'edit-item-input',
      labelClass: 'input-label',
    },
    {
      type: 'text',
      id: 'email',
      placeholder: 'test@mail.co',
      label: 'Email',
      fieldClass: 'edit-item-input',
      labelClass: 'input-label',
    },
    {
      type: 'password',
      id: 'password',
      placeholder: 'Pa55word$',
      label: 'Password',
      fieldClass: 'edit-item-input',
      labelClass: 'input-label',
    },
    {
      type: 'password',
      id: 'confirmPassword',
      placeholder: 'Pa55word$',
      label: 'Confirm Password',
      fieldClass: 'edit-item-input',
      labelClass: 'input-label',
    },
  ]
  const formOpts = {
    formClass: 'registration',
    btn: 'Sign up',
    btnClass: 'login-btn',
  }

  const validationFunc = async (values) => {
    const errors = {}
    const fields = Object.keys(values)

    for (const field of fields) {
      const fieldValidator = new FieldValidator(field)
      const value = values[field]

      fieldValidator.validateField('required', value, {
        errorMessage: 'The field is required.',
      })

      switch (field) {
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
        case 'login':
          if (value) {
            const result = await checkUniqueData(value, 'login')
            fieldValidator.toggleError(
              result && result.content && result.content.length > 0,
              'Login is not unique',
            )
          }
          break
        case 'email':
          fieldValidator.validateField('email', value, {
            errorMessage: 'Invalid email.',
          })

          if (value) {
            const res = await checkUniqueData(value)
            fieldValidator.toggleError(
              res && res.content && res.content.length > 0,
              'Email is not unique',
            )
          }
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
          const password = values.password
          fieldValidator.validateField('password', value, {
            confirmPassword: true,
            comparison: password,
          })
          break
      }

      const error = fieldValidator.getErrors()[0]
      if (error && error.length > 0) errors[field] = error
    }

    return errors
  }
  const submitFunc = async (values) => {
    const res = await createNewUser(values)

    if (res && res.content.length === 1 && !res.type) {
      setNewToast('Success. You can log in with your credentials', 'success')

      navigate('/')
    }
  }

  return (
    <div className="container">
      <FormTemplate
        formOpts={formOpts}
        fieldsOpts={fieldsOpts}
        validationFunc={validationFunc}
        submitFunc={submitFunc}
      />
    </div>
  )
}

export default SignUpPage
