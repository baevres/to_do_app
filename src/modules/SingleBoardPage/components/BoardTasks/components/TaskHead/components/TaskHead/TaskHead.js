import { useState, useEffect, useContext } from 'react'

import ListActions from '../ListActions/ListActions'

import useTasksService from '../../../../../../services/useTasksService'
import BoardDataContext from '../../../../../../context/BoardDataContext'
import TaskListDataContext from '../../../../context/TaskListDataContext'

import './TaskHead.css'

const TaskHead = () => {
  return (
    <div className="board-task_head">
      <EditListTitleForm />
      <ListActions />
    </div>
  )
}

const EditListTitleForm = () => {
  const { taskListId, taskListTitle } = useContext(TaskListDataContext)
  const [isForm, setForm] = useState(false)
  const [value, setValue] = useState(taskListTitle)
  const { updateTaskList } = useTasksService()
  const { boardId } = useContext(BoardDataContext)

  let newTaskListTitle = value
  const handleSubmit = () => {
    if (!value) {
      setValue(taskListTitle)
      return
    }

    const payload = {
      id: taskListId,
      title: value,
      board_id: boardId,
    }
    updateTaskList(boardId, taskListId, payload).then((response) => {
      const resp = response.content[0].title
      setValue(resp)
      newTaskListTitle = resp
    })
    setForm(false)
  }

  const handleClickOutside = (e) => {
    if (!e.target.classList.contains('board-task_input')) {
      setValue(newTaskListTitle)
      setForm(false)
    }
  }

  useEffect(() => {
    const root = document.querySelector('#root')
    if (isForm) {
      document.querySelector('.board-task_input').focus()
      root.addEventListener('click', handleClickOutside)
    }
    return () => {
      root.removeEventListener('click', handleClickOutside)
    }
  }, [isForm])

  return isForm ? (
    <form className="board-task_title" onSubmit={handleSubmit} noValidate>
      <input
        type="text"
        id="listTitle"
        className="board-task_input"
        placeholder="to do"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        required
      />
    </form>
  ) : (
    <div className="board-task_title" onClick={() => setForm(true)}>
      {value}
    </div>
  )
}

export default TaskHead
