import { createContext } from 'react'

const BoardDataContext = createContext({
  boardId: null,
  boardTitle: '',
  boardList: [],
  taskLists: [],
  setNewBoardId: () => {},
  setNewBoardTitle: () => {},
  setNewBoardList: () => {},
  setTaskLists: () => {},
})

export default BoardDataContext
