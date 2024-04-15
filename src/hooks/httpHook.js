import { useState, useCallback } from 'react'

const useHttp = () => {
  const [loading, setLoading] = useState(false)

  const request = useCallback(
    async (
      url,
      method = 'GET',
      body = null,
      headers = { 'Content-Type': 'application/json' },
      credentials = 'same-origin',
    ) => {
      setLoading(true)

      if (body) {
        body = JSON.stringify(body)
      }

      try {
        const response = await fetch(url, {
          method,
          body,
          headers,
          credentials,
        })

        const data = await response.json()
        setLoading(false)
        return data
      } catch (e) {
        setLoading(false)
        return e
      }
    },
    [],
  )
  return { request, loading }
}

export default useHttp
