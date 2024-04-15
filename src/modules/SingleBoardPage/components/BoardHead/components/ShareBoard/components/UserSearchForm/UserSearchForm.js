import { useState } from 'react'

import UserSearchModal from '../UserSearchModal/UserSearchModal'

import './UserSearchForm.css'

const UserSearchForm = () => {
  const [userList, setUserList] = useState([])
  const [isSearchModal, setSearchModal] = useState(false)
  const [value, setValue] = useState('')

  const onSearch = (e) => {
    const target = e.target
    setValue(target.value)

    setSearchModal(true)
  }

  const onCloseSearchModal = () => {
    setSearchModal(false)
  }

  return (
    <div className="share-form_wrapper">
      <form className="share-board_form" noValidate>
        <div className="field-wrapper">
          <div>
            <input
              name="userSearch"
              type="text"
              id="userSearch"
              placeholder="Email address or name"
              data-validation="true"
              required="true"
              className="edit-item-input"
              value={value}
              onChange={onSearch}
            />
            <label htmlFor="userSearch" className="input-label">
              Search user
            </label>
          </div>
        </div>
        <div className="share-btn">
          <button type="submit" className="btn save-btn">
            Share
          </button>
        </div>
      </form>
      {isSearchModal ? (
        <UserSearchModal
          searchValue={value}
          setUserList={setUserList}
          onClose={onCloseSearchModal}
        />
      ) : null}
    </div>
  )
}

export default UserSearchForm

const fieldsOpts = [
  {
    type: 'text',
    id: 'userSearch',
    placeholder: 'Email address or name',
    label: 'Search user',
    fieldClass: 'edit-item-input',
    labelClass: 'input-label',
  },
]
const formOpts = {
  formClass: 'share-board_form',
  btn: 'Share',
  btnClass: 'share-btn',
}
const validationFunc = ({ userSearch }) => {
  const errors = {}
  if (!userSearch) {
    errors.userSearch = 'The field is required'
  }

  return errors
}
const submitFunc = ({ userSearch }) => {
  console.log(userSearch)
}
