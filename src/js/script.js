"use-strict";

import MainData from "./services/mainData";

import todoToggle from "./modules/todoToggle";
import deleteTodo from "./modules/deleteTodo";
import addTodo from "./modules/addTodo";

document.addEventListener('DOMContentLoaded', () => {
    const listContainer = document.querySelector('.list-container'),
          addFormLocator = '.add-new-item';
    const mainData = new MainData();

    // render
    mainData.setDefaultData();
    mainData.render(listContainer);

    // checking
    todoToggle(mainData, listContainer);

    // delete
    deleteTodo(mainData, listContainer);

    // add todo
    addTodo(mainData, addFormLocator, listContainer);
});