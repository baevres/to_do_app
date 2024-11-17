import useHttp from '../../../hooks/httpHook.js'
import getResultOrError from '../../../utils/getResultOrError.js'

const useUserRegistration = () => {
  const baseUrl = `http://localhost:5555/api`
  const { request } = useHttp()
  const { getResult } = getResultOrError()

  const getUsersUniqueData = async (value, type) => {
    const url = baseUrl + `/user?${type}=${value}`
    const data = await request(url)
    return data
  }

  const postData = async (body) => {
    const url = baseUrl + `/user/create`
    const data = await request(url, 'POST', body)
    return data
  }

  const checkUniqueData = async (value, type = 'email') => {
    const res = await getUsersUniqueData(value, type)

    return getResult(res)
  }

  const createNewUser = async (values) => {
    values.age = +values.age

    let res
    try {
      res = await postData(values)
    } catch (err) {
      return err
    }
    return getResult(res)
  }

  return { checkUniqueData, createNewUser }
}

export default useUserRegistration
