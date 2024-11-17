import { useContext } from 'react'

import UserDataContext from '../../context/UserDataContext'

import './AccountIcon.css'

const AccountIcon = ({ user }) => {
  const { userData } = useContext(UserDataContext)

  if (user) {
    return (
      <div className="account-icon">
        <div>{user.name[0]}</div>
      </div>
    )
  }

  return userData.name ? (
    <div className="account-icon">
      <div>{userData.name[0]}</div>
    </div>
  ) : null
}

export default AccountIcon
