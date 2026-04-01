
class Todo {
    constructor() {
        this.tasks = [];
        this.itemListElement = document.getElementById('itemList');
        this.addInputElement = document.getElementById('addInput');
        this.addButtonElement = document.getElementById('addButton');
        this.searchInputElement = document.getElementById('searchInput');
        this.deleteButtonElement = document.getElementById('deleteButton');
        this.deadlineInputElement = document.getElementById('deadlineInput');

        this.initializeEventListeners();
        this.loadFromLocalStorage();
    }

    draw() {
        // Wyczyść bieżącą zawartość
        this.itemListElement.innerHTML = '';

        this.tasks.forEach((task, index) => {
            const li = document.createElement('li');
            li.className = 'task-item';

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.className = 'task-checkbox';
            checkbox.checked = task.completed || false;
            checkbox.addEventListener('change', () => this.toggleTask(index));

            const span = document.createElement('span');
            span.className = 'task-text';
            let displayText = task.text;
            if (task.deadline) {
                const deadlineDate = new Date(task.deadline);
                const formattedDate = deadlineDate.toLocaleString('pl-PL', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit'
                });
                displayText += ` (Termin: ${formattedDate})`;
            }
            span.textContent = displayText;
            if (task.completed) {
                span.classList.add('completed');
            }

            span.addEventListener('click', (e) => {
                e.stopPropagation();
                this.startEditingTask(span, index);
            });

            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'delete-task-btn';
            deleteBtn.textContent = '🗑️';
            deleteBtn.title = 'Usuń zadanie';
            deleteBtn.addEventListener('click', () => this.deleteTask(index));

            li.appendChild(checkbox);
            li.appendChild(span);
            li.appendChild(deleteBtn);
            this.itemListElement.appendChild(li);
        });
    }

    addTask(text) {
        const trimmedText = text.trim();

        if (trimmedText.length < 3) {
            alert('Zadanie musi mieć co najmniej 3 znaki');
            return;
        }

        if (trimmedText.length > 255) {
            alert('Zadanie nie może mieć więcej niż 255 znaków');
            return;
        }

        const deadlineValue = this.deadlineInputElement.value;
        let deadline = null;
        if (deadlineValue) {
            const deadlineDate = new Date(deadlineValue);
            const now = new Date();
            if (deadlineDate.getTime() <= now.getTime()) {
                alert('Termin wykonania musi być w przyszłości!');
                return;
            }
            deadline = deadlineDate.toISOString();
        }

        this.tasks.push({
            text: trimmedText,
            completed: false,
            deadline: deadline
        });

        this.addInputElement.value = '';
        this.deadlineInputElement.value = '';
        this.draw();
        this.saveToLocalStorage();
    }

    toggleTask(index) {
        if (this.tasks[index]) {
            this.tasks[index].completed = !this.tasks[index].completed;
            this.draw();
            this.saveToLocalStorage();
        }
    }

    deleteCompletedTasks() {
        this.tasks = this.tasks.filter(task => !task.completed);
        this.draw();
        this.saveToLocalStorage();
    }

    deleteTask(index) {
        if (this.tasks[index]) {
            this.tasks.splice(index, 1);
            this.draw();
            this.saveToLocalStorage();
        }
    }

    startEditingTask(spanElement, index) {
        const currentText = this.tasks[index].text;
        const currentDeadline = this.tasks[index].deadline;

        const editContainer = document.createElement('div');
        editContainer.className = 'edit-container';
        editContainer.style.display = 'flex';
        editContainer.style.flexDirection = 'column';
        editContainer.style.gap = '8px';
        editContainer.style.width = '100%';
        const textInput = document.createElement('input');
        textInput.type = 'text';
        textInput.value = currentText;
        textInput.className = 'task-edit-input';
        textInput.style.width = '100%';
        textInput.style.border = '1px solid #4CAF50';
        textInput.style.padding = '4px';
        textInput.style.borderRadius = '4px';

        const deadlineInput = document.createElement('input');
        deadlineInput.type = 'datetime-local';
        if (currentDeadline) {
            const deadlineDate = new Date(currentDeadline);
            const formatted = deadlineDate.toISOString().slice(0, 16); // Format YYYY-MM-DDTHH:MM
            deadlineInput.value = formatted;
        }
        deadlineInput.className = 'task-edit-deadline';
        deadlineInput.style.width = '100%';
        deadlineInput.style.border = '1px solid #4CAF50';
        deadlineInput.style.padding = '4px';
        deadlineInput.style.borderRadius = '4px';

        const buttonContainer = document.createElement('div');
        buttonContainer.style.display = 'flex';
        buttonContainer.style.gap = '8px';
        buttonContainer.style.marginTop = '8px';

        const saveBtn = document.createElement('button');
        saveBtn.textContent = 'Zapisz';
        saveBtn.className = 'edit-save-btn';
        saveBtn.style.padding = '6px 12px';
        saveBtn.style.backgroundColor = '#4CAF50';
        saveBtn.style.color = 'white';
        saveBtn.style.border = 'none';
        saveBtn.style.borderRadius = '4px';
        saveBtn.style.cursor = 'pointer';

        const cancelBtn = document.createElement('button');
        cancelBtn.textContent = 'Anuluj';
        cancelBtn.className = 'edit-cancel-btn';
        cancelBtn.style.padding = '6px 12px';
        cancelBtn.style.backgroundColor = '#f44336';
        cancelBtn.style.color = 'white';
        cancelBtn.style.border = 'none';
        cancelBtn.style.borderRadius = '4px';
        cancelBtn.style.cursor = 'pointer';

        buttonContainer.appendChild(saveBtn);
        buttonContainer.appendChild(cancelBtn);

        editContainer.appendChild(textInput);
        editContainer.appendChild(deadlineInput);
        editContainer.appendChild(buttonContainer);

        spanElement.parentNode.replaceChild(editContainer, spanElement);
        textInput.focus();
        textInput.select();

        const saveEdit = () => {
            const newText = textInput.value.trim();

            if (newText.length < 3) {
                alert('Zadanie musi mieć co najmniej 3 znaki!');
                textInput.focus();
                return;
            }

            if (newText.length > 255) {
                alert('Zadanie nie może mieć więcej niż 255 znaków!');
                textInput.focus();
                return;
            }

            const newDeadlineValue = deadlineInput.value;
            let newDeadline = null;
            if (newDeadlineValue) {
                const newDeadlineDate = new Date(newDeadlineValue);
                const now = new Date();
                if (newDeadlineDate.getTime() <= now.getTime()) {
                    alert('Termin wykonania musi być w przyszłości!');
                    deadlineInput.focus();
                    return;
                }
                newDeadline = newDeadlineDate.toISOString();
            }

            this.tasks[index].text = newText;
            this.tasks[index].deadline = newDeadline;
            this.draw();
            this.saveToLocalStorage();
        };

        const cancelEdit = () => {
            this.draw();
        };

        textInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                saveEdit();
            }
            if (e.key === 'Escape') {
                cancelEdit();
            }
        });

        saveBtn.addEventListener('click', saveEdit);

        cancelBtn.addEventListener('click', cancelEdit);

        const handleClickOutside = (e) => {
            if (!editContainer.contains(e.target)) {
                saveEdit();
                document.removeEventListener('click', handleClickOutside);
            }
        };

        setTimeout(() => {
            document.addEventListener('click', handleClickOutside);
        }, 10);
    }


    searchTasks(query) {
        const lowerQuery = query.toLowerCase();
        const filtered = this.tasks.filter(task =>
            task.text.toLowerCase().includes(lowerQuery)
        );

        const originalTasks = this.tasks;
        this.tasks = filtered;
        this.draw();
        this.tasks = originalTasks;
    }

    initializeEventListeners() {
        this.addButtonElement.addEventListener('click', () => {
            this.addTask(this.addInputElement.value);
        });

        this.addInputElement.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.addTask(this.addInputElement.value);
            }
        });

        this.deleteButtonElement.addEventListener('click', () => {
            this.deleteCompletedTasks();
        });

        this.searchInputElement.addEventListener('input', (e) => {
            const query = e.target.value.trim();
            if (query.length >= 2) {
                this.searchTasks(query);
            } else {
                this.draw();
            }
        });
    }

    loadFromLocalStorage() {
        const storedTasks = JSON.parse(localStorage.getItem('tasks'));
        if (Array.isArray(storedTasks)) {
            this.tasks = storedTasks;
            this.draw();
        }
    }

    saveToLocalStorage() {
        localStorage.setItem('tasks', JSON.stringify(this.tasks));
    }
}

const todoApp = new Todo();
console.debug("Todo app initialized!");
