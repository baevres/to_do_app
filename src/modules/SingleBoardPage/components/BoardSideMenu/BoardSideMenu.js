import { useEffect, useState, useContext, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { useBoardsService, NewBoardModal } from '../../../BoardsPage'
import BoardDataContext from '../../context/BoardDataContext'
import UserDataContext from '../../../../context/UserDataContext'
import useSharedBoardsService from '../../../../services/useSharedBoardsService'

import { Plus, DeleteBasket, Leave } from '../../../../UI'
import './BoardSideMenu.css'

const BoardSideMenu = () => {
  const { getBoards, createBoard } = useBoardsService()
  const { boardList, setNewBoardList, boardTitle } =
    useContext(BoardDataContext)
  const [isModal, setModal] = useState(false)
  const [sharedBoards, setSharedBoards] = useState([])
  const { getSharedBoards } = useSharedBoardsService()

  const modalRef = useRef(null)

  const getAllBoards = () => {
    getBoards().then((response) => {
      setNewBoardList(response.content)
    })

    getSharedBoards().then((response) => {
      const boards = response.content.map((board) => {
        return board.boards
      })

      setSharedBoards(boards)
    })
  }

  useEffect(() => {
    getAllBoards()
  }, [boardTitle])

  const onClose = () => {
    setModal(false)
  }

  const submitFunc = async ({ title }) => {
    createBoard({ title }).then((response) => {
      getAllBoards()
    })

    onClose()
  }

  return (
    <div className="side-menu_wrapper">
      <div className="side-menu_user-boards">
        <div>
          Your boards
          <div className="add-new-board" onClick={() => setModal(true)}>
            <Plus />
          </div>
          {isModal ? (
            <NewBoardModal
              onClose={onClose}
              modalRef={modalRef}
              submitFunc={submitFunc}
            />
          ) : null}
        </div>
        <ul className="side-menu_boards-list">
          <UserBoardsList boards={boardList} getAllBoards={getAllBoards} />
        </ul>
      </div>
      {sharedBoards.length > 0 ? (
        <SharedBoards boards={sharedBoards} getAllBoards={getAllBoards} />
      ) : null}
    </div>
  )
}

const UserBoardsList = ({ boards, getAllBoards }) => {
  const { boardId, boardList } = useContext(BoardDataContext)
  const { userData } = useContext(UserDataContext)
  const { deleteBoard } = useBoardsService()
  const { deleteInvitedUser } = useSharedBoardsService()
  const navigate = useNavigate()

  const onRemoveBoard = (id) => {
    deleteBoard(id, { id }).then((response) => {
      if (+id === +boardId) navigate('/')
      else getAllBoards()
    })
  }

  const onRemoveUserFromBoard = (id) => {
    const payload = { board_id: id, user_id: userData.id }
    deleteInvitedUser(id, payload).then((response) => {
      if (+id === +boardId) navigate('/')
      else getAllBoards()
    })
  }

  return boards.map(({ id, title }, i) => {
    const newBoardParam = `${title}-${id}`
    const checkId = boardList.filter((board) => +board.id === +id).length > 0
    const btnTitle = checkId ? 'Remove the board' : 'Leave the board'

    const ActionButton = checkId ? (
      <ActionBtn actionFunc={() => onRemoveBoard(id)}>
        <DeleteBasket />
      </ActionBtn>
    ) : (
      <ActionBtn actionFunc={() => onRemoveUserFromBoard(id)}>
        <Leave />
      </ActionBtn>
    )

    return (
      <li key={title + i} className={+boardId === +id ? 'selected-board' : ''}>
        <Link to={`/boards/${newBoardParam}`}>
          <div className="board-img"></div>
          {title}
        </Link>
        <div title={btnTitle}>{ActionButton}</div>
      </li>
    )
  })
}

const ActionBtn = ({ children, actionFunc }) => {
  return (
    <div className="remove-board" onClick={actionFunc}>
      {children}
    </div>
  )
}

const SharedBoards = ({ boards, getAllBoards }) => {
  return (
    <div className="side-menu_user-boards shared">
      <div>Shared boards</div>
      <ul className="side-menu_boards-list">
        <UserBoardsList boards={boards} getAllBoards={getAllBoards} />
      </ul>
    </div>
  )
}

export default BoardSideMenu
