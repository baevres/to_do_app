import useHttp from '../../../hooks/httpHook'

import { useUserVerification } from '../../LoginPage'

const useTasksService = () => {
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

  const getTaskLists = async (boardId) => {
    const url = `${baseUrl}/${boardId}/task-list`
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

  const getSingleTaskList = async (boardId, taskListId) => {
    const url = `${baseUrl}/${boardId}/task-list/${taskListId}`
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

  const createTaskList = async (boardId, body) => {
    const url = `${baseUrl}/${boardId}/task-list`
    const data = await request(url, 'POST', body, getHeaders())
    const newData = await refreshTokenAndMakeNewRequest(
      data,
      url,
      'POST',
      body,
      getHeaders,
    )
    return newData
  }

  const updateTaskList = async (boardId, taskListId, body) => {
    const url = `${baseUrl}/${boardId}/task-list/${taskListId}`
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

  const deleteTaskList = async (boardId, taskListId, body) => {
    const url = `${baseUrl}/${boardId}/task-list/${taskListId}`
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

  const getTasks = async (boardId, taskListId) => {
    const url = `${baseUrl}/${boardId}/task-list/${taskListId}/task`
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

  const getSingleTask = async (boardId, taskListId, taskId) => {
    const url = `${baseUrl}/${boardId}/task-list/${taskListId}/task/${taskId}`
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

  const getBoardTasks = async (boardId, taskFilter = 'all') => {
    let queryParams = ''
    if (taskFilter !== 'all') {
      const params = taskFilter === 'completed'
      queryParams = `?checked=${params}`
    }
    const url = `${baseUrl}/${boardId}/board-tasks${queryParams}`
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

  const createTask = async (boardId, taskListId, body) => {
    const url = `${baseUrl}/${boardId}/task-list/${taskListId}/task`
    const data = await request(url, 'POST', body, getHeaders())
    const newData = await refreshTokenAndMakeNewRequest(
      data,
      url,
      'POST',
      body,
      getHeaders,
    )
    return newData
  }

  const updateTasks = async (boardId, taskListId, body) => {
    const url = `${baseUrl}/${boardId}/task-list/${taskListId}/task`
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

  const updateSingleTask = async (boardId, taskListId, taskId, body) => {
    const url = `${baseUrl}/${boardId}/task-list/${taskListId}/task/${taskId}`
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

  const deleteTasks = async (boardId, taskListId) => {
    const url = `${baseUrl}/${boardId}/task-list/${taskListId}/task`
    const data = await request(url, 'DELETE', null, getHeaders())
    const newData = await refreshTokenAndMakeNewRequest(
      data,
      url,
      'DELETE',
      null,
      getHeaders,
    )
    return newData
  }

  const deleteSingleTask = async (boardId, taskListId, taskId, body) => {
    const url = `${baseUrl}/${boardId}/task-list/${taskListId}/task/${taskId}`
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

  return {
    getTaskLists,
    getSingleTaskList,
    getBoardTasks,
    createTaskList,
    updateTaskList,
    getTasks,
    getSingleTask,
    createTask,
    updateTasks,
    updateSingleTask,
    deleteTaskList,
    deleteTasks,
    deleteSingleTask,
  }
}

export default useTasksService
