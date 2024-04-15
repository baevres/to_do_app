import { createContext } from 'react'

const TasksContext = createContext({
  tasks: [],
  taskFilter: '',
  setNewTasks: () => {},
  setTaskFilter: () => {},
})

export default TasksContext
