/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/js/modules/addTodo.js":
/*!***********************************!*\
  !*** ./src/js/modules/addTodo.js ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
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

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (addTodo);

/***/ }),

/***/ "./src/js/modules/deleteTodo.js":
/*!**************************************!*\
  !*** ./src/js/modules/deleteTodo.js ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
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

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (deleteTodo);

/***/ }),

/***/ "./src/js/modules/todoToggle.js":
/*!**************************************!*\
  !*** ./src/js/modules/todoToggle.js ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
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

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (todoToggle);

/***/ }),

/***/ "./src/js/services/mainData.js":
/*!*************************************!*\
  !*** ./src/js/services/mainData.js ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ MainData)
/* harmony export */ });
"use-strict";

class MainData {
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

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!**************************!*\
  !*** ./src/js/script.js ***!
  \**************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _services_mainData__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./services/mainData */ "./src/js/services/mainData.js");
/* harmony import */ var _modules_todoToggle__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./modules/todoToggle */ "./src/js/modules/todoToggle.js");
/* harmony import */ var _modules_deleteTodo__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./modules/deleteTodo */ "./src/js/modules/deleteTodo.js");
/* harmony import */ var _modules_addTodo__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./modules/addTodo */ "./src/js/modules/addTodo.js");
"use-strict";







document.addEventListener('DOMContentLoaded', () => {
    const listContainer = document.querySelector('.list-container'),
          addFormLocator = '.add-new-item';
    const mainData = new _services_mainData__WEBPACK_IMPORTED_MODULE_0__["default"]();

    // render
    mainData.setDefaultData();
    mainData.render(listContainer);

    // checking
    (0,_modules_todoToggle__WEBPACK_IMPORTED_MODULE_1__["default"])(mainData, listContainer);

    // delete
    (0,_modules_deleteTodo__WEBPACK_IMPORTED_MODULE_2__["default"])(mainData, listContainer);

    // add todo
    (0,_modules_addTodo__WEBPACK_IMPORTED_MODULE_3__["default"])(mainData, addFormLocator, listContainer);
});
})();

/******/ })()
;
//# sourceMappingURL=bundle.js.map