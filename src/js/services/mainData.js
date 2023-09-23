"use-strict";

export default class MainData {
    constructor() {
        this._listID = 0;
        this._listData = [];
    }

    setDefaultData() {
        const defaultData = [
            {id: this._listID++, label: 'Test 1', checked: false},
            {id: this._listID++, label: 'Test 2', checked: true}
        ];
        if (!localStorage.getItem('listData')) {
            this._listData = defaultData;
            localStorage.setItem('listData', JSON.stringify(defaultData));
            localStorage.setItem('listID', JSON.stringify(this._listID));
        } else {
            this._listID = +JSON.parse(localStorage.getItem('listID'));;
            this._listData = JSON.parse(localStorage.getItem('listData'));
        }
    }

    getData() {
        return this._listData;
    }

    setNewData(newData, action='') {
        if (action === 'add') {
            newData.id = this._listID++;
            this._listData.push(newData);
        } else {
            this._listData = newData;
        }

        localStorage.setItem('listID', JSON.stringify(this._listID));
        localStorage.setItem('listData', JSON.stringify(this._listData));
    }

    render(parentElem) {
        parentElem.innerHTML = '';
        this._listData.forEach(({id, label, checked}) => {
            parentElem.innerHTML += `
            <li>
                <div class="start">
                    <input id="${id}" class="checkbox" type="checkbox" ${checked ? 'checked' : ''}>
                    <label class="form-check-label${checked ? ' checked' : ''}" for="${id}">${label}</label>
                </div>
                <button name="delete" class="delete-btn">DELETE</button>
            </li>
            `
        });
    }
}