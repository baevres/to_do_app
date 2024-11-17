import { useEffect, useLayoutEffect, useState, useContext } from 'react'
import { useParams } from 'react-router-dom'

import BoardSideMenu from '../BoardSideMenu/BoardSideMenu'
import BoardHead from '../BoardHead'
import BoardTasks from '../BoardTasks'

import { useUserVerification } from '../../../LoginPage'
import { useBoardsService } from '../../../BoardsPage'
import useTasksService from '../../services/useTasksService'
import UserDataContext from '../../../../context/UserDataContext'
import BoardDataContext from '../../context/BoardDataContext'
import TasksContext from '../../context/TasksContext'

import './SingleBoardPage.css'

const SingleBoardPage = () => {
  const { board } = useParams()
  const { getBoard } = useBoardsService()
  const { getBoardTasks } = useTasksService()
  const { userData, setUserData } = useContext(UserDataContext)
  const { getUserData } = useUserVerification()
  const [boardData, setBoardData] = useState({
    boardId: board.split('-')[1],
    owner: {},
    isOwner: null,
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
    setIsOwner(isOwner) {
      setBoardData((boardData) => {
        return {
          ...boardData,
          isOwner,
        }
      })
    },
    setOwner(owner) {
      setBoardData((boardData) => {
        return {
          ...boardData,
          owner,
        }
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

  useLayoutEffect(() => {
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

    getBoard(newBoardId).then((response) => {
      let checkBoardOwner
      if (userData.id) {
        checkBoardOwner = +response.content[0].user_id === +userData.id
        boardData.setIsOwner(checkBoardOwner)
        boardData.setOwner(response.content[0].users)
      } else {
        getUserData().then((userResponse) => {
          setUserData(userResponse.content[0])

          checkBoardOwner =
            +response.content[0].user_id === +userResponse.content[0].id
          boardData.setIsOwner(checkBoardOwner)
          boardData.setOwner(response.content[0].users)
        })
      }
    })

    getBoardTasks(newBoardId, curFilter).then((response) => {
      setTasks((boardTasks) => {
        return {
          ...boardTasks,
          tasks: response.content,
        }
      })
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
