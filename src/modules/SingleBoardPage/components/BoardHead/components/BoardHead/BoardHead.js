import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'

import BoardTitle from '../BoardTitle/BoardTitle'
import HeadFilters from '../HeadFilters/HeadFilters'
import ShareBoard from '../ShareBoard'

import { useBoardsService } from '../../../../../BoardsPage'
import BoardDataContext from '../../../../context/BoardDataContext'
import useSharedBoardsService from '../../../../../../services/useSharedBoardsService'
import UserDataContext from '../../../../../../context/UserDataContext'

import { Close, Leave } from '../../../../../../UI'
import './BoardHead.css'

const BoardHead = () => {
  return (
    <div className="board-head_wrapper">
      <BoardTitle />
      <div className="board-tools">
        <HeadFilters />
        <ShareBoard />
        <BoardActionBtn />
      </div>
    </div>
  )
}

const BoardActionBtn = () => {
  const { boardId, isOwner, owner } = useContext(BoardDataContext)
  const { userData } = useContext(UserDataContext)
  const { deleteBoard } = useBoardsService()
  const { deleteInvitedUser } = useSharedBoardsService()
  const navigate = useNavigate()

  const onRemoveBoard = () => {
    deleteBoard(boardId, { id: boardId }).then((response) => {
      navigate('/')
    })
  }

  const onLeaveBoard = () => {
    const payload = { board_id: boardId, user_id: userData.id }
    deleteInvitedUser(boardId, payload).then((response) => {
      navigate('/')
    })
  }

  return !isOwner && owner.id ? (
    <button className="tool-btn" onClick={onLeaveBoard}>
      <Leave />
      Leave board
    </button>
  ) : (
    <button className="tool-btn" onClick={onRemoveBoard}>
      <Close />
      Remove board
    </button>
  )
}

export default BoardHead
