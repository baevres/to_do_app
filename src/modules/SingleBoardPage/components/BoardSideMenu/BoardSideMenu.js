import { useEffect, useState, useContext, useRef } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'

import { useBoardsService, NewBoardModal } from '../../../BoardsPage'
import { ToastContext } from '../../../ToastStack'
import BoardDataContext from '../../context/BoardDataContext'

import { Plus, DeleteBasket } from '../../../../UI'
import './BoardSideMenu.css'

const BoardSideMenu = () => {
  const { board } = useParams()
  const { getBoards, createBoard, deleteBoard } = useBoardsService()
  const { setNewToast } = useContext(ToastContext)
  const { boardList, setNewBoardList, boardId, boardTitle } =
    useContext(BoardDataContext)
  const [isModal, setModal] = useState(false)

  const modalRef = useRef(null)
  const navigate = useNavigate()

  const getAllBoards = () => {
    getBoards()
      .then((response) => {
        if (response.reason) throw response

        setNewBoardList(response.content)
      })
      .catch((err) => {
        setNewToast(err.message)
      })
  }

  useEffect(() => {
    getAllBoards()
  }, [boardTitle])

  const onRemoveBoard = (id) => {
    deleteBoard(id, { id })
      .then((response) => {
        if (response.reason) throw response

        if (+id === +boardId) navigate('/')
        else getAllBoards()
      })
      .catch((err) => {
        setNewToast(err.message)
      })
  }

  const userBoardsList = boardList.map(({ id, title }, i) => {
    const newBoardParam = `${title}-${id}`
    return (
      <li key={title + i} className={+boardId === +id ? 'selected-board' : ''}>
        <Link to={`/boards/${newBoardParam}`}>
          <div className="board-img"></div>
          {title}
        </Link>
        <div className="remove-board" onClick={() => onRemoveBoard(id)}>
          <DeleteBasket />
        </div>
      </li>
    )
  })

  const onClose = () => {
    setModal(false)
  }

  const submitFunc = async ({ title }) => {
    createBoard({ title })
      .then((response) => {
        if (response.reason) throw response

        getAllBoards()
      })
      .catch((err) => {
        setNewToast(err.message)
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
        <ul className="side-menu_boards-list">{userBoardsList}</ul>
      </div>
    </div>
  )
}

export default BoardSideMenu
