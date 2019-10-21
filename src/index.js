import {format} from 'date-fns';

function Todo(title, priority = '1',
              dueDate = format(Date.now(), 'yyyy-MM-dd'),
              description = '') {
    let _title = title;
    let _priority = priority;
    let _dueDate = dueDate;
    let _description = description;

    return {
        get title() {
            return _title;
        },
        get priority() {
            return _priority;
        },
        get dueDate() {
            return _dueDate;
        },
        get description() {
            return _description;
        },
        set title(value) {
            _title = value;
        },
        set priority(value) {
            _priority = value;
        },
        set dueDate(value) {
            _dueDate = value;
        },
        set description(value) {
            _description = value;
        }
    };
}

function Project(name) {
    let _name = name;
    let todos = [];

    return {
        get name() {
            return _name;
        },
        set name(value) {
            _name = value;
        },
        todos
    };
}

const projects = JSON.parse(localStorage.getItem('projects')) || [Project('Default')];
let activeProject = null;

function update() {
    localStorage.setItem('projects', JSON.stringify(projects));
}

(() => {
    const projectsDiv = document.createElement('div');
    projectsDiv.id = "projects";

    function createProjectDiv(project) {
        const projectDiv = document.createElement('div');
        projectDiv.classList.add('project');
        projectDiv.textContent = project.name;
        projectDiv.addEventListener('click', () => {

            function promptProject() {
                const newName = prompt('New name (blank to delete):', project.name);

                function deleteProject() {
                    projects.splice(projects.indexOf(project), 1);
                    projectsDiv.removeChild(projectDiv);
                    update();
                }

                function renameProject() {
                    project.name = newName;
                    projectDiv.textContent = newName;
                    update();
                }

                if (newName) renameProject();
                else if (newName === '') deleteProject();
            }

            function switchProjects() {
                projectsDiv.childNodes.forEach(
                    node => node.classList.remove('active'));
                projectDiv.classList.add('active');
                activateTodos(project.todos, activeProject !== null);
                activeProject = project;
            }

            if (activeProject === project) promptProject();
            else switchProjects();
        });
        return projectDiv;
    }

    const addProjectDiv = document.createElement('div');
    addProjectDiv.id = 'add-project';
    addProjectDiv.classList.add('project');
    addProjectDiv.addEventListener('click', function promptNewProject() {
        const newName = prompt('New project:', '');

        function addNewProject() {
            const project = Project(newName);
            projects.push(project);
            projectsDiv.insertBefore(createProjectDiv(project), addProjectDiv);
            update();
        }

        if (newName) addNewProject();
    });

    projectsDiv.appendChild(addProjectDiv);

    for (let project of projects)
        projectsDiv.insertBefore(createProjectDiv(project), addProjectDiv);

    document.getElementById('root').appendChild(projectsDiv);
})();

function activateTodos(todos, clearExisting) {
    const todosDiv = document.createElement('div');
    todosDiv.id = 'todos';

    function createTodoDiv(todo) {
        const todoDiv = document.createElement('div');
        todoDiv.classList.add('todo');
        todoDiv.addEventListener('click', function edit() {
            const veil = document.createElement('div');
            veil.id = 'veil';
            const form = document.createElement('form');
            form.id = 'form';

            const titleField = document.createElement('input');
            titleField.classList.add('field');
            titleField.type = 'text';
            titleField.value = todo.title;
            titleField.required = true;
            const priorityField = document.createElement('input');
            priorityField.classList.add('field');
            priorityField.type = 'number';
            priorityField.value = todo.priority;
            priorityField.required = true;
            priorityField.min = '1';
            priorityField.max = '3';
            const dueDateField = document.createElement('input');
            dueDateField.classList.add('field');
            dueDateField.type = 'date';
            dueDateField.value = todo.dueDate;
            dueDateField.required = true;
            const descriptionField = document.createElement('textarea');
            descriptionField.classList.add('field');
            descriptionField.value = todo.description;
            const saveButton = document.createElement('button');
            saveButton.classList.add('save', 'field');
            saveButton.textContent = 'Save';
            saveButton.addEventListener('click', function save() {
                todo.title = titleField.value;
                todo.priority = priorityField.value;
                todo.dueDate = format(dueDateField.valueAsDate, 'yyyy-MM-dd');
                todo.description = descriptionField.value;
                todosDiv.insertBefore(createTodoDiv(todo), todoDiv);
                todosDiv.removeChild(todoDiv);
                document.getElementById('root').removeChild(veil);
                update();
            });
            const cancelButton = document.createElement('button');
            cancelButton.classList.add('cancel', 'field');
            cancelButton.textContent = 'Cancel';
            cancelButton.addEventListener('click', function save() {
                document.getElementById('root').removeChild(veil);
            });

            form.append(titleField, priorityField, dueDateField, descriptionField, saveButton, cancelButton);
            veil.appendChild(form);
            document.getElementById('root').appendChild(veil);
        });

        const boxDiv = document.createElement('div');
        boxDiv.classList.add('box');
        switch (todo.priority) {
            case '1':
                boxDiv.style.border = '3px solid yellow';
                break;
            case '2':
                boxDiv.style.border = '3px solid orange';
                break;
            default:
                boxDiv.style.border = '3px solid red';
        }
        boxDiv.addEventListener('click', function finish() {
            todos.splice(todos.indexOf(todo), 1);
            todosDiv.removeChild(todoDiv);
        });
        const titleDiv = document.createElement('div');
        titleDiv.classList.add('title');
        titleDiv.textContent = todo.title;
        const dueDateDiv = document.createElement('div');
        dueDateDiv.classList.add('date');
        dueDateDiv.textContent = todo.dueDate;

        todoDiv.append(boxDiv, titleDiv, dueDateDiv);

        return todoDiv;
    }

    const addTodoDiv = document.createElement('div');
    addTodoDiv.classList.add('todo');
    addTodoDiv.addEventListener('click', function promptNewTodo() {
        const newTitle = prompt('New todo:', '');

        function addNewTodo() {
            const todo = Todo(newTitle);
            todos.push(todo);
            todosDiv.insertBefore(createTodoDiv(todo), addTodoDiv);
            update();
        }

        if (newTitle) addNewTodo();
    });

    todosDiv.appendChild(addTodoDiv);

    for (let todo of todos)
        todosDiv.insertBefore(createTodoDiv(todo), addTodoDiv);

    const root = document.getElementById('root');
    if (clearExisting) root.removeChild(root.lastChild);
    root.appendChild(todosDiv);
}