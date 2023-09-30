"use-strict";

import MainData from "./services/mainData.js"

document.addEventListener('DOMContentLoaded', () => {
    const listContainerLocator = '.list-container',
          addFormLocator = '.add-new-item',
          deleteBtnLocator = '.delete-btn',
          checkboxLocator = '[type=checkbox]'
    
    const mainData = new MainData(listContainerLocator, addFormLocator)

    // first render
    mainData.setDefaultData()
    mainData.render()

    // toggle
    mainData.modifyTodo(checkboxLocator, 'toggle')

    // delete
    mainData.modifyTodo(deleteBtnLocator, 'delete')

    // add todo
    mainData.addTodo()
});