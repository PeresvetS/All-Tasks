import lunr from 'lunr';

export const getTaskData = async (task) => {
  const creator = await task.getCreator();
  const assignedTo = await task.getAssignedTo();
  const tags = await task.getTags();
  const status = await task.getStatusName;
  const statusId = await task.getStatusId;
  const statusAvatar = await task.getStatusAvatar;
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
    tags,
    status,
    statusId,
    statusAvatar,
    comments,
  };
  return data;
};

const getCommentsData = async (comment) => {
  const autorName = await comment.getUserName;
  const autorAvatar = await comment.getUserAvatar;
  const autorId = await comment.getUserId;
  const taskId = await comment.getTaskId;

  const data = {
    id: comment.id,
    content: comment.content,
    createdAt: comment.createdAt,
    autorName,
    autorAvatar,
    autorId,
    taskId,
  };
  return data;
};

export const getTasks = tasks => Promise.all(tasks
  .map(async task => getTaskData(task)));

export const getComments = comments => Promise.all(comments
  .map(async comment => getCommentsData(comment)));


const getTasksIdByTagId = async (id, Tag) => {
  const tag = await Tag.findById(Number(id));
  const tasks = await tag.getTasks();
  const taskId = await Promise.all(tasks.reduce((acc, item) =>
  [...acc, item.dataValues.id], []));
  return taskId;
};


const getIdFromSearch = (requestKey, allTasks) => {
  const idx = lunr(function () {
    this.ref('id');
    this.field('name');
    this.field('description');

    allTasks.forEach(function (obj) {
      this.add(obj);
    }, this);
  });
  const response = idx.search(requestKey);
  const tasksId = response
  .reduce((acc, obj) => {
    const [arr] = Object.entries(obj)
  .filter(el => el[0] === 'ref');
    const id = arr[1];
    return [...acc, Number(id)];
  }, []);
  return tasksId;
};

export const getFilters = async (query, ctx, Tag, allTasks) =>
  Object.keys(query).reduce(async (acc, key) => {
    if (query[key] && query[key] !== 'All') {
      switch (key) {
        case 'myTasks':
          return { ...acc, [query[key]]: Number(ctx.session.userId) };
        case 'status':
          return { ...acc, statusId: Number(query[key]) };
        case 'appointee':
          return { ...acc, assignedToId: Number(query[key]) };
        case 'tag':
          return { ...acc,
            id: { $in: await getTasksIdByTagId(query[key], Tag) } };
        case 'form[search]':
          return { ...acc,
            id: { $in: await getIdFromSearch(query[key], allTasks) } };
        default:
          return acc;
      }
    }
    return acc;
  }, {});
