import { useState, useEffect, useRef, useContext } from 'react'

import Loader from '../../../../../../../Loader'
import AccountIcon from '../../../../../../../AccountIcon'

import { useUserVerification } from '../../../../../../../LoginPage'
import InvitedUsersContext from '../../context/InvitedUsersContext'
import UserDataContext from '../../../../../../../../context/UserDataContext'
import BoardDataContext from '../../../../../../context/BoardDataContext'

import './UserSearchModal.css'

const UserSearchModal = ({
  valueControl: { value, setValue },
  usersControl: { selectedUsers, setSelectedUsers },
  onClose,
  searchRef,
}) => {
  const [foundUsersList, setFoundUsersList] = useState([])
  const [Content, setContent] = useState(null)
  const { getUserData, loading } = useUserVerification()
  const { usersList } = useContext(InvitedUsersContext)
  const { userData } = useContext(UserDataContext)
  const { owner } = useContext(BoardDataContext)

  const searchModalRef = useRef(null)

  const checkSelectedUser = (user) => {
    const checkFromInvited = usersList.filter(
      (invitedUser) => invitedUser.id === user.id,
    )
    const checkFromSelected = selectedUsers.filter(
      (selectedUser) => selectedUser.id === user.id,
    )

    return (
      checkFromInvited.length === 0 &&
      checkFromSelected.length === 0 &&
      +userData.id !== +user.id &&
      +owner.id !== +user.id
    )
  }

  const onSelectUser = (user) => {
    if (checkSelectedUser(user)) {
      setSelectedUsers((users) => {
        const existingUsers = users.filter((usr) => +usr.id === +user.id)
        if (existingUsers.length === 0) return [...users, user]
        return [...users]
      })
      setValue('')
      onClose()
    }
  }

  const handleClickOutside = (e) => {
    if (
      searchModalRef.current &&
      !searchModalRef.current.contains(e.target) &&
      !searchRef.current.contains(e.target)
    ) {
      onClose()
    }
  }

  useEffect(() => {
    const root = document.querySelector('#root')
    root.addEventListener('click', handleClickOutside)

    return () => {
      setContent(null)
      root.removeEventListener('click', handleClickOutside)
    }
  }, [])

  useEffect(() => {
    if (value.length > 0) {
      setContent(<NotFound />)
      if (loading) setContent(<Loader />)

      getUserData(value).then((response) => {
        const result = response.content
        setFoundUsersList(result)
      })
    } else onClose()
  }, [value])

  useEffect(() => {
    const newContent =
      foundUsersList.length > 0 ? (
        <UserSearchList
          userList={foundUsersList}
          onSelectUser={onSelectUser}
          checkSelectedUser={checkSelectedUser}
        />
      ) : (
        <NotFound />
      )
    setContent(newContent)
  }, [foundUsersList.length])

  return (
    <div className="user-search_modal" ref={searchModalRef}>
      <div className="user-search_content">{Content}</div>
    </div>
  )
}

const NotFound = () => {
  return (
    <div className="not-found">
      Looks like that person is not a ToDo member yet
    </div>
  )
}

const UserSearchList = ({ userList, onSelectUser, checkSelectedUser }) => {
  const GeneratedList = userList.map((user) => {
    return (
      <li
        key={user.id}
        onClick={() => onSelectUser(user)}
        className={!checkSelectedUser(user) ? 'blocked' : null}
      >
        <AccountIcon user={user} />
        <div>
          <div>{user.name}</div>
          <div className="member-info">{user.email}</div>
        </div>
      </li>
    )
  })

  return (
    <div className="members-list user-search_list">
      <ul>{GeneratedList}</ul>
    </div>
  )
}

export default UserSearchModal
