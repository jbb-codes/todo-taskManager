let projectId = 0;

export const createTodoProject = (name) => {
  projectId++;
  let tasks = [];

  const addTask = (task) => {
    tasks.push(task);
  };

  const removeTask = (task) => {
    tasks = tasks.filter((task) => task !== task);
  };

  const showTasks = () => {};

  return {
    name,
    projectId,
    addTask,
    removeTask,
    showTasks,
  };
};
