import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'

import BoardTitle from '../BoardTitle/BoardTitle'
import HeadFilters from '../HeadFilters/HeadFilters'
import ShareBoard from '../ShareBoard'

import { useBoardsService } from '../../../../../BoardsPage'
import BoardDataContext from '../../../../context/BoardDataContext'
import { ToastContext } from '../../../../../ToastStack'

import { Close } from '../../../../../../UI'
import './BoardHead.css'

const BoardHead = () => {
  return (
    <div className="board-head_wrapper">
      <BoardTitle />
      <div className="board-tools">
        <HeadFilters />
        <ShareBoard />
        <RemoveBoard />
      </div>
    </div>
  )
}

const RemoveBoard = () => {
  const { boardId } = useContext(BoardDataContext)
  const { setNewToast } = useContext(ToastContext)
  const { deleteBoard } = useBoardsService()
  const navigate = useNavigate()

  const onRemove = () => {
    deleteBoard(boardId, { id: boardId })
      .then((response) => {
        if (response.reason) throw response

        navigate('/')
      })
      .catch((err) => {
        setNewToast(err.message)
      })
  }

  return (
    <button className="tool-btn" onClick={onRemove}>
      <Close />
      Remove board
    </button>
  )
}

export default BoardHead
