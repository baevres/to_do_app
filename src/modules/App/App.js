import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useState, useMemo, useEffect } from 'react'

import NavLinks from '../NavLinks'
import LoginPage, { useUserVerification } from '../LoginPage'
import SignUpPage from '../SignUpPage'
import BoardsPage from '../BoardsPage'
import SingleBoardPage from '../SingleBoardPage'
import Error404 from '../Error404'
import ToastStack, { ToastContext } from '../ToastStack'

import UserDataContext from '../../context/UserDataContext'

const App = () => {
  const [loggedIn, setLoggedIn] = useState()
  const [toast, setToast] = useState({
    id: null,
    isToast: false,
    type: '', // error | success | info
    message: '',
    setNewToast(message, type = 'error') {
      setToast({
        ...toast,
        id: Date.now(),
        isToast: true,
        type,
        message,
      })
    },
    clearToast(id) {
      setToast({
        ...toast,
        isToast: false,
        type: '',
        message: '',
      })
      setToastList((toastList) => toastList.filter((toast) => toast.id !== id))
    },
  })
  const [toastList, setToastList] = useState([])
  const [userState, setUserState] = useState({
    userData: {},
    setUserData(newUserData) {
      setUserState((userState) => {
        return {
          ...userState,
          userData: newUserData,
        }
      })
    },
  })
  const { getUserData } = useUserVerification()

  const isLoggedIn = () => {
    if (!JSON.parse(localStorage.getItem('loggedIn'))) {
      localStorage.setItem('loggedIn', JSON.stringify(false))
    }
    const loggedIn = JSON.parse(localStorage.getItem('loggedIn'))
    localStorage.setItem('loggedIn', JSON.stringify(loggedIn))
    setLoggedIn(loggedIn)
  }

  useEffect(() => {
    if (loggedIn)
      getUserData()
        .then((response) => {
          if (response.reason) throw response

          setUserState((userState) => {
            return {
              ...userState,
              userData: response.content[0],
            }
          })
        })
        .catch((err) => {
          toast.setNewToast(err.message)
        })
  }, [])

  useMemo(() => {
    isLoggedIn()
  }, [])

  useEffect(() => {
    setToastList((toastList) => {
      const newList = [...toastList, toast]
      return newList.filter((toast) => toast.isToast)
    })
  }, [toast.isToast, toast.id])

  return (
    <UserDataContext.Provider value={userState}>
      <ToastContext.Provider value={toast}>
        <Router>
          <NavLinks isLoggedIn={loggedIn} />
          <div className="app">
            <Routes>
              <Route
                path="/"
                element={loggedIn ? <BoardsPage /> : <LoginPage />}
              />
              <Route path="/signup" element={<SignUpPage />} />
              <Route path="/boards/:board" element={<SingleBoardPage />} />
              <Route path="*" element={<Error404 />} />
            </Routes>
            {toastList.length > 0 ? <ToastStack toastList={toastList} /> : null}
          </div>
        </Router>
      </ToastContext.Provider>
    </UserDataContext.Provider>
  )
}

export default App
