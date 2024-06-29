document.addEventListener("DOMContentLoaded", () => {
  const projectForm = document.getElementById("projectForm");
  const taskForm = document.getElementById("taskForm");

  projectForm.addEventListener("submit", (event) => {
    event.preventDefault();
    validateProjectForm() ? alert("Proyecto creado con éxito") : null;
  });

  taskForm.addEventListener("submit", (event) => {
    event.preventDefault();
    validateTaskForm() ? alert("Tarea creada con éxito") : null;
  });

  const validateProjectForm = () => {
    const projectName = document.getElementById("projectName").value.trim();
    const projectNameError = document.getElementById("projectNameError");

    projectName.length >= 3
      ? (projectNameError.textContent = "")
      : (projectNameError.textContent =
          "El nombre del proyecto debe tener al menos 3 caracteres.");

    return projectName.length >= 3;
  };

  const validateTaskForm = () => {
    const taskTitle = document.getElementById("taskTitle").value.trim();
    const taskDescription = document
      .getElementById("taskDescription")
      .value.trim();
    const taskPriority = document.getElementById("taskPriority").value;
    const taskDueDate = document.getElementById("taskDueDate").value;

    const taskTitleError = document.getElementById("taskTitleError");
    const taskDescriptionError = document.getElementById(
      "taskDescriptionError"
    );
    const taskPriorityError = document.getElementById("taskPriorityError");
    const taskDueDateError = document.getElementById("taskDueDateError");

    taskTitle.length >= 3
      ? (taskTitleError.textContent = "")
      : (taskTitleError.textContent =
          "El título de la tarea debe tener al menos 3 caracteres.");

    taskDescription.length >= 5
      ? (taskDescriptionError.textContent = "")
      : (taskDescriptionError.textContent =
          "La descripción de la tarea debe tener al menos 5 caracteres.");

    taskPriority
      ? (taskPriorityError.textContent = "")
      : (taskPriorityError.textContent =
          "Debe seleccionar una prioridad para la tarea.");

    taskDueDate
      ? (taskDueDateError.textContent = "")
      : (taskDueDateError.textContent =
          "Debe seleccionar una fecha límite para la tarea.");

    return (
      taskTitle.length >= 3 &&
      taskDescription.length >= 5 &&
      taskPriority &&
      taskDueDate
    );
  };
});
