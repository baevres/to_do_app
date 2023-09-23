const deleteTodo = (mainData, parentElem) => {
    parentElem.addEventListener('click', (e) => {
        const currentTarget = e.target,
              deleteBtns = document.querySelectorAll('.delete-btn');

        const oldData = mainData.getData();
        let newData = [];
        if (currentTarget) {
            deleteBtns.forEach((btn, i) => {
                if (currentTarget === btn) {
                    oldData.splice(i, 1);
                    newData = [...oldData];

                    mainData.setNewData(newData);
                    mainData.render(parentElem);
                }
            });
        }
    });
};

export default deleteTodo;