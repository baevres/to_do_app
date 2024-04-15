import { useEffect, useState, useContext } from 'react'

import AddListModal from '../AddListModal/AddListModal'
import TaskHead from '../TaskHead'
import Tasks from '../Tasks/Tasks'
import TaskFooter from '../TaskFooter/TaskFooter'

import useTasksService from '../../../../services/useTasksService'
import { ToastContext } from '../../../../../ToastStack'
import BoardDataContext from '../../../../context/BoardDataContext'
import TaskListDataContext from '../../context/TaskListDataContext'

import './BoardLists.css'
import { Plus } from '../../../../../../UI'

const BoardLists = () => {
  const [isOpenModal, setOpenModal] = useState(false)
  const { getTaskLists } = useTasksService()
  const { setNewToast } = useContext(ToastContext)
  const { boardId, taskLists, setTaskLists } = useContext(BoardDataContext)

  useEffect(() => {
    getTaskLists(boardId)
      .then((response) => {
        if (response.reason) throw response

        setTaskLists(response.content)
      })
      .catch((err) => {
        setNewToast(err.message)
      })
  }, [boardId, taskLists.length])

  const AddListContent = isOpenModal ? (
    <AddListModal setOpenModal={setOpenModal} />
  ) : (
    <div className="board-tasks_add-button-area">
      <button className="add-button" onClick={() => setOpenModal(true)}>
        <Plus />
        Add new list
      </button>
    </div>
  )

  return (
    <div className="board-tasks_wrapper">
      <ol id="board">
        <TaskList taskLists={taskLists} />

        {AddListContent}
      </ol>
    </div>
  )
}

const TaskList = ({ taskLists }) => {
  return taskLists.map(({ id, title }) => {
    const taskListData = {
      taskListId: id,
      taskListTitle: title,
    }
    return (
      <TaskListDataContext.Provider key={id} value={taskListData}>
        <li className="board-task">
          <div>
            <div className="board-task_wrapper">
              <TaskHead />
              <Tasks />
              <TaskFooter />
            </div>
          </div>
        </li>
      </TaskListDataContext.Provider>
    )
  })
}

export default BoardLists
