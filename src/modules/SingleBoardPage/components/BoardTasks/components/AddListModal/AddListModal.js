import { useEffect, useContext, useRef } from 'react'

import FormTemplate from '../../../../../FormTemplate'

import useTasksService from '../../../../services/useTasksService'
import BoardDataContext from '../../../../context/BoardDataContext'
import { ToastContext } from '../../../../../ToastStack'

import './AddListModal.css'
import { Close } from '../../../../../../UI'

const AddListModal = ({ setOpenModal }) => {
  const { createTaskList } = useTasksService()
  const { setNewToast } = useContext(ToastContext)
  const { boardId, taskLists, setTaskLists } = useContext(BoardDataContext)
  const modalRef = useRef(null)

  const fieldsOpts = [
    {
      type: 'text',
      id: 'newList',
      placeholder: 'Enter list title…',
      label: 'List title',
      fieldClass: 'edit-item-input',
      labelClass: 'input-label',
    },
  ]
  const formOpts = {
    formClass: 'new-list-modal__content-form',
    btn: 'Add list',
    btnClass: 'new-list-modal__content-btn',
  }
  const validationFunc = ({ newList }) => {
    const errors = {}
    if (!newList) {
      errors.newList = 'The field is required'
    }

    return errors
  }
  const submitFunc = ({ newList }) => {
    const payload = { title: newList }
    createTaskList(boardId, payload)
      .then((response) => {
        if (response.reason) throw response

        const newTaskLists = [...taskLists, response.content[0]]
        setTaskLists(newTaskLists)
        setOpenModal(false)
      })
      .catch((err) => {
        setNewToast(err.message)
      })
  }

  const handleClickOutside = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      setOpenModal(false)
    }
  }

  useEffect(() => {
    document.querySelector('#newList').focus()

    const root = document.querySelector('#root')
    root.addEventListener('click', handleClickOutside)

    return () => root.removeEventListener('click', handleClickOutside)
  }, [])

  return (
    <div className="new-list-modal" ref={modalRef}>
      <FormTemplate
        formOpts={formOpts}
        fieldsOpts={fieldsOpts}
        validationFunc={validationFunc}
        submitFunc={submitFunc}
      />
      <button className="new-list-close" onClick={() => setOpenModal(false)}>
        <Close />
      </button>
    </div>
  )
}

export default AddListModal
