document.addEventListener('DOMContentLoaded', loadTasks);
document.getElementById('add-task').addEventListener('click', addTask);
document.getElementById('search').addEventListener('input', searchTasks);

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

function loadTasks() {
    renderTasks();
}

function addTask() {
    const title = document.getElementById('task-title').value;
    const description = document.getElementById('task-description').value;
    const dueDate = document.getElementById('task-due-date').value;
    const priority = document.getElementById('task-priority').value;

    if (title && dueDate) {
        const task = {
            id: Date.now(),
            title,
            description,
            dueDate,
            priority,
            completed: false
        };
        tasks.push(task);
        localStorage.setItem('tasks', JSON.stringify(tasks));
        renderTasks();
        clearForm();
    } else {
        alert('Title and Due Date are required!');
    }
}

function renderTasks() {
    document.getElementById('upcoming-tasks').innerHTML = '';
    document.getElementById('overdue-tasks').innerHTML = '';
    document.getElementById('completed-tasks').innerHTML = '';

    const today = new Date().toISOString().split('T')[0];

    tasks.forEach(task => {
        const taskElement = createTaskElement(task);
        if (task.completed) {
            document.getElementById('completed-tasks').appendChild(taskElement);
        } else if (task.dueDate < today) {
            document.getElementById('overdue-tasks').appendChild(taskElement);
        } else {
            document.getElementById('upcoming-tasks').appendChild(taskElement);
        }
    });
}

function createTaskElement(task) {
    const taskDiv = document.createElement('div');
    taskDiv.className = 'task';
    taskDiv.innerHTML = `
        <h3>${task.title} (${task.priority})</h3>
        <p>${task.description}</p>
        <p>Due Date: ${task.dueDate}</p>
        <button onclick="completeTask(${task.id})">Complete</button>
        <button onclick="deleteTask(${task.id})">Delete</button>
    `;
    return taskDiv;
}

function completeTask(id) {
    tasks = tasks.map(task => {
        if (task.id === id) {
            task.completed = true;
        }
        return task;
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderTasks();
}

function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderTasks();
}

function searchTasks() {
    const searchQuery = document.getElementById('search').value.toLowerCase();
    const filteredTasks = tasks.filter(task => 
        task.title.toLowerCase().includes(searchQuery) || 
        task.description.toLowerCase().includes(searchQuery)
    );

    document.getElementById('upcoming-tasks').innerHTML = '';
    document.getElementById('overdue-tasks').innerHTML = '';
    document.getElementById('completed-tasks').innerHTML = '';

    const today = new Date().toISOString().split('T')[0];

    filteredTasks.forEach(task => {
        const taskElement = createTaskElement(task);
        if (task.completed) {
            document.getElementById('completed-tasks').appendChild(taskElement);
        } else if (task.dueDate < today) {
            document.getElementById('overdue-tasks').appendChild(taskElement);
        } else {
            document.getElementById('upcoming-tasks').appendChild(taskElement);
        }
    });
}

function clearForm() {
    document.getElementById('task-title').value = '';
    document.getElementById('task-description').value = '';
    document.getElementById('task-due-date').value = '';
    document.getElementById('task-priority').value = 'High';
}