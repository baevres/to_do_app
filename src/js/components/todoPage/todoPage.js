import renderPage from '../../services/renderPage.js'
import MainData from '../../services/mainData.js'

const View = () => {
  const locator = '.app'
  const pageContent = `
  <div class="container">
    <div class="content">
      <h1>Todo List</h1>
      <div>
        <form class="add-new-item" novalidate>
          <input
            type="text"
            id="add-input"
            class="add-todo-input"
            placeholder="test"
            required
          />
          <label for="add-input" class="input-label">New todo</label>
          <button type="submit" class="btn add-btn">add</button>
        </form>
      </div>

      <div class="filter-wrapper">
        <div class="check-all">
          <input type="checkbox" class="checkbox" id="selectAllCheckbox" />
          <div>Select All</div>
        </div>

        <div class="filter-btns">
          <button id="allTasks" class="btn filter-btn selected">All Tasks</button>
          <button id="complited" class="btn filter-btn">Complited</button>
          <button id="pending" class="btn filter-btn">Pending</button>
        </div>
      </div>

      <ul class="list-container"></ul>
    </div>
  </div>
  `
  renderPage(locator, pageContent)
}

const todoPage = () => {
  View()

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
