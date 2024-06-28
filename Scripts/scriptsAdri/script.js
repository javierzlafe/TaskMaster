function loadData() {
    const data = localStorage.getItem('taskMasterData');
    if (data) {
        return JSON.parse(data);
    } else {
        const initialData = {
            Proyectos: [],
            Tareas: [],
            Usuarios: []
        };
        localStorage.setItem('taskMasterData', JSON.stringify(initialData));
        return initialData;
    }
}

function saveData(data) {
    localStorage.setItem('taskMasterData', JSON.stringify(data));
}

let taskMasterData = loadData();

function createProject(name, description) {
    const newProject = {
        id: taskMasterData.Proyectos.length + 1,
        nombre: name,
        descripcion: description,
        tareas: []
    };
    taskMasterData.Proyectos.push(newProject);
    saveData(taskMasterData);
    displayProjects();
    populateProjectSelect();
}

function createTask(projectId, nombre, asignadoA, prioridad, plazoDeEntrega, status) {
    const newTask = {
        id: taskMasterData.Tareas.length + 1,
        nombre: nombre,
        asignadoA: asignadoA,
        prioridad: prioridad,
        plazoDeEntrega: plazoDeEntrega,
        status: status,
        projectId: projectId || null
    };

    taskMasterData.Tareas.push(newTask);
    if (projectId) {
        const project = taskMasterData.Proyectos.find(p => p.id === parseInt(projectId));
        if (project) {
            project.tareas.push(newTask);
        }
    }
    saveData(taskMasterData);
    displayProjects();
    displayIndependentTasks();
}

function getProjects() {
    return taskMasterData.Proyectos;
}

function getTasks(projectId) {
    if (projectId) {
        const project = taskMasterData.Proyectos.find(p => p.id === parseInt(projectId));
        return project ? project.tareas : [];
    }
    return taskMasterData.Tareas.filter(task => !task.projectId);
}

function updateProject(id, newName, newDescription) {
    const project = taskMasterData.Proyectos.find(p => p.id === id);
    if (project) {
        project.nombre = newName;
        project.descripcion = newDescription;
        saveData(taskMasterData);
        displayProjects();
    }
}

function updateTask(taskId, newNombre, newAsignadoA, newPrioridad, newPlazoDeEntrega, newStatus) {
    const task = taskMasterData.Tareas.find(t => t.id === taskId);
    if (task) {
        task.nombre = newNombre;
        task.asignadoA = newAsignadoA;
        task.prioridad = newPrioridad;
        task.plazoDeEntrega = newPlazoDeEntrega;
        task.status = newStatus;
        saveData(taskMasterData);
        displayProjects();
        displayIndependentTasks();
    }
}

function deleteProject(id) {
    taskMasterData.Proyectos = taskMasterData.Proyectos.filter(p => p.id !== id);
    taskMasterData.Tareas = taskMasterData.Tareas.filter(t => t.projectId !== id);
    saveData(taskMasterData);
    displayProjects();
    displayIndependentTasks();
}

function deleteTask(taskId) {
    taskMasterData.Tareas = taskMasterData.Tareas.filter(t => t.id !== taskId);
    taskMasterData.Proyectos.forEach(project => {
        project.tareas = project.tareas.filter(t => t.id !== taskId);
    });
    saveData(taskMasterData);
    displayProjects();
    displayIndependentTasks();
}

document.getElementById("createProjectForm").addEventListener("submit", function(event) {
    event.preventDefault();
    const name = document.getElementById("projectName").value;
    const description = document.getElementById("projectDescription").value;
    createProject(name, description);
});

document.getElementById("createTaskForm").addEventListener("submit", function(event) {
    event.preventDefault();
    const projectId = document.getElementById("projectSelect").value || null;
    const nombre = document.getElementById("taskName").value;
    const asignadoA = document.getElementById("assignedTo").value;
    const prioridad = document.getElementById("priority").value;
    const plazoDeEntrega = document.getElementById("dueDate").value;
    const status = document.getElementById("status").value;
    createTask(projectId, nombre, asignadoA, prioridad, plazoDeEntrega, status);
});

function populateProjectSelect() {
    const projectSelect = document.getElementById("projectSelect");
    projectSelect.innerHTML = "<option value=''>Ninguno</option>";
    getProjects().forEach(project => {
        const option = document.createElement("option");
        option.value = project.id;
        option.textContent = project.nombre;
        projectSelect.appendChild(option);
    });
}

function displayProjects() {
    const projectList = document.getElementById("projectList");
    projectList.innerHTML = "";
    getProjects().forEach(project => {
        const projectItem = document.createElement("div");
        projectItem.className = 'project';
        projectItem.innerHTML = `
            <h3>${project.nombre}</h3>
            <p>${project.descripcion}</p>
            <button onclick="deleteProject(${project.id})">Eliminar Proyecto</button>
            <div class="task-list">
                ${displayTasks(project.id)}
            </div>
        `;
        projectList.appendChild(projectItem);
    });
}

function displayTasks(projectId) {
    const tasks = getTasks(projectId);
    return tasks.map(task => `
        <div class="task">
            <p><strong>Nombre:</strong> ${task.nombre}</p>
            <p><strong>Asignado a:</strong> ${task.asignadoA}</p>
            <p><strong>Prioridad:</strong> ${task.prioridad}</p>
            <p><strong>Plazo de Entrega:</strong> ${task.plazoDeEntrega}</p>
            <p><strong>Status:</strong> ${task.status}</p>
            <button onclick="deleteTask(${task.id})">Eliminar Tarea</button>
        </div>
    `).join('');
}

function displayIndependentTasks() {
    const taskList = document.getElementById("taskList");
    taskList.innerHTML = "";
    const tasks = getTasks();
    tasks.forEach(task => {
        const taskItem = document.createElement("div");
        taskItem.className = 'task';
        taskItem.innerHTML = `
            <p><strong>Nombre:</strong> ${task.nombre}</p>
            <p><strong>Asignado a:</strong> ${task.asignadoA}</p>
            <p><strong>Prioridad:</strong> ${task.prioridad}</p>
            <p><strong>Plazo de Entrega:</strong> ${task.plazoDeEntrega}</p>
            <p><strong>Status:</strong> ${task.status}</p>
            <button onclick="deleteTask(${task.id})">Eliminar Tarea</button>
        `;
        taskList.appendChild(taskItem);
    });
}

document.addEventListener("DOMContentLoaded", () => {
    populateProjectSelect();
    displayProjects();
    displayIndependentTasks();
});
