import { useState, useContext, useEffect } from 'react'

import BoardUsers from '../BoardUsers/BoardUsers'
import ShareModal from '../ShareModal/ShareModal'

import { useBoardsService } from '../../../../../../../BoardsPage'
import BoardDataContext from '../../../../../../context/BoardDataContext'
import InvitedUsersContext from '../../context/InvitedUsersContext'

import { Invite } from '../../../../../../../../UI'
import './ShareBoard.css'

const ShareBoard = () => {
  const [isShareModal, setShareModal] = useState(false)
  const { boardId } = useContext(BoardDataContext)
  const { getBoardInvitedUsers } = useBoardsService()

  const [invitedUsers, setInvitedUsers] = useState({
    usersList: [],
    setUsersList(newUsers) {
      setInvitedUsers((invitedUsers) => {
        return {
          ...invitedUsers,
          usersList: newUsers,
        }
      })
    },
  })

  const onCloseModal = () => {
    setShareModal(false)
  }

  useEffect(() => {
    getBoardInvitedUsers(boardId).then((response) => {
      setInvitedUsers((invitedUsers) => {
        return {
          ...invitedUsers,
          usersList: response.content[0].invited_users,
        }
      })
    })
  }, [boardId])

  return (
    <InvitedUsersContext.Provider value={invitedUsers}>
      <div className="share-board">
        <BoardUsers />

        <button className="tool-btn" onClick={() => setShareModal(true)}>
          <Invite />
          Share
        </button>
        {isShareModal ? <ShareModal onCloseModal={onCloseModal} /> : null}
      </div>
    </InvitedUsersContext.Provider>
  )
}

export default ShareBoard
