export const createTodoProject = function (name) {
  let todoProjectId = 0;
  return {
    name,
    todoProjectId: todoProjectId,
  };
};
