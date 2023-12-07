'use-strict'
import request from './requests.js'
import logout from './logout.js'

import Loader from '../components/loader/loader.js'
import ErrorToast from '../components/errorToast/errorToast.js'

import UserVerification from './userVerification.js'

import FieldValidator from '../utils/fieldValidator.js'

export default class MainData {
  #listData = []
  cachedData = []
  #selectedAll = false
  #url = `http://localhost:5555/api/user`
  #accessToken

  userVerification = new UserVerification()
  refreshToken = this.userVerification.refreshToken

  ulParentElement = document.querySelector('.list-container')
  addFormLocator = '.add-new-item'
  deleteBtnLocator = '.delete-btn'
  checkboxLocator = '[type=checkbox]'
  itemValueLocator = '.item-value'
  editFormLocator = '.edit-item-form'
  editFormInput = '.edit-item-input'
  selectAllLocator = '#selectAllCheckbox'
  filterBtnsLocator = '.filter-btns'
  filterBtnLocator = '.filter-btn'
  allTasksLocator = '#allTasks'
  complitedTasksLocator = '#complited'
  pendingTasksLocator = '#pending'

  loader = new Loader('.list-container')
  setLoader = this.loader.setLoader

  errorToast = new ErrorToast('.container')
  setToast = this.errorToast.setToast

  setDefaultData = async () => {
    if (!localStorage.getItem('selectedAll')) {
      localStorage.setItem('selectedAll', JSON.stringify(this.#selectedAll))
    } else {
      this.#selectedAll = JSON.parse(localStorage.getItem('selectedAll'))
    }

    if (localStorage.getItem('accessToken')) {
      this.#accessToken = JSON.parse(localStorage.getItem('accessToken'))
    }

    await this.setDataFromDB()
    this.render()
  }

  setHeaders = () => {
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.#accessToken}`,
    }
  }

  setDataFromDB = async (query = '') => {
    this.#listData = await this.getData(query)
    if (!query) this.cachedData = this.#listData
    return this.#listData
  }

  getLocalData = () => this.#listData

  requestRefreshToken = async () => {
    try {
      const tokens = await this.refreshToken()
      if (tokens && !tokens.type) {
        localStorage.setItem('accessToken', JSON.stringify(tokens.accessToken))
        this.#accessToken = tokens.accessToken
        return tokens
      } else throw tokens
    } catch (err) {
      if (err.reason === 'Unauthorized') {
        this.setToast('Session is expired', 'info')
        setTimeout(logout, 3000)
      } else {
        logout()
        return err
      }
    }
  }

  getData = async (query = '') => {
    const url = this.#url + `/todo${query}`
    let data = await request(url, 'GET', null, this.setHeaders())

    if (data.reason === 'Unauthorized') {
      let res = await this.requestRefreshToken()
      if (res.type) return res

      data = await request(url, 'GET', null, this.setHeaders())
    }
    return data
  }

  postData = async (body) => {
    const url = this.#url + `/todo`
    let data = await request(url, 'POST', body, this.setHeaders())

    if (data.reason === 'Unauthorized') {
      let res = await this.requestRefreshToken()
      if (res.type) return res

      data = await request(url, 'POST', body, this.setHeaders())
    }
    return data
  }

  putData = async (body) => {
    const url = this.#url + `/todo/${body.id}`
    let data = await request(url, 'PUT', body, this.setHeaders())

    if (data.reason === 'Unauthorized') {
      let res = await this.requestRefreshToken()
      if (res.type) return res

      data = await request(url, 'PUT', body, this.setHeaders())
    }
    return data
  }

  putMultipleData = async (body) => {
    const url = this.#url + `/todo`
    let data = await request(url, 'PUT', body, this.setHeaders())

    if (data.reason === 'Unauthorized') {
      let res = await this.requestRefreshToken()
      if (res.type) return res

      data = await request(url, 'PUT', body, this.setHeaders())
    }
    return data
  }

  deleteData = async (body) => {
    const url = this.#url + `/todo/${body.id}`
    let data = await request(url, 'DELETE', null, this.setHeaders())

    if (data.reason === 'Unauthorized') {
      let res = await this.requestRefreshToken()
      if (res.type) return res

      data = await request(url, 'DELETE', null, this.setHeaders())
    }
    return data
  }

  setActionRequest = (action) => {
    switch (action) {
      case 'add':
        return this.postData
      case 'edit':
        return this.putData
      case 'toggle':
        return this.putData
      case 'multipleData':
        return this.putMultipleData
      case 'delete':
        return this.deleteData
    }
  }

  onSetData = async (newData, action = 'add') => {
    let result
    const actionRequest = this.setActionRequest(action)
    try {
      result = await actionRequest(newData)
    } catch (err) {
      result = err
    }
    await this.setDataFromDB()
    return result
  }

  // add todo
  addTodo = () => {
    const addForm = document.querySelector(this.addFormLocator)
    const newTodoInput = addForm.querySelector('input')

    let errors = []
    const checkForm = () => {
      errors = this.validateForm(newTodoInput, addForm)
      if (errors.length <= 0) {
        this.validateForm(newTodoInput, addForm, true)
      }
    }

    addForm.addEventListener('submit', async (e) => {
      e.preventDefault()

      checkForm()
      newTodoInput.addEventListener('blur', checkForm)
      newTodoInput.addEventListener('input', checkForm)

      if (errors.length <= 0) {
        this.setLoader()

        const inputValue = newTodoInput.value
        let newItem = {
          title: inputValue,
          checked: false,
        }

        const res = await this.onSetData(newItem)
        if (res && !res.type) {
          newItem.id = res.id
          this.render('add', newItem)
        } else if (res.type) {
          this.setToast(res.message)
        }

        this.setLoader(false)
        await this.filterTasks()
      }
      e.target.reset()
    })
  }

  // toggle/delete
  modifyTodo = (action) => {
    const locator =
      action === 'delete' ? this.deleteBtnLocator : this.checkboxLocator
    this.ulParentElement.addEventListener('click', async (e) => {
      const currentTarget = e.target
      const elemList = document.querySelectorAll(locator)

      const oldData = this.getLocalData()
      let item = []

      if (currentTarget) {
        elemList.forEach(async (elem) => {
          if (currentTarget === elem) {
            this.setLoader()

            if (action === 'delete') {
              const liParentElem = elem.parentElement
              const elemId = liParentElem.querySelector(this.checkboxLocator).id
              const index = oldData.indexOf(
                oldData.find((itm) => +elemId === itm.id),
              )

              item = oldData.splice(index, 1)[0]
            } else if (action === 'toggle') {
              const elemId = elem.id
              const index = oldData.indexOf(
                oldData.find((item) => +elemId === item.id),
              )
              oldData[index].checked = elem.checked
              item = oldData[index]
            }

            const res = await this.onSetData(item, action)
            if (res && !res.type) {
              this.render(action, item)
            } else if (res.type) {
              this.setToast(res.message)
            }

            await this.filterTasks()
          }
        })
      }
    })
  }

  #generateEditForm = ({ id, title }) => {
    const wrapper = document.createElement('div')
    const form = document.createElement('form')
    const input = document.createElement('input')
    const label = document.createElement('label')
    const div = document.createElement('div')
    const cancelButton = document.createElement('button')
    const saveButton = document.createElement('button')

    form.classList.add('edit-item-form')
    form.setAttribute('id', 'box' + id)
    form.setAttribute('novalidate', '')

    input.classList.add('edit-item-input')
    input.setAttribute('id', form.id + 'inp')
    input.setAttribute('type', 'text')
    input.setAttribute('placeholder', 'Edited Todo')
    input.setAttribute('required', '')
    input.value = title

    label.setAttribute('for', input.id)
    label.classList.add('edit-input-label')
    label.textContent = 'Edit todo'

    cancelButton.classList.add('btn', 'cancel-btn')
    cancelButton.textContent = 'cancel'

    saveButton.classList.add('btn', 'save-btn')
    saveButton.textContent = 'save'

    div.append(cancelButton, saveButton)
    form.append(input, label, div)
    wrapper.append(form)

    return wrapper
  }

  // validation
  validateForm = (input, form, deleteForm = false) => {
    const value = input.value

    const fieldValidator = new FieldValidator(input, form)
    fieldValidator.validateField('required', value, {
      errorMessage: 'The field is required',
    })
    fieldValidator.removeErrorWrapper()
    fieldValidator.renderErrors()

    if (deleteForm) {
      fieldValidator.removeErrorWrapper()
    }

    return fieldValidator.getErrors()
  }

  // edit
  submitEditForm = (oldLiItem, id) => {
    const editForms = document.querySelectorAll(this.editFormLocator)

    id = +id
    let item = []

    const deleteForm = (insertElem, formParent) => {
      formParent.after(insertElem)
      this.ulParentElement.removeChild(formParent)
    }

    editForms.forEach((form) => {
      form.addEventListener('click', async (e) => {
        e.preventDefault()
        const target = e.target

        if (target && form.id === 'box' + id) {
          if (target.classList.contains('cancel-btn')) {
            deleteForm(oldLiItem, form.parentElement)
          } else if (target.classList.contains('save-btn')) {
            this.setLoader()

            // form validation
            const input = form.querySelector(this.editFormInput)
            let errors = []

            errors = this.validateForm(input, form)
            input.addEventListener('blur', () => {
              errors = this.validateForm(input, form)
            })

            // form submitting
            const oldData = this.getLocalData()
            if (errors.length <= 0) {
              let index = oldData.indexOf(
                oldData.find((item) => item.id === id),
              )
              oldData[index].title = input.value

              item = this.#generateNewItem(oldData[index])
              const requestItem = {
                ...oldData[index],
              }

              const res = await this.onSetData(requestItem, 'edit')
              if (res && !res.type) {
                deleteForm(item, form.parentElement)
              } else if (res.type) {
                this.setToast(res.message)
              }
            }
            this.setLoader(false)
          }
        }
      })
    })
  }

  editTodo = () => {
    this.ulParentElement.addEventListener('dblclick', (event) => {
      const currentTarget = event.target
      const elemList = document.querySelectorAll(this.itemValueLocator)

      if (currentTarget) {
        elemList.forEach((item) => {
          if (currentTarget === item) {
            const parentLiElement = item.parentElement.parentElement
            const elemId = parentLiElement.querySelector(
              this.checkboxLocator,
            ).id
            const oldItem = this.getLocalData().find(({ id }) => id === +elemId)
            const editForm = this.#generateEditForm(oldItem)

            parentLiElement.before(editForm)
            this.ulParentElement.removeChild(parentLiElement)
            const input = editForm.querySelector(this.editFormInput)
            const label = editForm.querySelector('label')
            input.focus()
            label.addEventListener('click', () => input.focus())

            this.submitEditForm(parentLiElement, elemId)
          }
        })
      }
    })
  }

  #generateNewItem = ({ id, title, checked }) => {
    const li = document.createElement('li')
    const div = document.createElement('div')
    const input = document.createElement('input')
    const textDiv = document.createElement('div')
    const button = document.createElement('button')

    div.classList.add('start')

    input.setAttribute('type', 'checkbox')
    input.setAttribute('id', id)
    input.setAttribute('data-id', 'box' + id)
    input.classList.add('checkbox')

    textDiv.classList.add('item-value')
    textDiv.textContent = title

    button.classList.add('btn', 'delete-btn')
    button.textContent = 'delete'

    if (checked) {
      input.checked = true
      textDiv.classList.add('checked')
    }

    div.append(input, textDiv)
    li.append(div, button)

    return li
  }

  // select all
  setSelectedAll = async () => {
    const selectAllCheckbox = document.querySelector(this.selectAllLocator)
    const data = this.cachedData
    const checkedList = data.filter((item) => item.checked)

    selectAllCheckbox.checked =
      data.length === checkedList.length && data.length > 0 ? true : false

    this.#selectedAll = selectAllCheckbox.checked
    localStorage.setItem('selectedAll', JSON.stringify(this.#selectedAll))
  }

  selectAll = () => {
    const selectAllCheckbox = document.querySelector(this.selectAllLocator)
    selectAllCheckbox.addEventListener('click', async (e) => {
      this.setLoader()

      const target = e.target
      const oldData = await this.getData()
      let newData = []
      let items

      if (target.checked) {
        items = oldData.filter((item) => {
          return !item.checked
        })
      } else {
        items = oldData.filter((item) => {
          return item.checked
        })
      }
      newData = items.map((item) => {
        item.checked = !item.checked
        return item
      })

      await this.onSetData(newData, 'multipleData')
      this.render()

      this.setLoader(false)
      this.filterTasks()
    })
  }

  // filter
  filterTasks = async () => {
    const filterBtnsWrapper = document.querySelector(this.filterBtnsLocator)
    const filterBtns = filterBtnsWrapper.querySelectorAll(this.filterBtnLocator)

    for (const btn of filterBtns) {
      if (btn.classList.contains('selected')) {
        let query = ''
        switch (btn.id) {
          case 'allTasks':
            break
          case 'complited':
            query = '?checked=true'
            break
          case 'pending':
            query = '?checked=false'
            break
        }
        this.setLoader()

        const data = await this.setDataFromDB(query)
        this.render(null, null, data)

        this.setLoader(false)
      }
    }
  }

  setFilter = () => {
    const filterBtnsWrapper = document.querySelector(this.filterBtnsLocator)
    const filterBtns = filterBtnsWrapper.querySelectorAll(this.filterBtnLocator)

    filterBtnsWrapper.addEventListener('click', (e) => {
      const target = e.target

      if (target && target.tagName === 'BUTTON') {
        filterBtns.forEach((btn) => {
          if (target === btn) {
            btn.classList.add('selected')
          } else {
            btn.classList.remove('selected')
          }
        })

        this.filterTasks()
      }
    })
  }

  // render
  async render(action, item = {}, data = null) {
    let localData = this.getLocalData()
    switch (action) {
      case 'add':
        const newItem = this.#generateNewItem(item)
        this.ulParentElement.append(newItem)
        break

      case 'toggle':
        const oldItemInput = this.ulParentElement.querySelector(
          `[data-id="box${item.id}"]`,
        )
        const oldItem = oldItemInput.parentElement.parentElement
        const itemForReplace = this.#generateNewItem(item)
        oldItem.before(itemForReplace)
        this.ulParentElement.removeChild(oldItem)
        break

      case 'delete':
        const elemItems = this.ulParentElement.querySelectorAll(
          this.checkboxLocator,
        )
        elemItems.forEach((elem) => {
          if (+elem.id === item.id) {
            this.ulParentElement.removeChild(elem.parentElement.parentElement)
          }
        })
        break

      default:
        const renderData = data ? data : localData
        this.ulParentElement.innerHTML = ''
        const items = renderData.map((listItem) =>
          this.#generateNewItem(listItem),
        )
        this.ulParentElement.append(...items)
        break
    }
    await this.setSelectedAll()
  }
}
