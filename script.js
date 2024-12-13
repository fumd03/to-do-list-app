document.addEventListener("DOMContentLoaded", loadTasks);

const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");

addTaskBtn.addEventListener("click", addTask);

function addTask() {
    const taskText = taskInput.value.trim();

    if (taskText === "") {
        alert("Please enter a task.");
        return; // Exit if input is empty
    }

    const task = {
        id: Date.now(),
        text: taskText,
        completed: false,
    };

    // Add task to the list and local storage
    appendTaskToDOM(task);
    saveTaskToLocalStorage(task);

    // Clear input field
    taskInput.value = "";
}

function appendTaskToDOM(task) {
    const li = document.createElement("li");

    li.setAttribute("data-id", task.id);

    li.innerHTML = `
        <span class="${task.completed ? "completed" : ""}">${task.text}</span>
        <div>
            <button class="edit-btn" onclick="editTask(${
              task.id
            })">Edit</button>
            <button class="delete-btn" onclick="deleteTask(${
              task.id
            })">Delete</button>
            <button class="complete-btn" onclick="toggleComplete(${
              task.id
            })">✔</button>
        </div>
`;

    taskList.appendChild(li);
}

function editTask(id) {
    const li = document.querySelector(`li[data-id='${id}']`);
    const span = li.querySelector("span");
    const newText = prompt("Edit your task:", span.textContent);

    if (newText !== null && newText.trim() !== "") {
        span.textContent = newText.trim();
        updateLocalStorage(id, newText.trim());
    }
}

function deleteTask(id) {
    const li = document.querySelector(`li[data-id='${id}']`);
    li.remove();
    removeFromLocalStorage(id);
}

function toggleComplete(id) {
    const li = document.querySelector(`li[data-id='${id}']`);
    const span = li.querySelector("span");
    span.classList.toggle("completed");

    updateCompletionStatus(id, span.classList.contains("completed"));
}

// Local Storage Functions

function saveTaskToLocalStorage(task) {
    let tasks = getTasksFromLocalStorage();
    tasks.push(task);
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
    let tasks = getTasksFromLocalStorage();
    tasks.forEach((task) => appendTaskToDOM(task));
}

function getTasksFromLocalStorage() {
    return JSON.parse(localStorage.getItem("tasks")) || [];
}

function removeFromLocalStorage(id) {
    let tasks = getTasksFromLocalStorage();
    tasks = tasks.filter((task) => task.id !== id);
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function updateLocalStorage(id, newText) {
    let tasks = getTasksFromLocalStorage();
    tasks.forEach((task) => {
        if (task.id === id) {
            task.text = newText;
        }
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function updateCompletionStatus(id, completed) {
    let tasks = getTasksFromLocalStorage();
    tasks.forEach((task) => {
        if (task.id === id) {
            task.completed = completed;
        }
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
}