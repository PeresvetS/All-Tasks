import { getTaskData, getCommentsData } from './query-builders';
import getIdFromSearch from './services';

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
