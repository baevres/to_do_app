import { useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'

import AccountIcon from '../../../../../../../AccountIcon'
import UserSearchForm from '../UserSearchForm/UserSearchForm'

import UserDataContext from '../../../../../../../../context/UserDataContext'
import InvitedUsersContext from '../../context/InvitedUsersContext'
import BoardDataContext from '../../../../../../context/BoardDataContext'
import useSharedBoardsService from '../../../../../../../../services/useSharedBoardsService'
import { useBoardsService } from '../../../../../../../BoardsPage'

import { Close, DeleteBasket } from '../../../../../../../../UI'
import './ShareModal.css'

const ShareModal = ({ onCloseModal }) => {
  const handleClickOutside = (event) => {
    if (event.target.classList.contains('overlay')) {
      onCloseModal()
    }
  }

  useEffect(() => {
    const root = document.querySelector('#root')
    root.addEventListener('click', handleClickOutside)

    return () => {
      root.removeEventListener('click', handleClickOutside)
    }
  }, [])

  return (
    <div className="share-modal">
      <div className="share-modal_wrapper">
        <div className="share-modal_header">
          Share board
          <div className="share-modal_close" onClick={onCloseModal}>
            <Close />
          </div>
        </div>
        <UserSearchForm />
        <Members />
      </div>
      <div className="overlay"></div>
    </div>
  )
}

const Members = () => {
  const { userData } = useContext(UserDataContext)
  const { usersList, setUsersList } = useContext(InvitedUsersContext)
  const { boardId, owner, isOwner } = useContext(BoardDataContext)
  const { deleteInvitedUser } = useSharedBoardsService()
  const { getBoardInvitedUsers } = useBoardsService()
  const navigate = useNavigate()

  const onRemoveInvitedUser = (userId) => {
    const payload = {
      user_id: userId,
      board_id: boardId,
    }
    deleteInvitedUser(boardId, payload).then((response) => {
      getBoardInvitedUsers(boardId).then((response) => {
        const invitedUsers = response.content[0].invited_users
        setUsersList(invitedUsers)

        if (!owner && +userId === +userData.id) navigate('/')
      })
    })
  }

  const adminName = isOwner ? `${userData.name} (you)` : `${owner.name}`

  return (
    <div className="members-list">
      <ul>
        <li>
          <AccountIcon user={owner} />
          <div>
            <div>{adminName}</div>
            <div className="member-info">{`${owner.email} • Board admin`}</div>
          </div>
        </li>

        {usersList.map((user) => {
          const userPoint = +user.id === +userData.id ? ' (you)' : ''

          return (
            <li key={`${user.id}_member`}>
              <AccountIcon user={user} />
              <div>
                <div>{user.name + userPoint}</div>
                <div className="member-info">{`${user.email} • Board member`}</div>
              </div>
              <div
                className="remove-member"
                title="Remove user from board"
                onClick={() => onRemoveInvitedUser(user.id)}
              >
                <DeleteBasket />
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default ShareModal
