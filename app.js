// Accessing DOM Elements
const taskInput = document.getElementById('task-input');
const dueDateInput = document.getElementById('due-date-input');
const addTaskBtn = document.getElementById('add-task-btn');
const taskList = document.getElementById('task-list');

// Load tasks from Local Storage on page load
document.addEventListener('DOMContentLoaded', loadTasks);

// Add Task
addTaskBtn.addEventListener('click', () => {
  const taskText = taskInput.value.trim();
  const dueDate = dueDateInput.value;

  // Check if due date is in the past
function isPastDueDate(dueDate) {
    const today = new Date();
    const selectedDate = new Date(dueDate);
    return selectedDate < today;
  }

  // Validate due date and text
  if (isPastDueDate(dueDate)) {
    alert('Due date cannot be in the past. Please select a future date.');
    return;
  }

  if (taskText !== '') {
    addTask(taskText, dueDate, false);
    saveTaskToLocalStorage(taskText, dueDate, false);
    taskInput.value = '';
    dueDateInput.value = '';
  }
});

// Add Task to DOM
function addTask(taskText, dueDate, isCompleted = false) {
  const li = document.createElement('li');
  li.className = 'task-item';
  if (isCompleted) {
    li.classList.add('completed');
  }

  const span = document.createElement('span');
  span.textContent = `${taskText} (Due: ${dueDate})`;
  span.addEventListener('click', () => toggleTaskCompletion(li, taskText));

  const editBtn = document.createElement('button');
  editBtn.className = 'edit-btn';
  editBtn.textContent = 'Edit';
  editBtn.addEventListener('click', () => editTask(li));  

  const deleteBtn = document.createElement('button');
  deleteBtn.className = 'delete-btn';
  deleteBtn.textContent = 'Delete';
  deleteBtn.addEventListener('click', () => deleteTask(li, taskText));

  li.appendChild(span);
  li.appendChild(editBtn);
  li.appendChild(deleteBtn);
  taskList.appendChild(li);
}

// Toggle Task Completion
function toggleTaskCompletion(li, taskText) {
  li.classList.toggle('completed');
  updateTaskInLocalStorage(taskText, li.classList.contains('completed'));
}

// Edit Task
function editTask(li) {
  const span = li.querySelector('span');
  const taskTextWithDueDate = span.textContent;
  const currentText = taskTextWithDueDate.split(' (Due: ')[0]; 
  const dueDate = taskTextWithDueDate.split('(Due: ')[1]?.replace(')', ''); 

  const editInput = document.createElement('input');
  editInput.type = 'text';
  editInput.className = 'edit-input';
  editInput.value = currentText;  

  // Replace span with input field
  li.replaceChild(editInput, span);

  // Focus on the input field
  editInput.focus();

  // Save changes on pressing Enter or losing focus
  editInput.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') {
      saveEdit(li, editInput, currentText, dueDate);
    }
  });

  editInput.addEventListener('blur', () => {
    saveEdit(li, editInput, currentText, dueDate);
  });
}

// Save Edited Task
function saveEdit(li, editInput, currentText, dueDate) {
  const newText = editInput.value.trim();
  if (newText !== '') {
    const span = document.createElement('span');
    span.textContent = `${newText} (Due: ${dueDate})`; 
    span.addEventListener('click', () => toggleTaskCompletion(li, newText));

    // Replace input field with updated span
    li.replaceChild(span, editInput);

    // Update Local Storage
    updateTaskTextInLocalStorage(currentText, newText, dueDate);
  } else {
    
    const span = document.createElement('span');
    span.textContent = `${currentText} (Due: ${dueDate})`; // Preserve due date
    span.addEventListener('click', () => toggleTaskCompletion(li, currentText));
    li.replaceChild(span, editInput);
  }
}

// Delete Task
function deleteTask(li, taskText) {
  li.remove();
  removeTaskFromLocalStorage(taskText);
}

// Save Task to Local Storage
function saveTaskToLocalStorage(taskText, dueDate, isCompleted) {
  const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  tasks.push({ text: taskText, dueDate, completed: isCompleted });
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Update Task in Local Storage
function updateTaskInLocalStorage(taskText, isCompleted) {
  const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  const taskIndex = tasks.findIndex(task => task.text === taskText);
  if (taskIndex !== -1) {
    tasks[taskIndex].completed = isCompleted;
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }
}

// Update Task Text in Local Storage
function updateTaskTextInLocalStorage(oldText, newText, dueDate) {
  const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  const taskIndex = tasks.findIndex(task => task.text === oldText);
  if (taskIndex !== -1) {
    tasks[taskIndex].text = newText; 
    tasks[taskIndex].dueDate = dueDate; 
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }
}

// Remove Task from Local Storage
function removeTaskFromLocalStorage(taskText) {
  const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  const updatedTasks = tasks.filter(task => task.text !== taskText);
  localStorage.setItem('tasks', JSON.stringify(updatedTasks));
}

// Load Tasks from Local Storage
function loadTasks() {
  const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  tasks.forEach(task => addTask(task.text, task.dueDate, task.completed));
}

// Filter Tasks
document.getElementById('filter-all').addEventListener('click', () => filterTasks('all'));
document.getElementById('filter-completed').addEventListener('click', () => filterTasks('completed'));
document.getElementById('filter-pending').addEventListener('click', () => filterTasks('pending'));

function filterTasks(filter) {
  const tasks = document.querySelectorAll('.task-item');
  tasks.forEach(task => {
    switch (filter) {
      case 'completed':
        task.style.display = task.classList.contains('completed') ? 'flex' : 'none';
        break;
      case 'pending':
        task.style.display = !task.classList.contains('completed') ? 'flex' : 'none';
        break;
      default:
        task.style.display = 'flex';
        break;
    }
  });
}

