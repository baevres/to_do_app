**Todo App**

This is a straightforward Todo web application that allows you to manage your tasks.

**API endpoints**

_tasks_: 

GET:

/api/user/todo{query} - get all tasks, query - checked=bool

/api/user/todo/{id} - get a specific task

POST:

/api/user/todo - create a new task

PUT:

/api/user/todo - update a list of tasks

/api/user/todo/{id} - update a specific task

DELETE:

/api/user/todo/{id} - delete a specific task

***
_users_:

GET:

/api/user/{id} - get a specific user

POST:

/api/user - send data and check if is it an unique

/api/user/create - create a new user

/api/user/auth - authenticate user and get new tokens

/api/user/auth/refresh - refresh access token

**Updates**

_Stage 5_:
* added server on a native node.js
* added interaction with DB
* created tables - **users** and **tasks**
* added API interaction
* added user registration
* added full user authorization
* added new components - Loader and Toast

_Stage 4_:
* updated fileds displaying
* updated fields validation
* added new fields for **Sign Up** page
* refactored page content displaying

_Stage 3_:
**Warning** - please before using run _npm i_ command
* added filtering
* added check/uncheck all tasks
* added field validations
* added fake authorization
* added new dependencies

_Stage 2_:
* added Todo editing
* added **Login** and **Sign up** pages
* added SPA routing
* using Express.js instead of LiveServer or direct opening of index.js

**Features**
1. Add, edit, and delete tasks
2. Mark tasks as completed or uncompleted
3. Select/unselect all tasks
4. Tasks filtering by status
5. Access to the application via API
6. Full user authorization
7. Full user registration
8. Tasks are stored in PostgreSQL
9. Simple and intuitive user interface

**Installation**
1. Clone this repository to your local machine.
2. Open the project folder in your code editor.
3. Install dependecies
4. Install PostgreSQL Server
5. Execute scripts from _models/models.db_
6. Set secret data into _.env_ file

**Usage**

1. Open the terminal and execute the command "npm start"
2. Create your user and login
3. Use the input field to add new tasks and press Enter to add them to the list.
4. Click on a task to mark it as completed or uncompleted.
5. Double-click on a task to edit Todo.
6. Use the "DELETE" button to remove tasks.
7. Select/unselect all tasks
8. Filter tasks by status

**Development**
If you want to make changes or contribute to this project, follow these steps:
1. Install the project dependencies using npm install.
2. Make your changes to the source files in the src directory.
3. Open the terminal and execute the command "npm start"
