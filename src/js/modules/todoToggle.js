const todoToggle = (mainData, parentElem) => {
    parentElem.addEventListener('click', (e) => {
        const currentTarget = e.target,
              checkboxes = document.querySelectorAll('[type=checkbox]');

        const oldData = mainData.getData();      
        const newData = [];
        if (currentTarget) {
            checkboxes.forEach((checkbox, i) => {
                if (currentTarget === checkbox) {
                    oldData[i].checked = checkbox.checked;
                    newData.push(...oldData);

                    mainData.setNewData(newData);
                    mainData.render(parentElem);
                }
            });
        }
    });
};

export default todoToggle;