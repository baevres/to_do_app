import request from './requests.js'

const logout = async () => {
  const url = 'http://localhost:5555/api/user/logout'
  await request(url, 'POST', null, { 'Content-Type': 'text/plain' }, 'include')
  localStorage.removeItem('accessToken')
  localStorage.setItem('loggedIn', JSON.stringify(false))
  window.location.assign('/')
}

export default logout
