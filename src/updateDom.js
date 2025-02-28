import { createTodoProject } from "./todo-item";

const addProjectButton = document.querySelector("#add-project-btn");
addProjectButton.addEventListener("click", () => {
  const inputProjectName = prompt("Enter the project name:");
  const todoProjectObj = createTodoProject(inputProjectName);
  addProjectToDOM(todoProjectObj);
});

function addProjectToDOM(projectObj) {
  const projectList = document.querySelector(".project-list");
  const newProject = document.createElement("li");
  newProject.classList.add("project");
  newProject.dataset.projectId = projectObj.projectId;
  newProject.textContent = projectObj.name;
  projectList.appendChild(newProject);
  addClickEventToProject(projectObj);
}

function addClickEventToProject(projectObj) {
  const project = document.querySelector(
    "[data-project-id='" + projectObj.projectId + "']"
  );
  project.addEventListener("click", () => {});
}

function createTaskForm() {}
