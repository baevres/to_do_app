import { useState, useEffect, useContext, useRef } from 'react'

import useTasksService from '../../../../services/useTasksService'
import BoardDataContext from '../../../../context/BoardDataContext'
import TaskListDataContext from '../../context/TaskListDataContext'
import TasksContext from '../../../../context/TasksContext'

import { EditPencil } from '../../../../../../UI'

import './Tasks.css'

const Tasks = () => {
  const { taskListId } = useContext(TaskListDataContext)
  const { tasks } = useContext(TasksContext)

  const currentTasks = tasks.filter((task) => task.task_list_id === taskListId)
  return (
    <ol className="board-task_list">
      {currentTasks.length > 0
        ? currentTasks.map((task) => {
            return <SingleTask key={task.id} task={task} />
          })
        : null}
    </ol>
  )
}

const SingleTask = ({ task: { id, title, checked } }) => {
  const [isForm, setForm] = useState(false)
  const [taskData, setTaskData] = useState({ id, title, checked })
  const [value, setValue] = useState(title)
  const { boardId } = useContext(BoardDataContext)
  const { taskListId } = useContext(TaskListDataContext)
  const { updateSingleTask, deleteSingleTask, getBoardTasks } =
    useTasksService()
  const { tasks, setNewTasks, taskFilter } = useContext(TasksContext)

  const formRef = useRef(null)

  const onSubmitFunc = () => {
    if (!value) {
      setValue(taskData.title)
      return
    }

    const newTaskData = {
      ...taskData,
      title: value,
    }
    updateSingleTask(boardId, taskListId, taskData.id, newTaskData).then(
      (response) => {
        setTaskData(response.content[0])
      },
    )

    setForm(false)
  }

  const onChangeFunc = (e) => {
    setValue(e.target.value)
  }

  const toggleTask = (e) => {
    if (!e.target.classList.contains('task-content')) return

    const newTaskData = {
      ...taskData,
      checked: !taskData.checked,
    }
    updateSingleTask(boardId, taskListId, taskData.id, newTaskData).then(
      (response) => {
        setTaskData(response.content[0])

        if (taskFilter !== 'all') {
          getBoardTasks(boardId, taskFilter).then((response) => {
            setNewTasks(response.content)
          })
        }
      },
    )
  }

  const deleteFunc = () => {
    deleteSingleTask(boardId, taskListId, taskData.id, taskData).then(
      (response) => {
        const newTasks = tasks.filter(({ id }) => id !== response.content[0].id)
        setNewTasks(newTasks)
      },
    )
    setForm(false)
  }

  const handleClickOutside = (e) => {
    if (formRef.current && !formRef.current.contains(e.target)) {
      setTaskData((taskData) => {
        return {
          ...taskData,
          title: taskData.title,
        }
      })
      setForm(false)
    }
  }

  useEffect(() => {
    const app = document.querySelector('.app')
    if (isForm) {
      setValue(taskData.title)
      document.querySelector('.edit-task_textarea').focus()
      app.addEventListener('click', handleClickOutside)

      const height =
        document.querySelector('.edit-task_form').parentElement.offsetHeight
      document.querySelector('.edit-task_textarea').style.height = `${height}px`
    }
    return () => {
      app.removeEventListener('click', handleClickOutside)
    }
  }, [isForm])

  const taskClass = `task-wrapper ${taskData.checked ? ' checked' : ''}`
  return (
    <li>
      <div className={taskClass} onClick={toggleTask}>
        <div className="task-content">{taskData.title}</div>
        <div className="task-edit" onClick={() => setForm(true)}>
          <EditPencil />
        </div>
      </div>
      {isForm ? (
        <>
          <div className="overlay"></div>
          <form
            className="edit-task_form"
            onSubmit={onSubmitFunc}
            ref={formRef}
            noValidate
          >
            <textarea
              className="edit-task_textarea"
              placeholder="Enter a title for this task..."
              value={value}
              onChange={onChangeFunc}
              required
            />
            <div className="form-btns">
              <button type="submit" className="save-btn btn">
                Save
              </button>
              <button className="delete-btn btn" onClick={deleteFunc}>
                Remove task
              </button>
            </div>
          </form>
        </>
      ) : null}
    </li>
  )
}

export default Tasks
