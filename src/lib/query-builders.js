export const getTaskData = async (task) => {
  const creator = await task.getCreator();
  const assignedTo = await task.getAssignedTo();
  const tags = await task.getTags();
  const status = await task.getStatus();
  const comments = await task.getComments({
    order: '"createdAt" DESC',
  });
  const data = {
    id: task.dataValues.id,
    name: task.dataValues.name,
    description: task.dataValues.description,
    createdAt: task.createdAt,
    creator: creator.fullName,
    creatorImg: creator.avatar,
    assignedTo: assignedTo.fullName,
    assignedToId: assignedTo.id,
    assignedToImg: assignedTo.avatar,
    status: status.dataValues.namme,
    statusId: status.dataValues.id,
    statusAvatar: status.dataValues.statusAvatar,
    tags,
    comments,
  };
  return data;
};

export const getCommentsData = async (comment) => {
  const user = await comment.getUser();
  const task = await comment.getTask();

  const data = {
    id: comment.id,
    content: comment.content,
    createdAt: comment.createdAt,
    autorName: user.fullName,
    autorAvatar: user.dataValues.avatar,
    autorId: user.dataValues.id,
    taskId: task.dataValues.id,
  };
  return data;
};
