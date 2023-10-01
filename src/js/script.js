'use-strict'

import MainData from './services/mainData.js'

document.addEventListener('DOMContentLoaded', () => {
  const mainData = new MainData()

  // first render
  mainData.setDefaultData()
  mainData.render()

  // toggle
  mainData.modifyTodo('toggle')

  // delete
  mainData.modifyTodo('delete')

  // add todo
  mainData.addTodo()

  // edit todo
  mainData.editTodo()
})
