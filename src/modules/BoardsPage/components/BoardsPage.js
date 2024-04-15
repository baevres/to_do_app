import { useState, useRef, useEffect, useContext } from 'react'
import { Link } from 'react-router-dom'

import NewBoardModal from './NewBoardModal'
import Loader from '../../Loader'

import useBoardsService from '../services/useBoardsService'
import { ToastContext } from '../../ToastStack'

import useHttp from '../../../hooks/httpHook'

import './BoardsPage.css'

const BoardsPage = () => {
  const [isOpenModal, setOpenModal] = useState(false)
  const [userBoards, setUserBoards] = useState([])
  const { getBoards, createBoard } = useBoardsService()
  const { loading } = useHttp()
  const { setNewToast } = useContext(ToastContext)

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
    createBoard({ title })
      .then((boards) => {
        const newBoard = boards.content[0]
        setUserBoards((userBoards) => [...userBoards, newBoard])
      })
      .catch((err) => {
        setNewToast(err.message)
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
    getBoards()
      .then((response) => {
        if (response.reason) throw response

        setUserBoards(response.content)
      })
      .catch((err) => {
        setNewToast(err.message)
      })
  }, [])

  const setUserBoardsElems = () => {
    const boards = userBoards.map(({ id, title }, i) => {
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
        {userBoards.length > 0 ? boards : null}
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
      </ul>
    )
  }

  // render
  return (
    <div className="container">
      <h1>Todo Boards</h1>
      <div className="board-section">
        <h3 className="board-section__header-name">Your Boards</h3>
        <div>{loading ? <Loader /> : setUserBoardsElems()}</div>
      </div>
      {isOpenModal ? (
        <NewBoardModal
          onClose={onCloseModal}
          modalRef={modalRef}
          submitFunc={submitFunc}
        />
      ) : null}
    </div>
  )
}

export default BoardsPage
