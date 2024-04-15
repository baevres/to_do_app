import { useState, useEffect, useRef, useContext } from 'react'

import ActionModals from '../ActionModals/ActionModals'

import './ListActions.css'
import { Points, Close, BackArrow } from '../../../../../../../../UI'

const ListActions = () => {
  const [isModal, setModal] = useState(false)

  return (
    <div className="list-actions">
      <div className="board-task_edit" onClick={() => setModal(true)}>
        <Points />
      </div>
      {isModal ? <ModalContent isModal={isModal} setModal={setModal} /> : null}
    </div>
  )
}

const ModalContent = ({ isModal, setModal }) => {
  const [modalOpts, setModalOpts] = useState({
    title: 'List actions',
    content: null,
    backArrow: false,
  })
  const listOptions1 = ['Move list']
  const listOptions2 = ['Move all tasks', 'Remove all tasks']

  const modalRef = useRef(null)

  const closeModal = () => {
    setModal(false)
    setModalOpts({
      title: 'List actions',
      content: null,
      backArrow: false,
    })
  }

  const handleClickOutside = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      closeModal()
    }
  }

  useEffect(() => {
    const root = document.querySelector('#root')
    root.addEventListener('click', handleClickOutside)

    return () => {
      root.removeEventListener('click', handleClickOutside)
    }
  }, [modalOpts.content])

  const optionsAction = (action) => {
    setModalOpts({
      title: action,
      content: <ActionModals action={action} closeModal={closeModal} />,
      backArrow: true,
    })
  }

  const createListElems = (elemList) => {
    return elemList.map((title) => {
      return (
        <li key={title}>
          <div onClick={() => optionsAction(title)}>{title}</div>
        </li>
      )
    })
  }

  const { backArrow, title, content } = modalOpts
  return (
    <div className="list-actions_wrapper" ref={modalRef}>
      <div className="list-actions_header">
        <div
          className={backArrow ? 'back-arrow' : null}
          onClick={() => {
            if (backArrow) {
              setModalOpts({
                title: 'List actions',
                content: null,
                backArrow: false,
              })
            }
          }}
        >
          {backArrow ? <BackArrow /> : null}
        </div>
        <div>{title}</div>
        <div className="list-actions_close" onClick={closeModal}>
          <Close />
        </div>
      </div>
      <div className="list-actions_content">
        {!content ? (
          <ul>
            {createListElems(listOptions1)}
            <hr />
            {createListElems(listOptions2)}
            <hr />
            <li>
              <div onClick={() => optionsAction('Remove the list')}>
                Remove the list
              </div>
            </li>
          </ul>
        ) : (
          content
        )}
      </div>
    </div>
  )
}

export default ListActions
