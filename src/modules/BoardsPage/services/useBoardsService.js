import useHttp from '../../../hooks/httpHook'
// import { useUserVerification } from '../../LoginPage'
import getHeaders from '../../../utils/getHeaders'
import getResultOrError from '../../../utils/getResultOrError'

const useBoardsService = () => {
  const baseUrl = `http://localhost:5555/api/board`
  const { request } = useHttp()
  // const { refreshTokenAndMakeNewRequest } = useUserVerification()
  const { getResult } = getResultOrError()

  const getBoards = async () => {
    const data = await request(baseUrl, 'GET', null, getHeaders())
    // const newData = await refreshTokenAndMakeNewRequest(
    //   data,
    //   baseUrl,
    //   'GET',
    //   null,
    // )
    return getResult(data, baseUrl, 'GET', null)
  }

  const getBoard = async (boardId) => {
    const url = `${baseUrl}/${boardId}`
    const data = await request(url, 'GET', null, getHeaders())
    // const newData = await refreshTokenAndMakeNewRequest(data, url, 'GET', null)
    return getResult(data, url, 'GET', null)
  }

  const getBoardInvitedUsers = async (boardId) => {
    const url = `${baseUrl}/${boardId}/invited-users`
    const data = await request(url, 'GET', null, getHeaders())
    // const newData = await refreshTokenAndMakeNewRequest(data, url, 'GET', null)
    return getResult(data, url, 'GET', null)
  }

  const createBoard = async (body) => {
    const data = await request(baseUrl, 'POST', body, getHeaders())
    // const newData = await refreshTokenAndMakeNewRequest(
    //   data,
    //   baseUrl,
    //   'POST',
    //   body,
    // )
    return getResult(data, baseUrl, 'POST', body)
  }

  const updateBoard = async (boardId, body) => {
    const url = `${baseUrl}/${boardId}`
    const data = await request(url, 'PUT', body, getHeaders())
    // const newData = await refreshTokenAndMakeNewRequest(data, url, 'PUT', body)
    return getResult(data, url, 'PUT', body)
  }

  const deleteBoard = async (boardId, body) => {
    const url = `${baseUrl}/${boardId}`
    const data = await request(url, 'DELETE', body, getHeaders())
    // const newData = await refreshTokenAndMakeNewRequest(
    // data,
    // url,
    // 'DELETE',
    // body,
    // )
    return getResult(data, url, 'DELETE', body)
  }

  return {
    getBoards,
    getBoard,
    createBoard,
    updateBoard,
    deleteBoard,
    getBoardInvitedUsers,
  }
}

export default useBoardsService
