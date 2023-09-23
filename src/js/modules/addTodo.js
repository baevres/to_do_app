const addTodo = (mainData, formLocator, listElem) => {
    const addForm = document.querySelector(formLocator),
          newTodoInput = addForm.querySelector('input');
    
    addForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const inputValue = newTodoInput.value;
        const newItem = {label: inputValue, checked: false};

        mainData.setNewData(newItem, 'add');
        mainData.render(listElem);

        e.target.reset();
    });
};

export default addTodo;