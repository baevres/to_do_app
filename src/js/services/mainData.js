'use-strict'

export default class MainData {
  #listID = 0
  #listData = []

  ulParentElement = document.querySelector('.list-container')
  addFormLocator = '.add-new-item'
  deleteBtnLocator = '.delete-btn'
  checkboxLocator = '[type=checkbox]'
  itemValueLocator = '.item-value'
  editFormLocator = '.edit-item-form'
  editFormInput = '.edit-item-input'

  setDefaultData() {
    const defaultData = [
      { id: `box${this.#listID++}`, value: 'Test 1', checked: false },
      { id: `box${this.#listID++}`, value: 'Test 2', checked: true },
    ]

    if (!localStorage.getItem('listData')) {
      this.#listData = defaultData
      localStorage.setItem('listData', JSON.stringify(defaultData))
      localStorage.setItem('listID', JSON.stringify(this.#listID))
    } else {
      this.#listID = +JSON.parse(localStorage.getItem('listID'))
      this.#listData = JSON.parse(localStorage.getItem('listData'))
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

    addForm.addEventListener('submit', (e) => {
      e.preventDefault()

      const inputValue = newTodoInput.value
      const newItem = {
        id: `box${this.#listID++}`,
        value: inputValue,
        checked: false,
      }

      this.setNewData(newItem, 'add')
      this.render('add', newItem)

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
          }
        })
      }
    })
  }

  #generateEditForm = ({ id, value }) => {
    const form = document.createElement('form')
    const input = document.createElement('input')
    const div = document.createElement('div')
    const cancelButton = document.createElement('button')
    const saveButton = document.createElement('button')

    form.classList.add('edit-item-form')
    form.setAttribute('id', id)

    input.classList.add('edit-item-input')
    input.setAttribute('type', 'text')
    input.value = value

    cancelButton.classList.add('btn', 'cancel-btn')
    cancelButton.textContent = 'cancel'

    saveButton.classList.add('btn', 'save-btn')
    saveButton.textContent = 'save'

    div.append(cancelButton, saveButton)
    form.append(input, div)

    return form
  }

  submitEditForm = (oldLiItem, id) => {
    const editForms = document.querySelectorAll(this.editFormLocator)

    let newData = []
    let newItem = []

    const deleteForm = (insertElem, form) => {
      form.after(insertElem)
      this.ulParentElement.removeChild(form)
    }

    editForms.forEach((form) => {
      form.addEventListener('click', (e) => {
        e.preventDefault()
        const target = e.target

        if (target && form.id === id) {
          if (target.classList.contains('cancel-btn')) {
            deleteForm(oldLiItem, form)
          } else if (target.classList.contains('save-btn')) {
            const oldData = this.getData()
            const input = form.querySelector(this.editFormInput)

            if (input.value !== '') {
              let index = oldData.indexOf(
                oldData.find((item) => item.id === id),
              )
              oldData[index].value = input.value

              newData.push(...oldData)
              newItem = this.#generateNewItem(oldData[index])

              this.setNewData(newData)
              deleteForm(newItem, form)
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
            editForm.querySelector(this.editFormInput).focus()

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

  render(action, item = {}) {
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
        this.ulParentElement.innerHTML = ''
        const items = this.#listData.map((listItem) =>
          this.#generateNewItem(listItem),
        )
        this.ulParentElement.append(...items)
        break
    }
  }
}
