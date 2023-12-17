import request from './requests.js'

class UserVerification {
  #loggedIn = false
  #url = `http://localhost:5555/api`

  getUserByCreds = async (body) => {
    const url = this.#url + '/user/auth'
    const data = await request(
      url,
      'POST',
      body,
      { 'Content-Type': 'application/json' },
      'include',
    )
    return data
  }

  refreshToken = async () => {
    const url = this.#url + '/user/auth/refresh'
    const data = await request(
      url,
      'POST',
      null,
      { 'Content-Type': 'text/plain' },
      'include',
    )
    return data
  }

  setLoggedIn = (result) => {
    localStorage.setItem('loggedIn', JSON.stringify(result))
    this.#loggedIn = result
  }

  getLoggedIn = () => {
    if (!JSON.parse(localStorage.getItem('loggedIn'))) {
      localStorage.setItem('loggedIn', JSON.stringify(this.#loggedIn))
    }
    this.setLoggedIn(JSON.parse(localStorage.getItem('loggedIn')))
    return this.#loggedIn
  }

  verifyUser = async (email, password) => {
    const body = { email, password }

    const res = await this.getUserByCreds(body)
    return res
  }
}

export default UserVerification
