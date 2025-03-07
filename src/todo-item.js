const projectsContainer = document.querySelector("[data-projects]");
const newProjectForm = document.querySelector("[data-new-project-form]");
const newProjectInput = document.querySelector("[data-new-project-input]");
const deleteProjectButton = document.querySelector(
  "[data-delete-project-button]"
);
const projectDisplayContainer = document.querySelector(
  "[data-project-display-container]"
);
const projectTitleElement = document.querySelector("[data-project-title]");
const taskCountElement = document.querySelector("[data-task-count]");
const tasksContainer = document.querySelector("[data-tasks]");
const taskTemplate = document.querySelector("#task-template");
const newTaskForm = document.querySelector("[data-new-task-form]");
const newTaskInput = document.querySelector("[data-new-task-input]");
const newTaskDueDate = document.querySelector("[data-new-task-date]");
const newTaskPriority = document.querySelector("[data-new-task-priority]");
const newTaskDescription = document.querySelector(
  "[data-new-task-description]"
);

const clearCompleteTasksButton = document.querySelector(
  "[data-clear-complete-tasks-button]"
);

const LOCAL_STORAGE_PROJECT_KEY = "task.projects";
const LOCAL_STORAGE_SELECTED_PROJECT_ID_KEY = "task.selectedProjectId";
const LOCAL_STORAGE_NEW_USER_KEY = "task.newUser";

let projects = JSON.parse(
  localStorage.getItem(LOCAL_STORAGE_PROJECT_KEY) || []
);

let selectedProjectId = localStorage.getItem(
  LOCAL_STORAGE_SELECTED_PROJECT_ID_KEY
);

projectsContainer.addEventListener("click", (e) => {
  if (e.target.tagName.toLowerCase() === "li") {
    selectedProjectId = e.target.dataset.projectId;
    saveAndRender();
  }
});

tasksContainer.addEventListener("click", (e) => {
  if (e.target.tagName.toLowerCase() === "input") {
    const selectedProject = projects.find(
      (project) => project.id === selectedProjectId
    );
    const selectedTask = selectedProject.tasks.find(
      (task) => task.id === e.target.id
    );
    selectedTask.complete = e.target.checked;
    save();
    renderTaskCount(selectedProject);
  }
});

clearCompleteTasksButton.addEventListener("click", (e) => {
  const selectedProject = projects.find(
    (project) => project.id === selectedProjectId
  );
  selectedProject.tasks = selectedProject.tasks.filter(
    (task) => !task.complete
  );
  saveAndRender();
});

deleteProjectButton.addEventListener("click", (e) => {
  projects = projects.filter((project) => project.id !== selectedProjectId);
  selectedProjectId = null;
  saveAndRender();
});

newProjectForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const projectName = newProjectInput.value;
  if (projectName == null || projectName === "") return;
  const project = createProject(projectName);
  newProjectInput.value = null;
  selectedProjectId = project.id;
  projects.push(project);
  saveAndRender();
});

newTaskForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const taskName = newTaskInput.value;
  const taskDueDate = newTaskDueDate.value;
  const taskPriority = newTaskPriority.value;
  const taskDescription = newTaskDescription.value;
  if (taskName == null || taskName === "") return;
  const task = createTask(taskName, taskDueDate, taskPriority, taskDescription);
  newTaskForm.reset();
  const selectedProject = projects.find(
    (project) => project.id === selectedProjectId
  );
  selectedProject.tasks.push(task);
  saveAndRender();
});

function createProject(name) {
  return {
    id: Date.now().toString(),
    name,
    tasks: [],
  };
}

function createTask(name, dueDate, priority, description) {
  return {
    id: Date.now().toString(),
    name,
    complete: false,
    dueDate,
    priority,
    description,
  };
}

function saveAndRender() {
  save();
  render();
}

function save() {
  localStorage.setItem(LOCAL_STORAGE_PROJECT_KEY, JSON.stringify(projects));
  localStorage.setItem(
    LOCAL_STORAGE_SELECTED_PROJECT_ID_KEY,
    selectedProjectId
  );
  localStorage.setItem(LOCAL_STORAGE_NEW_USER_KEY, "false");
}

function render() {
  clearElement(projectsContainer);
  renderProjects();

  const selectedProject = projects.find(
    (project) => project.id === selectedProjectId
  );
  if (selectedProjectId == null) {
    projectDisplayContainer.style.display = "none";
  } else {
    projectDisplayContainer.style.display = "";
    projectTitleElement.textContent = selectedProject.name;
    renderTaskCount(selectedProject);
    clearElement(tasksContainer);
    renderTasks(selectedProject);
  }
}

function renderTasks(selectedProject) {
  selectedProject.tasks.forEach((task) => {
    const taskElement = document.importNode(taskTemplate.content, true);
    const checkboxInput = taskElement.querySelector(
      "[data-template-checkbox-input]"
    );
    checkboxInput.id = task.id;
    checkboxInput.checked = task.complete;
    const checkboxLabel = taskElement.querySelector(
      "[data-template-checkbox-label]"
    );
    checkboxLabel.htmlFor = task.id;
    checkboxLabel.append(task.name);
    const dateInput = taskElement.querySelector("[data-template-date-input]");
    dateInput.id = task.id;
    dateInput.value = task.dueDate;
    const dateLabel = taskElement.querySelector("[data-template-date-label]");
    dateLabel.htmlFor = task.id;
    const prioritySelect = taskElement.querySelector(
      "[data-template-priority-select]"
    );
    prioritySelect.id = task.id;
    prioritySelect.value = task.priority;
    const selectLabel = taskElement.querySelector(
      "[data-template-select-label]"
    );
    selectLabel.htmlFor = task.id;
    const descriptionTextarea = taskElement.querySelector(
      "[data-template-description-textarea]"
    );
    descriptionTextarea.id = task.id;
    descriptionTextarea.value = task.description;
    const descriptionLabel = taskElement.querySelector(
      "[data-template-description-label]"
    );
    descriptionLabel.htmlFor = task.id;
    tasksContainer.appendChild(taskElement);
  });
}

function renderTaskCount(selectedProject) {
  const incompleteTaskCount = selectedProject.tasks.filter(
    (task) => !task.complete
  ).length;
  const taskString = incompleteTaskCount === 1 ? "task" : "tasks";
  taskCountElement.textContent = `${incompleteTaskCount} ${taskString} remaining`;
}

function renderProjects() {
  projects.forEach((project) => {
    const projectElement = document.createElement("li");
    projectElement.dataset.projectId = project.id;
    projectElement.classList.add("project-name");
    projectElement.textContent = project.name;
    if (project.id === selectedProjectId) {
      projectElement.classList.add("active-project");
    }
    // console.log(project);
    projectsContainer.appendChild(projectElement);
  });
}

function clearElement(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

function addDefaultProject() {
  const selectedProject = projects.find(
    (project) => project.name === "Default"
  );
  console.log(localStorage.getItem(LOCAL_STORAGE_NEW_USER_KEY));
  if (selectedProject === undefined && LOCAL_STORAGE_NEW_USER_KEY === null) {
    const defaultProject = createProject("Default");
    projects.push(defaultProject);
    const newTask = createTask("New task");
    defaultProject.tasks.push(newTask);
    selectedProjectId = defaultProject.id;
    saveAndRender();
  }
  projectDisplayContainer.style.display = "none";
  save();
}

addDefaultProject();
