import { useContext } from 'react'

import useHttp from '../../../hooks/httpHook'
import logout from '../../../services/useLogout'
import getHeaders from '../../../utils/getHeaders'

import ControlStateContext from '../../../context/ControlStateContext'

const useUserVerification = () => {
  let loggedIn = false
  const baseUrl = `http://localhost:5555/api/user`
  const { request, loading } = useHttp()
  const { getIsRefresh, setIsRefresh, setIsLoading } =
    useContext(ControlStateContext)

  const getUserByCreds = async (body) => {
    const url = baseUrl + '/auth'
    const data = await request(
      url,
      'POST',
      body,
      { 'Content-Type': 'application/json' },
      'include',
    )
    return data
  }

  const getUserData = async (queryValue = '') => {
    const queryParams = queryValue
      ? `?email=${queryValue}&name=${queryValue}`
      : ''
    const url = `${baseUrl}/user-data${queryParams}`
    const data = await request(url, 'GET', null, getHeaders())
    const newData = await refreshTokenAndMakeNewRequest(data, url, 'GET', null)
    return newData
  }

  const refreshToken = async () => {
    const url = baseUrl + '/auth/refresh'
    const data = await request(
      url,
      'POST',
      null,
      { 'Content-Type': 'text/plain' },
      'include',
    )
    return data
  }

  const requestRefreshToken = async () => {
    try {
      const tokens = await refreshToken()
      if (tokens && tokens.content && !tokens.type) {
        const { accessToken } = tokens.content[0]
        localStorage.setItem('accessToken', JSON.stringify(accessToken))
        return tokens
      }
      throw tokens
    } catch (err) {
      setTimeout(async () => await logout(), 1000)
      return err
    }
  }

  const refreshTokenAndMakeNewRequest = async (data, url, method, body) => {
    const makeNewRequest = async () => {
      setIsLoading(true)
      const newData = await request(url, method, body, getHeaders())
      setIsLoading(false)
      return newData
    }

    if (data.reason === 'Unauthorized' && !getIsRefresh()) {
      setIsRefresh(true)
      const res = await requestRefreshToken()
      setIsRefresh(false)
      if (res.type) {
        return res
      }

      return makeNewRequest()
    } else if (data.reason === 'Unauthorized' && getIsRefresh()) {
      // let i = 0
      // while (getIsRefresh()) {
      //   i += 1
      //   if (!getIsRefresh() || i > 300) {
      //     break
      //   }
      // }
      // return makeNewRequest()
      return setTimeout(makeNewRequest, 500)
    } else return data
  }

  // const getIsRefresh = () => {
  //   if (!localStorage.getItem('isRefresh'))
  //     localStorage.setItem('isRefresh', JSON.stringify(isRefresh))
  //   isRefresh = JSON.parse(localStorage.getItem('isRefresh'))
  //   return isRefresh
  // }

  // const setIsRefresh = (newIsRefresh) => {
  //   localStorage.setItem('isRefresh', JSON.stringify(newIsRefresh))
  //   isRefresh = newIsRefresh
  // }

  const setLoggedIn = (result) => {
    localStorage.setItem('loggedIn', JSON.stringify(result))
    loggedIn = result
  }

  const getLoggedIn = () => {
    if (!JSON.parse(localStorage.getItem('loggedIn'))) {
      localStorage.setItem('loggedIn', JSON.stringify(loggedIn))
    }
    setLoggedIn(JSON.parse(localStorage.getItem('loggedIn')))
    return loggedIn
  }

  const verifyUser = async (email, password) => {
    const body = { email, password }

    const res = await getUserByCreds(body)
    return res
  }

  return {
    getUserByCreds,
    getUserData,
    refreshToken,
    setLoggedIn,
    getLoggedIn,
    verifyUser,
    refreshTokenAndMakeNewRequest,
    loading,
  }
}

export default useUserVerification
