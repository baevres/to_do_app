import { useContext, useState, useEffect } from 'react'

import { useBoardsService } from '../../../../../BoardsPage'
import BoardDataContext from '../../../../context/BoardDataContext'
import { ToastContext } from '../../../../../ToastStack'

const BoardTitle = () => {
  const { boardId, boardTitle, setNewBoardTitle } = useContext(BoardDataContext)
  const { setNewToast } = useContext(ToastContext)
  const [isForm, setForm] = useState(false)
  const [value, setValue] = useState('')
  const { updateBoard } = useBoardsService()

  const handleSubmit = () => {
    if (!value) {
      setValue(boardTitle)
      return
    }

    const payload = {
      id: boardId,
      title: value,
      closed: false,
    }
    updateBoard(boardId, payload)
      .then((response) => {
        if (response.reason) throw response

        const resp = response.content[0].title
        setValue(resp)
        setNewBoardTitle(resp)
        document.title = `${resp} | ToDo`
      })
      .catch((err) => {
        setNewToast(err.message)
      })
    setForm(false)
  }

  const handleClickOutside = (e) => {
    if (!e.target.classList.contains('board-title_input')) {
      setValue(boardTitle)
      setForm(false)
    }
  }

  useEffect(() => {
    setValue(boardTitle)

    const root = document.querySelector('#root')
    if (isForm) {
      document.querySelector('.board-title_input').select()
      root.addEventListener('click', handleClickOutside)
    }
    return () => {
      root.removeEventListener('click', handleClickOutside)
    }
  }, [isForm, boardTitle])

  return isForm ? (
    <form className="board-title_form" onSubmit={handleSubmit} noValidate>
      <input
        type="text"
        id="boardTitle"
        className="board-title_input"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        required
      />
    </form>
  ) : (
    <div className="board-head_title" onClick={() => setForm(true)}>
      {!value ? boardTitle : value}
    </div>
  )
}

export default BoardTitle
