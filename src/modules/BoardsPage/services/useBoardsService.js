import useHttp from '../../../hooks/httpHook.js'
import { useUserVerification } from '../../LoginPage/index.js'

const useBoardsService = () => {
  const baseUrl = `http://localhost:5555/api/board`
  const { request } = useHttp()
  const { refreshTokenAndMakeNewRequest } = useUserVerification()

  const getHeaders = () => {
    const accessToken = JSON.parse(localStorage.getItem('accessToken'))
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    }

    return headers
  }

  const getBoards = async () => {
    const data = await request(baseUrl, 'GET', null, getHeaders())
    const newData = await refreshTokenAndMakeNewRequest(
      data,
      baseUrl,
      'GET',
      null,
      getHeaders,
    )
    return newData
  }

  const getBoard = async (boardId) => {
    const url = `${baseUrl}/${boardId}`
    const data = await request(url, 'GET', null, getHeaders())
    const newData = await refreshTokenAndMakeNewRequest(
      data,
      url,
      'GET',
      null,
      getHeaders,
    )
    return newData
  }

  const createBoard = async (body) => {
    const data = await request(baseUrl, 'POST', body, getHeaders())
    const newData = await refreshTokenAndMakeNewRequest(
      data,
      baseUrl,
      'POST',
      body,
      getHeaders,
    )
    return newData
  }

  const updateBoard = async (boardId, body) => {
    const url = `${baseUrl}/${boardId}`
    const data = await request(url, 'PUT', body, getHeaders())
    const newData = await refreshTokenAndMakeNewRequest(
      data,
      url,
      'PUT',
      body,
      getHeaders,
    )
    return newData
  }

  const deleteBoard = async (boardId, body) => {
    const url = `${baseUrl}/${boardId}`
    const data = await request(url, 'DELETE', body, getHeaders())
    const newData = await refreshTokenAndMakeNewRequest(
      data,
      url,
      'DELETE',
      body,
      getHeaders,
    )
    return newData
  }

  return { getBoards, getBoard, createBoard, updateBoard, deleteBoard }
}

export default useBoardsService
