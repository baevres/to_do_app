'use-strict'
import FieldValidator from '../utils/fieldValidator.js'

export default class MainData {
  #listID = 0
  #listData = []
  #selectedAll = false

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

  setDefaultData() {
    const defaultData = [
      { id: `box${this.#listID++}`, value: 'Test 1', checked: false },
      { id: `box${this.#listID++}`, value: 'Test 2', checked: true },
    ]

    if (
      localStorage.getItem('listData') &&
      !localStorage.getItem('selectedAll')
    ) {
      localStorage.setItem('selectedAll', JSON.stringify(this.#selectedAll))
    }

    if (!localStorage.getItem('listData')) {
      this.#listData = defaultData
      localStorage.setItem('listData', JSON.stringify(defaultData))
      localStorage.setItem('listID', JSON.stringify(this.#listID))
      localStorage.setItem('selectedAll', JSON.stringify(this.#selectedAll))
    } else {
      this.#listID = +JSON.parse(localStorage.getItem('listID'))
      this.#listData = JSON.parse(localStorage.getItem('listData'))
      this.#selectedAll = JSON.parse(localStorage.getItem('selectedAll'))
    }
  }

  getData() {
    return this.#listData
  }

  setNewData(newData, action = '') {
    if (action === 'add') {
      this.#listData.push(newData)
    } else {
      this.#listData = newData
    }

    localStorage.setItem('listID', JSON.stringify(this.#listID))
    localStorage.setItem('listData', JSON.stringify(this.#listData))
  }

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

    addForm.addEventListener('submit', (e) => {
      e.preventDefault()

      checkForm()
      newTodoInput.addEventListener('blur', checkForm)
      newTodoInput.addEventListener('input', checkForm)

      if (errors.length <= 0) {
        const inputValue = newTodoInput.value
        const newItem = {
          id: `box${this.#listID++}`,
          value: inputValue,
          checked: false,
        }

        this.setNewData(newItem, 'add')
        this.render('add', newItem)

        this.filterTasks()
      }
      e.target.reset()
    })
  }

  modifyTodo = (action) => {
    const locator =
      action === 'delete' ? this.deleteBtnLocator : this.checkboxLocator
    this.ulParentElement.addEventListener('click', (e) => {
      const currentTarget = e.target
      const elemList = document.querySelectorAll(locator)

      const oldData = this.getData()
      let newData = []
      let newItem = []

      if (currentTarget) {
        elemList.forEach((elem) => {
          if (currentTarget === elem) {
            if (action === 'delete') {
              const liParentElem = elem.parentElement
              const elemId = liParentElem.querySelector(this.checkboxLocator).id
              const index = oldData.indexOf(
                oldData.find((item) => elemId === item.id),
              )

              newItem = oldData.splice(index, 1)[0]
              newData = [...oldData]
            } else if (action === 'toggle') {
              const elemId = elem.id
              const index = oldData.indexOf(
                oldData.find((item) => elemId === item.id),
              )

              oldData[index].checked = elem.checked
              newData.push(...oldData)
              newItem = oldData[index]
            }

            this.setNewData(newData)
            this.render(action, newItem)

            this.filterTasks()
          }
        })
      }
    })
  }

  #generateEditForm = ({ id, value }) => {
    const wrapper = document.createElement('div')
    const form = document.createElement('form')
    const input = document.createElement('input')
    const label = document.createElement('label')
    const div = document.createElement('div')
    const cancelButton = document.createElement('button')
    const saveButton = document.createElement('button')

    form.classList.add('edit-item-form')
    form.setAttribute('id', id)
    form.setAttribute('novalidate', '')

    input.classList.add('edit-item-input')
    input.setAttribute('id', id + 'inp')
    input.setAttribute('type', 'text')
    input.setAttribute('placeholder', 'Edited Todo')
    input.setAttribute('required', '')
    input.value = value

    label.setAttribute('for', input.id)
    label.classList.add('edit-input-label')
    label.textContent = 'Edit todo'

    label.appendChild(input)

    cancelButton.classList.add('btn', 'cancel-btn')
    cancelButton.textContent = 'cancel'

    saveButton.classList.add('btn', 'save-btn')
    saveButton.textContent = 'save'

    div.append(cancelButton, saveButton)
    form.append(input, label, div)
    wrapper.append(form)

    return wrapper
  }

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

  submitEditForm = (oldLiItem, id) => {
    const editForms = document.querySelectorAll(this.editFormLocator)

    let newData = []
    let newItem = []

    const deleteForm = (insertElem, formParent) => {
      formParent.after(insertElem)
      this.ulParentElement.removeChild(formParent)
    }

    editForms.forEach((form) => {
      form.addEventListener('click', (e) => {
        e.preventDefault()
        const target = e.target

        if (target && form.id === id) {
          if (target.classList.contains('cancel-btn')) {
            deleteForm(oldLiItem, form.parentElement)
          } else if (target.classList.contains('save-btn')) {
            // form validation
            const input = form.querySelector(this.editFormInput)
            let errors = []

            errors = this.validateForm(input, form)
            input.addEventListener('blur', () => {
              errors = this.validateForm(input, form)
            })

            // form submitting
            const oldData = this.getData()
            if (errors.length <= 0) {
              let index = oldData.indexOf(
                oldData.find((item) => item.id === id),
              )
              oldData[index].value = input.value

              newData.push(...oldData)
              newItem = this.#generateNewItem(oldData[index])

              this.setNewData(newData)
              deleteForm(newItem, form.parentElement)
            }
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
            const oldItem = this.getData().find(({ id }) => id === elemId)
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

  #generateNewItem = ({ id, value, checked }) => {
    const li = document.createElement('li')
    const div = document.createElement('div')
    const input = document.createElement('input')
    const textDiv = document.createElement('div')
    const button = document.createElement('button')

    div.classList.add('start')

    input.setAttribute('type', 'checkbox')
    input.setAttribute('id', id)
    input.classList.add('checkbox')

    textDiv.classList.add('item-value')
    textDiv.textContent = value

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

  setSelectedAll = () => {
    const selectAllCheckbox = document.querySelector(this.selectAllLocator)
    const data = this.getData()
    const checkedList = data.filter((item) => item.checked)

    selectAllCheckbox.checked =
      data.length === checkedList.length && data.length > 0 ? true : false

    this.#selectedAll = selectAllCheckbox.checked
    localStorage.setItem('selectedAll', JSON.stringify(this.#selectedAll))
  }

  selectAll = () => {
    const selectAllCheckbox = document.querySelector(this.selectAllLocator)
    selectAllCheckbox.addEventListener('click', (e) => {
      const target = e.target
      const oldData = this.getData()
      let newData = []
      if (target.checked) {
        newData = oldData.map((item) => {
          if (!item.checked) {
            item.checked = true
          }
          return item
        })
      } else {
        newData = oldData.map((item) => {
          if (item.checked) {
            item.checked = false
          }
          return item
        })
      }

      this.setNewData(newData)
      this.render()

      this.filterTasks()
    })
  }

  filterTasks = () => {
    const filterBtnsWrapper = document.querySelector(this.filterBtnsLocator)
    const filterBtns = filterBtnsWrapper.querySelectorAll(this.filterBtnLocator)
    const data = this.getData()

    filterBtns.forEach((btn) => {
      if (btn.classList.contains('selected')) {
        switch (btn.id) {
          case 'allTasks':
            this.render()
            break
          case 'complited':
            this.render(
              null,
              null,
              data.filter((item) => item.checked),
            )
            break
          case 'pending':
            this.render(
              null,
              null,
              data.filter((item) => !item.checked),
            )
            break
        }
      }
    })
  }

  setFilter = () => {
    const filterBtnsWrapper = document.querySelector(this.filterBtnsLocator)
    const filterBtns = filterBtnsWrapper.querySelectorAll(this.filterBtnLocator)

    filterBtnsWrapper.addEventListener('click', (e) => {
      const target = e.target

      filterBtns.forEach((btn) => {
        if (target && target === btn) {
          btn.classList.add('selected')
        } else {
          btn.classList.remove('selected')
        }
      })

      this.filterTasks()
    })
  }

  render(action, item = {}, data = null) {
    switch (action) {
      case 'add':
        const newItem = this.#generateNewItem(item)
        this.ulParentElement.append(newItem)
        break

      case 'toggle':
        const oldItemInput = this.ulParentElement.querySelector(`#${item.id}`)
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
          if (elem.id === item.id) {
            this.ulParentElement.removeChild(elem.parentElement.parentElement)
          }
        })
        break

      default:
        const renderData = data ? data : this.getData()
        this.ulParentElement.innerHTML = ''
        const items = renderData.map((listItem) =>
          this.#generateNewItem(listItem),
        )
        this.ulParentElement.append(...items)
        break
    }
    this.setSelectedAll()
  }
}
