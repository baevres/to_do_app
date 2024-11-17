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
import LoggedInContext from '../../context/LoggedInContext'
import ControlStateContext from '../../context/ControlStateContext'

const App = () => {
  const [loggedInState, setLoggedInState] = useState({
    loggedIn: false,
    setLoggedIn(loggedIn) {
      setLoggedInState((loggedInState) => {
        return {
          ...loggedInState,
          loggedIn,
        }
      })
    },
  })
  const [controlState, setControlState] = useState({
    isError: false,
    isLoading: false,
    isRefresh: false,
    setIsError: (isError) => {
      setControlState((controlState) => {
        return {
          ...controlState,
          isError,
        }
      })
    },
    getIsLoading() {
      if (!localStorage.getItem('isLoading'))
        localStorage.setItem(
          'isLoading',
          JSON.stringify(controlState.isLoading),
        )
      return JSON.parse(localStorage.getItem('isLoading'))
    },
    setIsLoading(isLoading) {
      localStorage.setItem('isLoading', JSON.stringify(isLoading))
      setControlState((controlState) => {
        return {
          ...controlState,
          isLoading,
        }
      })
    },
    getIsRefresh() {
      if (!localStorage.getItem('isRefresh'))
        localStorage.setItem(
          'isRefresh',
          JSON.stringify(controlState.isRefresh),
        )
      console.log(JSON.parse(localStorage.getItem('isRefresh')))
      return JSON.parse(localStorage.getItem('isRefresh'))
    },
    setIsRefresh(isRefresh) {
      localStorage.setItem('isRefresh', JSON.stringify(isRefresh))
      setControlState((controlState) => {
        return {
          ...controlState,
          isRefresh,
        }
      })
    },
  })
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
    loggedInState.setLoggedIn(loggedIn)
  }

  useEffect(() => {
    if (loggedInState.loggedIn)
      getUserData().then((response) => {
        // console.log(response)
        setUserState((userState) => {
          return {
            ...userState,
            userData: response.content[0],
          }
        })
      })
  }, [loggedInState.loggedIn])

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
    <ControlStateContext.Provider value={controlState}>
      <LoggedInContext.Provider value={loggedInState}>
        <UserDataContext.Provider value={userState}>
          <ToastContext.Provider value={toast}>
            <Router>
              <NavLinks />
              <div className="app">
                <Routes>
                  <Route
                    path="/"
                    element={
                      loggedInState.loggedIn ? <BoardsPage /> : <LoginPage />
                    }
                  />
                  <Route path="/signup" element={<SignUpPage />} />
                  <Route path="/boards/:board" element={<SingleBoardPage />} />
                  <Route path="*" element={<Error404 />} />
                </Routes>
                {toastList.length > 0 ? (
                  <ToastStack toastList={toastList} />
                ) : null}
              </div>
            </Router>
          </ToastContext.Provider>
        </UserDataContext.Provider>
      </LoggedInContext.Provider>
    </ControlStateContext.Provider>
  )
}

export default App
