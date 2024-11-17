import { createContext } from 'react'

const BoardDataContext = createContext({
  boardId: null,
  owner: {},
  isOwner: null,
  boardTitle: '',
  boardList: [],
  taskLists: [],
  setNewBoardId: () => {},
  setNewBoardTitle: () => {},
  setNewBoardList: () => {},
  setTaskLists: () => {},
  setIsOwner: () => {},
  setOwner: () => {},
})

export default BoardDataContext
