const getHeaders = () => {
  const accessToken = JSON.parse(localStorage.getItem('accessToken'))
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${accessToken}`,
  }

  return headers
}

export default getHeaders
