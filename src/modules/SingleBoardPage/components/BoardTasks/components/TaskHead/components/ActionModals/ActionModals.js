import { useContext } from 'react'

import FormTemplate from '../../../../../../../FormTemplate'

import useTasksService from '../../../../../../services/useTasksService'
import BoardDataContext from '../../../../../../context/BoardDataContext'
import TaskListDataContext from '../../../../context/TaskListDataContext'
import TasksContext from '../../../../../../context/TasksContext'

const ActionModals = ({ action, closeModal }) => {
  const {
    updateTaskList,
    deleteTaskList,
    updateTasks,
    deleteTasks,
    getBoardTasks,
  } = useTasksService()
  const { boardId, boardList, setTaskLists, taskLists } =
    useContext(BoardDataContext)
  const { taskListId } = useContext(TaskListDataContext)
  const { tasks, setNewTasks } = useContext(TasksContext)

  let fieldsOpts, formOpts, validationFunc, submitFunc
  switch (action.toLowerCase()) {
    case 'move list':
      const options = boardList.map(({ id, title }) => {
        const currentTitle = +boardId === +id ? `${title} (current)` : title
        return {
          name: currentTitle,
          value: id,
        }
      })
      fieldsOpts = [
        {
          type: 'select',
          id: 'boardSelect',
          label: 'Board',
          fieldClass: 'edit-item-input',
          labelClass: 'input-label',
          options,
        },
      ]
      formOpts = {
        formClass: 'move-list_form',
        btn: 'Move',
        btnClass: 'move-list_btn',
      }
      validationFunc = (values) => {
        const errors = {}
        const fields = Object.keys(values)

        for (const field of fields) {
          const value = values[field]
          if (!value) {
            errors[field] = 'The field is required'
          }
        }

        return errors
      }
      submitFunc = ({ boardSelect }) => {
        const board = boardList.find(
          (board) => +board.id === +boardSelect,
        ).title

        if (boardSelect !== boardId) {
          const payload = {
            id: taskListId,
            title: board,
            board_id: boardSelect,
          }
          updateTaskList(boardId, taskListId, payload).then((response) => {
            const newTaskLists = taskLists.filter(
              (taskList) => taskList.id === response.content.id,
            )
            setTaskLists(newTaskLists)
          })
        }

        closeModal()
      }

      return (
        <FormTemplate
          formOpts={formOpts}
          fieldsOpts={fieldsOpts}
          validationFunc={validationFunc}
          submitFunc={submitFunc}
        />
      )

    case 'move all tasks':
      const moveTasks = (id) => {
        const currentTasks = tasks.filter(
          (task) => task.task_list_id === taskListId,
        )
        if (currentTasks.length > 0) {
          const payload = currentTasks.map((task) => {
            return {
              ...task,
              task_list_id: id,
            }
          })

          updateTasks(boardId, taskListId, payload).then((response) => {
            setNewTasks(response.content)
          })
        }

        closeModal()
      }

      return (
        <ul className="boards-list">
          {taskLists.map(({ id, title }) => {
            const elemClass = id === taskListId ? 'current' : null
            const elemTitle = id === taskListId ? title + ' (current)' : title
            return (
              <li key={id}>
                <div className={elemClass} onClick={() => moveTasks(id)}>
                  {elemTitle}
                </div>
              </li>
            )
          })}
        </ul>
      )

    case 'remove all tasks':
      const removeAllTasks = () => {
        deleteTasks(boardId, taskListId).then((response) => {
          getBoardTasks(boardId).then((response) => {
            setNewTasks(response.content)
          })
        })

        closeModal()
      }

      return (
        <div className="remove-all">
          <div>This will remove all the tasks in this list from the board</div>
          <button onClick={removeAllTasks}>Remove all</button>
        </div>
      )

    case 'remove the list':
      submitFunc = () => {
        deleteTaskList(boardId, taskListId, { id: taskListId }).then(
          (response) => {
            const newTaskLists = taskLists.filter(
              (taskList) => taskList.id !== response.content[0].id,
            )
            setTaskLists(newTaskLists)
            closeModal()
          },
        )
      }
      return (
        <div className="remove-all">
          <div>This will remove the list from the board</div>
          <button onClick={submitFunc}>Remove list</button>
        </div>
      )

    default:
      return null
  }
}

export default ActionModals
