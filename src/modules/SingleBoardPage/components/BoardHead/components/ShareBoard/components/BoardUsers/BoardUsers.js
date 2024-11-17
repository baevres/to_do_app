import { useContext, useState } from 'react'

import AccountIcon from '../../../../../../../AccountIcon'
import UserInfoModal from '../UserInfoModal/UserInfoModal'

import UserDataContext from '../../../../../../../../context/UserDataContext'
import InvitedUsersContext from '../../context/InvitedUsersContext'
import BoardDataContext from '../../../../../../context/BoardDataContext'

import './BoardUsers.css'
import { UpArrow } from '../../../../../../../../UI'

const BoardUsers = () => {
  const { userData } = useContext(UserDataContext)
  const { usersList } = useContext(InvitedUsersContext)
  const { isOwner, owner } = useContext(BoardDataContext)

  return (
    <div className="accont-wrapper">
      <div>
        <BoardUser user={isOwner ? userData : owner} isAdmin={true} />
      </div>

      {usersList.map((user) => {
        return (
          <div key={user.id}>
            <BoardUser user={user} />
          </div>
        )
      })}
    </div>
  )
}

const BoardUser = ({ user, isAdmin }) => {
  const [isUserInfoModal, setUserInfoModal] = useState(false)

  const onCloseModal = () => {
    setUserInfoModal(false)
  }

  return (
    <>
      <div
        onClick={() => setUserInfoModal(true)}
        title={`${user.name} (${user.email})`}
      >
        <AccountIcon />
        {user.name && isAdmin ? <UpArrow /> : null}
      </div>

      <UserInfoModal
        userData={user}
        onClose={onCloseModal}
        isModal={isUserInfoModal}
      />
    </>
  )
}

export default BoardUsers
