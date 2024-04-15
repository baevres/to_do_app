import { createContext } from 'react'

const ToastContext = createContext({
  id: null,
  isToast: false,
  type: '', // error | success | info
  message: '',
  setNewToast: () => {},
  clearToast: () => {},
})

export default ToastContext
