document.addEventListener('DOMContentLoaded', function () {
  const newTodoInput = document.getElementById('new-todo');
  const addTodoButton = document.getElementById('add-todo');
  const todosContainer = document.getElementById('todos-container');
  const emptyState = document.getElementById('empty-state');
  const tasksCount = document.getElementById('tasks-count');
  const clearCompletedBtn = document.getElementById('clear-completed');

  let todos = JSON.parse(localStorage.getItem('todos')) || [];

  renderTodos();
  updateTasksCount();

  addTodoButton.addEventListener('click', addTodo);
  newTodoInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') addTodo();
  });

  clearCompletedBtn.addEventListener('click', () => {
    todos = todos.filter(todo => !todo.completed);
    saveTodos();
    renderTodos();
    updateTasksCount();
  });

  function addTodo() {
    const todoText = newTodoInput.value.trim();
    if (todoText) {
      const newTodo = {
        id: Date.now(),
        text: todoText,
        completed: false
      };
      todos.push(newTodo);
      saveTodos();
      renderTodos();
      updateTasksCount();
      newTodoInput.value = '';
      newTodoInput.focus();
    }
  }

  function toggleTodo(id) {
    todos = todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    saveTodos();
    renderTodos();
    updateTasksCount();
  }

  function deleteTodo(id) {
    todos = todos.filter(todo => todo.id !== id);
    saveTodos();
    renderTodos();
    updateTasksCount();
  }

  function renderTodos() {
    todosContainer.innerHTML = '';

    if (todos.length === 0) {
      emptyState.classList.remove('hidden');
    } else {
      emptyState.classList.add('hidden');
      todos.forEach((todo, index) => {
        const todoItem = document.createElement('div');
        todoItem.className = `todo-item fade-in p-3 rounded-lg flex items-center justify-between ${todo.completed ? 'completed bg-gray-100' : 'bg-white'}`;
        todoItem.style.animationDelay = `${index * 0.05}s`;

        todoItem.innerHTML = `
          <span class="todo-text flex-1 ${todo.completed ? 'line-through text-gray-400' : ''}">${todo.text}</span>
          <div class="todo-actions flex gap-2 items-center">
            <div class="custom-checkbox w-5 h-5 border-2 border-gray-400 rounded-full flex items-center justify-center cursor-pointer ${todo.completed ? 'bg-purple-800 border-purple-800 text-white' : ''}">
              ${todo.completed ? '✓' : ''}
            </div>
            <button class="delete-btn text-red-500 hover:text-red-700">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
                <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
              </svg>
            </button>
          </div>
        `;

        todosContainer.appendChild(todoItem);

        todoItem.querySelector('.custom-checkbox').addEventListener('click', () => toggleTodo(todo.id));
        todoItem.querySelector('.delete-btn').addEventListener('click', () => deleteTodo(todo.id));
      });
    }

    clearCompletedBtn.classList.toggle('hidden', !todos.some(todo => todo.completed));
  }

  function updateTasksCount() {
    const totalTasks = todos.length;
    const completedTasks = todos.filter(todo => todo.completed).length;
    tasksCount.textContent = `${totalTasks} task${totalTasks !== 1 ? 's' : ''} (${completedTasks} completed)`;
  }

  function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(todos));
  }
});
