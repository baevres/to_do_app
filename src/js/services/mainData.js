"use-strict";

export default class MainData {
    #listID = 0
    #listData = []

    constructor(parentLocator, addFormLocator) {
        this.parentElement = document.querySelector(parentLocator)
        this.addFormLocator = addFormLocator
    }

    setDefaultData() {
        const defaultData = [
            {id: 'box' + this.#listID++, value: 'Test 1', checked: false},
            {id: 'box' + this.#listID++, value: 'Test 2', checked: true}
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

    setNewData(newData, action='') {
        if (action === 'add') {
            this.#listData.push(newData)
        } else {
            this.#listData = newData
        }

        localStorage.setItem('listID', JSON.stringify(this.#listID))
        localStorage.setItem('listData', JSON.stringify(this.#listData))
    }

    addTodo = () => {
        const addForm = document.querySelector(this.addFormLocator),
          newTodoInput = addForm.querySelector('input')
    
        addForm.addEventListener('submit', (e) => {
            e.preventDefault()

            const inputValue = newTodoInput.value
            const newItem = {id: 'box' + this.#listID++, value: inputValue, checked: false}

            this.setNewData(newItem, 'add')
            this.render('add', newItem)

            e.target.reset()
        })
    }

    modifyTodo = (locator, action) => {
        this.parentElement.addEventListener('click', (e) => {
            const currentTarget = e.target,
                  elemList = document.querySelectorAll(locator)
    
            const oldData = this.getData()
            let newData = []
            let newItem = []

            if (currentTarget) {
                elemList.forEach((elem, i) => {
                    if (currentTarget === elem) {

                        if (action === 'delete') {
                            oldData.splice(i, 1)
                            newData = [...oldData]
                            newItem = i
                        } else if (action === 'toggle') {
                            oldData[i].checked = elem.checked
                            newData.push(...oldData)
                            newItem = oldData[i]
                        }
                    
                        this.setNewData(newData)
                        this.render(action, newItem)
                    }
                })
            }
        })
    }

    generateNewItem = ({id, value, checked}) => {
        const li = document.createElement('li'),
              div = document.createElement('div'),
              input = document.createElement('input'),
              textDiv = document.createElement('div'),
              button = document.createElement('button')

        div.classList.add('start')

        input.setAttribute('type', 'checkbox')
        input.setAttribute('id', id)
        input.classList.add('checkbox')

        textDiv.textContent = value

        button.classList.add('delete-btn')
        button.textContent = 'DELETE'

        if (checked) {
            input.checked = true
            textDiv.classList.add('checked')
        }

        div.append(input, textDiv)
        li.append(div, button)

        return li
    }

    render(action, item='') {
        switch (action) {
            case 'add':
                const newItem = this.generateNewItem(item)
                this.parentElement.append(newItem)
                break

            case 'toggle':
                const oldItemInput = this.parentElement.querySelector(`#${item.id}`)
                const oldItem = oldItemInput.parentElement.parentElement

                const itemForReplace = this.generateNewItem(item)
                oldItem.before(itemForReplace)
                this.parentElement.removeChild(oldItem)
                break

            case 'delete':
                const elemItems = this.parentElement.querySelectorAll('li')
                this.parentElement.removeChild(elemItems[+item])
                break
                
            default:
                this.parentElement.innerHTML = ''
                const items = this.#listData.map(listItem => this.generateNewItem(listItem))
                this.parentElement.append(...items)
                break
        }
    }
}