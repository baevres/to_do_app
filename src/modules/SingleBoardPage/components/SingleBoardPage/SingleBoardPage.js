import { useEffect, useState, useContext } from 'react'
import { useParams } from 'react-router-dom'

import BoardSideMenu from '../BoardSideMenu/BoardSideMenu'
import BoardHead from '../BoardHead'
import BoardTasks from '../BoardTasks'

import useTasksService from '../../services/useTasksService'
import BoardDataContext from '../../context/BoardDataContext'
import TasksContext from '../../context/TasksContext'
import { ToastContext } from '../../../ToastStack'

import './SingleBoardPage.css'

const SingleBoardPage = () => {
  const { getBoardTasks } = useTasksService()
  const { setNewToast } = useContext(ToastContext)

  const { board } = useParams()
  const [boardData, setBoardData] = useState({
    boardId: board.split('-')[1],
    boardTitle: '',
    boardList: [],
    taskLists: [],
    setNewBoardId(id) {
      setBoardData((boardData) => {
        const newBoardData = {
          ...boardData,
          boardId: id,
        }
        return newBoardData
      })
    },
    setNewBoardTitle(boardTitle) {
      setBoardData((boardData) => {
        const newBoardData = {
          ...boardData,
          boardTitle,
        }
        return newBoardData
      })
    },
    setNewBoardList(boardList) {
      setBoardData((boardData) => {
        const newBoardData = {
          ...boardData,
          boardList,
        }
        return newBoardData
      })
    },
    setTaskLists(taskLists) {
      setBoardData((boardData) => {
        const newBoardData = {
          ...boardData,
          taskLists,
        }
        return newBoardData
      })
    },
  })
  const [boardTasks, setTasks] = useState({
    tasks: [],
    taskFilter: 'all',
    setNewTasks(newTasks) {
      setTasks((boardTasks) => {
        return {
          ...boardTasks,
          tasks: newTasks,
        }
      })
    },
    setTaskFilter(newTaskFilter) {
      setTasks((boardTasks) => {
        return {
          ...boardTasks,
          taskFilter: newTaskFilter,
        }
      })
    },
  })

  useEffect(() => {
    const menu = document.querySelector('.menu')
    menu.classList.add('menu-board')
    return () => {
      menu.classList.remove('menu-board')
    }
  }, [])

  useEffect(() => {
    document.title = `${board.split('-')[0]} | ToDo`

    const newBoardId = board.split('-')[1]
    boardData.setNewBoardId(newBoardId)
    boardData.setNewBoardTitle(board.split('-')[0])

    const selectedFilter = JSON.parse(localStorage.getItem('selectedFilter'))
    const curFilter = !selectedFilter ? 'all' : selectedFilter
    if (curFilter !== 'all') {
      setTasks((boardTasks) => {
        return {
          ...boardTasks,
          taskFilter: curFilter,
        }
      })
    }

    getBoardTasks(newBoardId, curFilter)
      .then((response) => {
        if (response.reason) throw response

        setTasks((boardTasks) => {
          return {
            ...boardTasks,
            tasks: response.content,
          }
        })
      })
      .catch((err) => {
        setNewToast(err.message)
      })
  }, [board, boardTasks.taskFilter])

  return (
    <div className="board-page-content">
      <BoardDataContext.Provider value={boardData}>
        <TasksContext.Provider value={boardTasks}>
          <BoardSideMenu />
          <BoardHead />
          <BoardTasks />
        </TasksContext.Provider>
      </BoardDataContext.Provider>
    </div>
  )
}

export default SingleBoardPage
