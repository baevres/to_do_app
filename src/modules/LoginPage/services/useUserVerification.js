import useHttp from '../../../hooks/httpHook.js'
import logout from '../../../services/logout.js'

const useUserVerification = () => {
  let loggedIn = false
  const baseUrl = `http://localhost:5555/api/user`
  const { request } = useHttp()

  const getHeaders = () => {
    const accessToken = JSON.parse(localStorage.getItem('accessToken'))
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    }

    return headers
  }

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
    const newData = await refreshTokenAndMakeNewRequest(
      data,
      url,
      'GET',
      null,
      getHeaders,
    )
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

  const refreshTokenAndMakeNewRequest = async (
    data,
    url,
    method,
    body,
    getHeaders,
  ) => {
    if (data.reason === 'Unauthorized') {
      const res = await requestRefreshToken()
      if (res.type) return res

      return await request(url, method, body, getHeaders())
    }
    return data
  }

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
  }
}

export default useUserVerification
