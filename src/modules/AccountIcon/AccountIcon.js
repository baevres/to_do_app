import { useContext } from 'react'

import UserDataContext from '../../context/UserDataContext'

import './AccountIcon.css'

const AccountIcon = () => {
  const { userData } = useContext(UserDataContext)

  return userData.name ? (
    <div className="account-icon">
      <div>{userData.name[0]}</div>
    </div>
  ) : null
}

export default AccountIcon
