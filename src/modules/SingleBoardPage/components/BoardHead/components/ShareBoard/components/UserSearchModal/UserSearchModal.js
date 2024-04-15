import { useState, useEffect, useContext } from 'react'

import { useUserVerification } from '../../../../../../../LoginPage'

import { ToastContext } from '../../../../../../../ToastStack'

import './UserSearchModal.css'

const UserSearchModal = ({ searchValue, setUserList, onClose }) => {
  const [hasSelectedUser, setSelectedUser] = useState(false)
  const { getUserData } = useUserVerification()
  const { setNewToast } = useContext(ToastContext)

  const NotFound = (
    <div className="not-found">
      Looks like that person is not a ToDo member yet
    </div>
  )

  // let Content = NotFound
  useEffect(() => {
    if (searchValue.length > 2) {
      getUserData()
        .then((response) => {
          if (response.reason) throw response

          const result = response.content
          if (result.length > 0) {
            setUserList(result)
          }
        })
        .catch((err) => {
          setNewToast(err.message)
        })
    }
  }, [searchValue])

  return (
    <div className="user-search_modal">
      <div className="user-search_content">{NotFound}</div>
    </div>
  )
}

export default UserSearchModal
