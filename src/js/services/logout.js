const logout = () => {
  localStorage.removeItem('accessToken')
  localStorage.setItem('loggedIn', JSON.stringify(false))
  window.location.assign('/')
}

export default logout
