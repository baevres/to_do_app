import { useEffect, useRef } from 'react'

import AccountIcon from '../../../../../../../AccountIcon'

import { Close } from '../../../../../../../../UI'
import './UserInfoModal.css'

const UserInfoModal = ({ userData, onClose, isModal }) => {
  const modalRef = useRef(null)

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
  }, [isModal])

  if (!isModal) return null

  return (
    <div className="user-info_wrapper" ref={modalRef}>
      <div className="user-info_content">
        <div className="user-info_head"></div>
        <div className="user-info_bottom"></div>
        <div className="user-info_account" id="infoAccount">
          <AccountIcon user={userData} />
          <div className="account-info">
            <div>{userData.name}</div>
            <div className="member-info">{userData.email}</div>
          </div>
        </div>
        <div className="close" onClick={onClose}>
          <Close />
        </div>
      </div>
    </div>
  )
}

export default UserInfoModal
