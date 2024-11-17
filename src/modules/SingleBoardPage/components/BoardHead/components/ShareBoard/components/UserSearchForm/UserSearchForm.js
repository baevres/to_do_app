import { useState, useRef, useContext } from 'react'

import UserSearchModal from '../UserSearchModal/UserSearchModal'

import { useBoardsService } from '../../../../../../../BoardsPage'
import useSharedBoardsService from '../../../../../../../../services/useSharedBoardsService'
import BoardDataContext from '../../../../../../context/BoardDataContext'
import InvitedUsersContext from '../../context/InvitedUsersContext'

import './UserSearchForm.css'
import { Close } from '../../../../../../../../UI'

const UserSearchForm = () => {
  const [selectedUsers, setSelectedUsers] = useState([])
  const [isSearchModal, setSearchModal] = useState(false)
  const [value, setValue] = useState('')
  const { getBoardInvitedUsers } = useBoardsService()
  const { inviteUser } = useSharedBoardsService()
  const { boardId } = useContext(BoardDataContext)
  const { setUsersList } = useContext(InvitedUsersContext)

  const searchRef = useRef(null)

  const onSearch = (e) => {
    const target = e.target
    setValue(target.value)

    setSearchModal(true)
  }

  const onCloseSearchModal = () => {
    setSearchModal(false)
  }

  const onRemoveSelectedUser = (id) => {
    setSelectedUsers((selectedUsers) => {
      return selectedUsers.filter((user) => user.id !== id)
    })
  }

  const SelectedUsersList = selectedUsers.map(({ id, name }) => {
    return (
      <div className="selected-user_option" key={`selected_${id}`}>
        <div>{name}</div>
        <div
          className="selected-user_close"
          onClick={() => onRemoveSelectedUser(id)}
        >
          <Close />
        </div>
      </div>
    )
  })

  const onShare = (e) => {
    e.preventDefault()

    if (selectedUsers.length > 0) {
      const valueList = selectedUsers.map(({ id }) => {
        return {
          board_id: boardId,
          user_id: id,
        }
      })
      const payload = {
        valueList,
      }
      inviteUser(boardId, payload).then((response) => {
        e.target.reset()
        setSelectedUsers([])

        getBoardInvitedUsers(boardId).then((response) => {
          const invitedUsers = response.content[0].invited_users
          setUsersList(invitedUsers)
        })
      })
    }
  }

  const fieldClass = ` ${selectedUsers.length > 0 ? 'selected-user' : ''}`
  return (
    <div className="share-form_wrapper">
      <form className="share-board_form" noValidate onSubmit={onShare}>
        <div className="field-wrapper">
          <div className={'share-form_field edit-item-input' + fieldClass}>
            {SelectedUsersList}
            <input
              name="userSearch"
              type="text"
              id="userSearch"
              placeholder="Email address or name"
              data-validation="true"
              required
              value={value}
              onChange={onSearch}
              ref={searchRef}
            />
            <label htmlFor="userSearch" className="input-label">
              Search user
            </label>
          </div>
        </div>
        <div className="share-btn">
          <button type="submit" className="btn save-btn">
            Share
          </button>
        </div>
      </form>
      {isSearchModal ? (
        <UserSearchModal
          valueControl={{ value, setValue }}
          usersControl={{ selectedUsers, setSelectedUsers }}
          onClose={onCloseSearchModal}
          searchRef={searchRef}
        />
      ) : null}
    </div>
  )
}

export default UserSearchForm
