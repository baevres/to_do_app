import MainData from './services/mainData.js'

const todoPage = () => {
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

  // select/unselect all
  mainData.selectAll()

  // filter
  mainData.setFilter()
}

export default todoPage
