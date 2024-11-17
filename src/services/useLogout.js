import { useContext } from 'react'

import useHttp from '../hooks/httpHook.js'
import { ToastContext } from '../modules/ToastStack/index.js'

const useLogout = () => {
  const { request } = useHttp()
  const { setNewToast } = useContext(ToastContext)
  const url = 'http://localhost:5555/api/user/logout'

  const logout = async () => {
    try {
      await request(
        url,
        'POST',
        null,
        { 'Content-Type': 'text/plain' },
        'include',
      )
    } catch (err) {
      setNewToast(err.message)
    }
    // localStorage.removeItem('accessToken')
    // localStorage.setItem('loggedIn', JSON.stringify(false))
    // window.location.assign('/')
  }

  return { logout }
}

export default useLogout
