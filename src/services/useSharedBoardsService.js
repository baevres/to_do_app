import useHttp from '../hooks/httpHook'
// import { useUserVerification } from '../modules/LoginPage'
import getHeaders from '../utils/getHeaders'
import getResultOrError from '../utils/getResultOrError'

const useSharedBoardsService = () => {
  const baseUrl = `http://localhost:5555/api/shared-board`
  const { request } = useHttp()
  // const { refreshTokenAndMakeNewRequest } = useUserVerification()
  const { getResult } = getResultOrError()

  const getSharedBoards = async () => {
    const data = await request(baseUrl, 'GET', null, getHeaders())
    // const newData = await refreshTokenAndMakeNewRequest(
    //   data,
    //   baseUrl,
    //   'GET',
    //   null,
    // )
    return getResult(data, baseUrl, 'GET', null)
  }

  const inviteUser = async (boardId, body) => {
    const url = `${baseUrl}/${boardId}`
    const data = await request(url, 'POST', body, getHeaders())
    // const newData = await refreshTokenAndMakeNewRequest(data, url, 'POST', body)
    return getResult(data, url, 'POST', body)
  }

  const deleteInvitedUser = async (boardId, body) => {
    const url = `${baseUrl}/${boardId}`
    const data = await request(url, 'DELETE', body, getHeaders())
    // const newData = await refreshTokenAndMakeNewRequest(
    //   data,
    //   url,
    //   'DELETE',
    //   body,
    // )
    return getResult(data, url, 'DELETE', body)
  }

  return { getSharedBoards, inviteUser, deleteInvitedUser }
}

export default useSharedBoardsService
