class UserVerification {
  username = 'username@test.co'
  password = 'Fishki123$'
  #loggedIn = false

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

  verifyUser = (username, password) => {
    return username === this.username && password === this.password
      ? true
      : false
  }
}

export default UserVerification
