import { useState, useContext } from 'react'

import AccountIcon from '../../../../../../../AccountIcon'
import UserInfoModal from '../UserInfoModal/UserInfoModal'
import ShareModal from '../ShareModal/ShareModal'

import UserDataContext from '../../../../../../../../context/UserDataContext'

import { Invite } from '../../../../../../../../UI'
import './ShareBoard.css'

const ShareBoard = () => {
  const [isShareModal, setShareModal] = useState(false)
  const [isUserInfoModal, setUserInfoModal] = useState(false)
  const { userData } = useContext(UserDataContext)

  const onCloseModal = () => {
    setShareModal(false)
  }

  const onCloseUserInfoModal = () => {
    setUserInfoModal(false)
  }

  return (
    <div className="share-board">
      <div className="accont-wrapper">
        <div onClick={() => setUserInfoModal(true)}>
          <AccountIcon />
        </div>

        {isUserInfoModal ? (
          <UserInfoModal userData={userData} onClose={onCloseUserInfoModal} />
        ) : null}
      </div>

      <button className="tool-btn" onClick={() => setShareModal(true)}>
        <Invite />
        Share
      </button>
      {isShareModal ? <ShareModal onCloseModal={onCloseModal} /> : null}
    </div>
  )
}

export default ShareBoard
