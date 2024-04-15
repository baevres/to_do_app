import { useEffect, useCallback, useState, useContext } from 'react'

import toastContext from '../context/ToastContext.js'

const ToastMessage = ({ id, message, type }) => {
  const [timer, setTimer] = useState(100)
  const { clearToast } = useContext(toastContext)

  const toastClass = type
  let interval

  const setNewInterval = useCallback(() => {
    return setInterval(() => {
      setTimer((timer) => timer - 1)
    }, 50)
  }, [id])

  const stopInterval = (interval) => {
    if (timer <= 0) {
      clearInterval(interval)
      setTimeout(() => {
        clearToast(id)
      }, 500)
    }
  }

  useEffect(() => {
    interval = setNewInterval()
    stopInterval(interval)

    return () => clearInterval(interval)
  }, [toastClass, id, timer])

  const hideClass = timer <= 0 ? ' hide' : ''

  return (
    <div
      className={`${toastClass}-toast-wrapper` + hideClass}
      onMouseEnter={() => {
        clearInterval(interval)
      }}
      onMouseLeave={() => {
        interval = setNewInterval()
        stopInterval(interval)
      }}
    >
      <div className={`${toastClass}-toast-content`}>{message}</div>
      <div className={`${toastClass}-toast-footer`}>
        <div
          className={`${toastClass}-toast-timer`}
          style={{ width: `${timer}%` }}
        ></div>
      </div>
      <div
        className={`${toastClass}-toast-close`}
        onClick={(e) => {
          e.currentTarget.parentElement.classList.add('hide')
          setTimeout(() => {
            clearToast(id)
          }, 500)
        }}
      >
        <svg
          width="20px"
          height="20px"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M10.9393 12L6.9696 15.9697L8.03026 17.0304L12 13.0607L15.9697 17.0304L17.0304 15.9697L13.0607 12L17.0303 8.03039L15.9696 6.96973L12 10.9393L8.03038 6.96973L6.96972 8.03039L10.9393 12Z"
            fill="#080341"
          />
        </svg>
      </div>
    </div>
  )
}

export default ToastMessage
