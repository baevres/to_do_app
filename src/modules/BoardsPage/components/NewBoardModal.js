import { useRef, useEffect } from 'react'

import FormTemplate from '../../FormTemplate'

import './NewBoardModal.css'
import { Close } from '../../../UI'

const NewBoardModal = ({ onClose, modalRef, submitFunc }) => {
  const fieldsOpts = [
    {
      type: 'text',
      id: 'title',
      placeholder: 'test',
      label: 'Board title',
      fieldClass: 'edit-item-input',
      labelClass: 'input-label',
    },
  ]
  const formOpts = {
    formClass: 'new-board-modal__content-form',
    btn: 'Create',
    btnClass: 'new-board-modal__content-btn',
  }
  const validationFunc = ({ title }) => {
    const errors = {}
    if (!title) {
      errors.title = 'The field is required'
    }

    return errors
  }

  const handleClickOutside = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      onClose()
    }
  }

  useEffect(() => {
    const root = document.querySelector('#root')
    root.addEventListener('click', handleClickOutside)

    return () => {
      root.removeEventListener('click', handleClickOutside)
    }
  }, [])

  return (
    <div className="new-board-modal" ref={modalRef}>
      <div className="new-board-modal__header">
        <h2>Create board</h2>
        <button onClick={onClose}>
          <Close />
        </button>
      </div>
      <div className="new-board-modal__content">
        <FormTemplate
          formOpts={formOpts}
          fieldsOpts={fieldsOpts}
          validationFunc={validationFunc}
          submitFunc={submitFunc}
        />
      </div>
    </div>
  )
}

export default NewBoardModal
