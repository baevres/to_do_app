import { createContext } from 'react'

const TaskListDataContext = createContext({
  taskListId: null,
  taskListTitle: null,
})

export default TaskListDataContext
