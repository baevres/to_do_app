import ToastMessage from './ToastMessage'

import './ToastStack.css'

const ToastStack = ({ toastList }) => {
  return (
    <ul className="toast-list">
      {toastList.map(({ id, message, type }) => (
        <li key={id}>
          <ToastMessage id={id} message={message} type={type} />
        </li>
      ))}
    </ul>
  )
}

export default ToastStack
