import { createContext } from 'react'

const ControlStateContext = createContext({
  isError: false,
  isLoading: false,
  isRefresh: false,
  setIsError: () => {},
  setIsLoading: () => {},
  setIsRefresh: () => {},
  getIsRefresh: () => {},
})

export default ControlStateContext
