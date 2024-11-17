import { useContext } from 'react'

import { ToastContext } from '../modules/ToastStack'
import { useUserVerification } from '../modules/LoginPage'
import useLogout from '../services/useLogout'

const getResultOrError = () => {
  const { setNewToast } = useContext(ToastContext)
  const { refreshTokenAndMakeNewRequest } = useUserVerification()

  const { logout } = useLogout()

  const getResult = async (response, url = '', method = '', body = null) => {
    try {
      if (response.reason || !response.content) {
        if (response.reason === 'Unauthorized') {
          const res = await refreshTokenAndMakeNewRequest(
            response,
            url,
            method,
            body,
          )

          if (res.type) throw res
          else return res
        }

        throw response
      }

      return response
    } catch (err) {
      setNewToast(err.message)
      // if (err.reason === 'Unauthorized') logout()
      return err
    }
  }

  return { getResult }
}

export default getResultOrError
