import { useContext } from 'react'

import FormTemplate, { FormTemplateNew } from '../../FormTemplate'

import useUserVerification from '../services/useUserVerification.js'
import PasswordValidator from '../../../utils/passwordValidator.js'
import { ToastContext } from '../../ToastStack'
import LoggedInContext from '../../../context/LoggedInContext.js'

const LoginPage = () => {
  const { verifyUser } = useUserVerification()
  const { setLoggedIn } = useContext(LoggedInContext)
  const { setNewToast } = useContext(ToastContext)

  const fieldsOpts = [
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
  ]
  const formOpts = {
    formClass: 'login',
    btn: 'Log in',
    btnClass: 'login-btn',
  }

  const passwordValidator = new PasswordValidator()
  const validatePassword = passwordValidator.validatePassword

  const validationFunc = ({ email, password }) => {
    const errors = {}
    if (!email) {
      errors.email = 'The field is required'
    } else if (!/[a-z0-9]+@[a-z]+\.[a-z]{2,3}/.test(email)) {
      errors.email = 'Invalid email'
    }

    if (!password) {
      errors.password = 'The field is required'
    } else {
      const error = validatePassword(password, {
        min: 8,
        required: true,
        hasNumber: true,
        hasLowerCase: true,
        hasUpperCase: true,
        hasSpecialSymbol: true,
      })
      if (error) errors.password = error
    }

    return errors
  }
  const submitFunc = async ({ email, password }) => {
    try {
      const res = await verifyUser(email, password)

      if (res && !res.type && res.message !== 'Failed to fetch') {
        setNewToast('Success', 'success')
        localStorage.setItem(
          'accessToken',
          JSON.stringify(res.content[0].accessToken),
        )
        localStorage.setItem('loggedIn', JSON.stringify(true))
        setLoggedIn(true)
      }
    } catch (err) {
      setNewToast(`Something went wrong`)
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

export default LoginPage
