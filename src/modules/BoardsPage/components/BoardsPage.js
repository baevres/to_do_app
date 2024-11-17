import { useState, useRef, useEffect, useContext } from 'react'
import { Link } from 'react-router-dom'

import NewBoardModal from './NewBoardModal'
import Loader from '../../Loader'

import useBoardsService from '../services/useBoardsService'
import useSharedBoardsService from '../../../services/useSharedBoardsService'

import useHttp from '../../../hooks/httpHook'

import './BoardsPage.css'

const BoardsPage = () => {
  const [isOpenModal, setOpenModal] = useState(false)
  const [userBoards, setUserBoards] = useState([])
  const [userSharedBoards, setUserSharedBoards] = useState([])
  const { getBoards, createBoard } = useBoardsService()
  const { loading } = useHttp()
  const { getSharedBoards } = useSharedBoardsService()

  const modalRef = useRef(null)
  const newBoardButtonRef = useRef(null)

  // new board modal
  const onCloseModal = () => {
    if (isOpenModal) {
      setOpenModal(false)
    }
  }

  const handleClickOutside = (event) => {
    if (
      isOpenModal &&
      newBoardButtonRef.current &&
      !newBoardButtonRef.current.contains(event.target)
    ) {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onCloseModal()
      }
    }
  }

  const submitFunc = async ({ title }) => {
    createBoard({ title }).then((boards) => {
      const newBoard = boards.content[0]
      setUserBoards((userBoards) => [...userBoards, newBoard])
    })

    onCloseModal()
  }

  useEffect(() => {
    const root = document.querySelector('#root')
    if (isOpenModal) {
      root.addEventListener('click', handleClickOutside)
    } else root.removeEventListener('click', handleClickOutside)
  }, [isOpenModal])

  // user boards
  useEffect(() => {
    getBoards().then((response) => {
      setUserBoards(response.content)
    })

    getSharedBoards().then((response) => {
      const boards = response.content.map((board) => {
        return board.boards
      })

      setUserSharedBoards(boards)
    })
  }, [])

  const setUserBoardsElems = (boardList = userBoards, isCreate = true) => {
    const boards = boardList.map(({ id, title }, i) => {
      return (
        <li
          key={i + title}
          className="board-section__list-item new-board"
          onClick={() => {}}
        >
          <Link to={`/boards/${title}-${id}`}>
            <div className="user-custom-board-content">
              <span>{title}</span>
            </div>
          </Link>
        </li>
      )
    })

    return (
      <ul className="board-section__list">
        {boardList.length > 0 ? boards : null}
        {isCreate ? (
          <li
            className="board-section__list-item new-board"
            ref={newBoardButtonRef}
            onClick={() => {
              setOpenModal(true)
            }}
          >
            <div className="board-content">
              <span>Create new board</span>
            </div>
          </li>
        ) : null}
      </ul>
    )
  }

  // render
  return (
    <div className="container">
      <h1>Todo Boards</h1>
      <div className="boards">
        <div className="board-section">
          <h3 className="board-section__header-name">Your Boards</h3>
          <div>{loading ? <Loader /> : setUserBoardsElems()}</div>
        </div>
        {userSharedBoards.length > 0 ? (
          <div className="board-section shared-boards">
            <h3 className="board-section__header-name">Shared Boards</h3>
            <div>
              {loading ? (
                <Loader />
              ) : (
                setUserBoardsElems(userSharedBoards, false)
              )}
            </div>
          </div>
        ) : null}
        {isOpenModal ? (
          <NewBoardModal
            onClose={onCloseModal}
            modalRef={modalRef}
            submitFunc={submitFunc}
          />
        ) : null}
      </div>
    </div>
  )
}

export default BoardsPage
