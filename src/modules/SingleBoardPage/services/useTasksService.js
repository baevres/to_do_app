import useHttp from '../../../hooks/httpHook'
// import { useUserVerification } from '../../LoginPage'
import getHeaders from '../../../utils/getHeaders'
import getResultOrError from '../../../utils/getResultOrError'

const useTasksService = () => {
  const baseUrl = `http://localhost:5555/api/board`
  const { request } = useHttp()
  // const { refreshTokenAndMakeNewRequest } = useUserVerification()
  const { getResult } = getResultOrError()

  const getTaskLists = async (boardId) => {
    const url = `${baseUrl}/${boardId}/task-list`
    const data = await request(url, 'GET', null, getHeaders())
    // const newData = await refreshTokenAndMakeNewRequest(data, url, 'GET', null)
    return getResult(data, url, 'GET', null)
  }

  const getSingleTaskList = async (boardId, taskListId) => {
    const url = `${baseUrl}/${boardId}/task-list/${taskListId}`
    const data = await request(url, 'GET', null, getHeaders())
    // const newData = await refreshTokenAndMakeNewRequest(data, url, 'GET', null)
    return getResult(data, url, 'GET', null)
  }

  const createTaskList = async (boardId, body) => {
    const url = `${baseUrl}/${boardId}/task-list`
    const data = await request(url, 'POST', body, getHeaders())
    // const newData = await refreshTokenAndMakeNewRequest(data, url, 'POST', body)
    return getResult(data, url, 'POST', body)
  }

  const updateTaskList = async (boardId, taskListId, body) => {
    const url = `${baseUrl}/${boardId}/task-list/${taskListId}`
    const data = await request(url, 'PUT', body, getHeaders())
    // const newData = await refreshTokenAndMakeNewRequest(data, url, 'PUT', body)
    return getResult(data, url, 'PUT', body)
  }

  const deleteTaskList = async (boardId, taskListId, body) => {
    const url = `${baseUrl}/${boardId}/task-list/${taskListId}`
    const data = await request(url, 'DELETE', body, getHeaders())
    // const newData = await refreshTokenAndMakeNewRequest(
    // data,
    // url,
    // 'DELETE',
    // body,
    // )
    return getResult(data, url, 'DELETE', body)
  }

  const getTasks = async (boardId, taskListId) => {
    const url = `${baseUrl}/${boardId}/task-list/${taskListId}/task`
    const data = await request(url, 'GET', null, getHeaders())
    // const newData = await refreshTokenAndMakeNewRequest(data, url, 'GET', null)
    return getResult(data, url, 'GET', null)
  }

  const getSingleTask = async (boardId, taskListId, taskId) => {
    const url = `${baseUrl}/${boardId}/task-list/${taskListId}/task/${taskId}`
    const data = await request(url, 'GET', null, getHeaders())
    // const newData = await refreshTokenAndMakeNewRequest(data, url, 'GET', null)
    return getResult(data, url, 'GET', null)
  }

  const getBoardTasks = async (boardId, taskFilter = 'all') => {
    let queryParams = ''
    if (taskFilter !== 'all') {
      const params = taskFilter === 'completed'
      queryParams = `?checked=${params}`
    }
    const url = `${baseUrl}/${boardId}/board-task${queryParams}`
    const data = await request(url, 'GET', null, getHeaders())
    // const newData = await refreshTokenAndMakeNewRequest(data, url, 'GET', null)
    return getResult(data, url, 'GET', null)
  }

  const createTask = async (boardId, taskListId, body) => {
    const url = `${baseUrl}/${boardId}/task-list/${taskListId}/task`
    const data = await request(url, 'POST', body, getHeaders())
    // const newData = await refreshTokenAndMakeNewRequest(data, url, 'POST', body)
    return getResult(data, url, 'POST', body)
  }

  const updateTasks = async (boardId, taskListId, body) => {
    const url = `${baseUrl}/${boardId}/task-list/${taskListId}/task`
    const data = await request(url, 'PUT', body, getHeaders())
    // const newData = await refreshTokenAndMakeNewRequest(data, url, 'PUT', body)
    return getResult(data, url, 'PUT', body)
  }

  const updateSingleTask = async (boardId, taskListId, taskId, body) => {
    const url = `${baseUrl}/${boardId}/task-list/${taskListId}/task/${taskId}`
    const data = await request(url, 'PUT', body, getHeaders())
    // const newData = await refreshTokenAndMakeNewRequest(data, url, 'PUT', body)
    return getResult(data, url, 'PUT', body)
  }

  const deleteTasks = async (boardId, taskListId) => {
    const url = `${baseUrl}/${boardId}/task-list/${taskListId}/task`
    const data = await request(url, 'DELETE', null, getHeaders())
    // const newData = await refreshTokenAndMakeNewRequest(
    //   data,
    //   url,
    //   'DELETE',
    //   null,
    // )
    return getResult(data, url, 'DELETE', null)
  }

  const deleteSingleTask = async (boardId, taskListId, taskId, body) => {
    const url = `${baseUrl}/${boardId}/task-list/${taskListId}/task/${taskId}`
    const data = await request(url, 'DELETE', body, getHeaders())
    // const newData = await refreshTokenAndMakeNewRequest(
    //   data,
    //   url,
    //   'DELETE',
    //   body,
    // )
    return getResult(data, url, 'DELETE', body)
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
