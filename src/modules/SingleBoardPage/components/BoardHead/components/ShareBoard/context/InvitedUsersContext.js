import { createContext } from 'react'

const InvitedUsersContext = createContext({
  usersList: [],
  setUsersList: () => {},
})

export default InvitedUsersContext
