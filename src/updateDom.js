export const addProjectToDom = function (todoProject) {
  const projectList = document.querySelector(".project-list");
  const project = document.createElement("li");
  project.classList.add("project");
  project.dataset.projectId = todoProject.todoProjectId;
  project.textContent = todoProject.name;
  projectList.appendChild(project);
};
