import { useRef, useContext, useState, useEffect } from 'react'

import AccountIcon from '../AccountIcon'

import UserDataContext from '../../context/UserDataContext'
import LoggedInContext from '../../context/LoggedInContext'
import useLogout from '../../services/useLogout'

import './AccountMenu.css'

const AccountMenu = () => {
  const [isOpenModal, setOpenModal] = useState(false)
  const { loggedIn } = useContext(LoggedInContext)

  const onCloseModal = () => {
    setOpenModal(false)
  }

  if (!loggedIn) return null

  return (
    <div className="account-wrapper" title="Account">
      <div onClick={() => setOpenModal(true)}>
        <AccountIcon />
      </div>
      <AccountModal isOpenModal={isOpenModal} onClose={onCloseModal} />
    </div>
  )
}

const AccountModal = ({ isOpenModal, onClose }) => {
  const { userData } = useContext(UserDataContext)
  const { setLoggedIn } = useContext(LoggedInContext)
  const { logout } = useLogout()
  const modalRef = useRef(null)

  const handleClickOutside = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      onClose()
    }
  }

  const onLogout = () => {
    onClose()
    logout()
    setLoggedIn(false)
  }

  useEffect(() => {
    const root = document.querySelector('#root')
    root.addEventListener('click', handleClickOutside)

    return () => {
      root.removeEventListener('click', handleClickOutside)
    }
  }, [isOpenModal])

  if (!isOpenModal) return null

  return (
    <div className="user-info_wrapper account-modal" ref={modalRef}>
      <div className="user-info_content">
        <div className="account-modal_title">account</div>
        <div className="account-card">
          <AccountIcon user={userData} />
          <div className="account-info">
            <div>{userData.name}</div>
            <div className="member-info">{userData.email}</div>
          </div>
        </div>
        <hr />
      </div>
      <div className="logout" onClick={onLogout}>
        <div>Log out</div>
      </div>
    </div>
  )
}

export default AccountMenu
