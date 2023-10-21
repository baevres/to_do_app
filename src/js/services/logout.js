const logout = () => {
  localStorage.setItem('loggedIn', JSON.stringify(false))
  window.location.reload()
}

export default logout
