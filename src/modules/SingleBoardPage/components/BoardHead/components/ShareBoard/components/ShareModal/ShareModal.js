import { useEffect, useContext } from 'react'

import FormTemplate from '../../../../../../../FormTemplate'
import AccountIcon from '../../../../../../../AccountIcon'
import UserSearchForm from '../UserSearchForm/UserSearchForm'
import UserSearchModal from '../UserSearchModal/UserSearchModal'

import UserDataContext from '../../../../../../../../context/UserDataContext'

import { Close } from '../../../../../../../../UI'
import './ShareModal.css'

const ShareModal = ({ onCloseModal }) => {
  const { userData } = useContext(UserDataContext)

  const handleClickOutside = (event) => {
    if (event.target.classList.contains('overlay')) {
      onCloseModal()
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
    <div className="share-modal">
      <div className="share-modal_wrapper">
        <div className="share-modal_header">
          Share board
          <div onClick={onCloseModal}>
            <Close />
          </div>
        </div>
        <UserSearchForm />
        <div className="members-list">
          <ul>
            <li>
              <AccountIcon />
              <div>
                <div>{`${userData.name} (you)`}</div>
                <div className="member-info">{`${userData.email} • Board admin`}</div>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div className="overlay"></div>
    </div>
  )
}

export default ShareModal
