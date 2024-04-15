import { useState, useEffect, useContext, useRef } from 'react'

import useTasksService from '../../../../services/useTasksService'
import BoardDataContext from '../../../../context/BoardDataContext'
import TaskListDataContext from '../../context/TaskListDataContext'
import TasksContext from '../../../../context/TasksContext'

import { ToastContext } from '../../../../../ToastStack'

import './TaskFooter.css'
import { Plus, Close } from '../../../../../../UI'

const TaskFooter = () => {
  const [isForm, setForm] = useState(false)
  const [value, setValue] = useState()
  const { createTask } = useTasksService()
  const { setNewToast } = useContext(ToastContext)
  const { boardId } = useContext(BoardDataContext)
  const { taskListId } = useContext(TaskListDataContext)
  const { tasks, setNewTasks } = useContext(TasksContext)

  const formRef = useRef(null)

  const onSubmitFunc = () => {
    if (!value) {
      setForm(false)
      return
    }

    const payload = {
      title: value,
      checked: false,
    }
    createTask(boardId, taskListId, payload)
      .then((response) => {
        if (response.reason) throw response

        const newTasks = [...tasks, response.content[0]]
        setNewTasks(newTasks)
      })
      .catch((err) => {
        setNewToast(err.message)
      })

    setValue('')
    setForm(false)
  }

  const handleClickOutside = (e) => {
    if (formRef.current && !formRef.current.contains(e.target)) {
      setValue('')
      setForm(false)
    }
  }
  useEffect(() => {
    const app = document.querySelector('.app')
    if (isForm) {
      document.querySelector('.new-task').focus()
      app.addEventListener('click', handleClickOutside)
    }
    return () => {
      app.removeEventListener('click', handleClickOutside)
    }
  }, [isForm])

  const onChangeFunc = (e) => setValue(e.target.value)
  const closeFunc = () => setForm(false)

  const Content = isForm ? (
    <div className="new-task_wrapper" ref={formRef}>
      <form className="new-task_form" onSubmit={onSubmitFunc} noValidate>
        <textarea
          className="new-task task-wrapper"
          placeholder="Enter a title for this task..."
          value={value}
          onChange={onChangeFunc}
          required
        />
        <button type="submit" className="add-new-task_btn">
          Add task
        </button>
      </form>

      <button className="new-task-close" onClick={closeFunc}>
        <Close />
      </button>
    </div>
  ) : (
    <button className="add-task" onClick={() => setForm(true)}>
      <Plus />
      <div>Add a task</div>
    </button>
  )

  return <div className="board-task_footer">{Content}</div>
}

export default TaskFooter
