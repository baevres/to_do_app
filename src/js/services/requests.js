const request = async (
  url,
  method = 'GET',
  body = null,
  headers = { 'Content-Type': 'application/json' },
) => {
  try {
    if (body) {
      body = JSON.stringify(body)
    }
    const response = await fetch(url, { method, body, headers })

    const data = await response.json()
    return data
  } catch (e) {
    return e
  }
}

export default request
