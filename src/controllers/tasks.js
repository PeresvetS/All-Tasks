import { parse } from 'url';
import rollbar from 'rollbar';
import moment from 'moment';
import buildFormObj from '../lib/formObjectBuilder';
import { getTaskData, getComments, getTasks, getFilters } from '../lib/tools';

export default (router, { User, Task, TaskStatus, Tag, Comment }) => {
  router
    .get('newTask', '/tasks/new', async (ctx) => {
      const task = Task.build();
      const users = await User.findAll();
      ctx.render('tasks/new', { users, f: buildFormObj(task) });
    })
    .get('tasks', '/tasks', async (ctx) => {
      const { query } = parse(ctx.request.url, true);
      const allTasks = await Task.findAll();
      const where = await getFilters(query, ctx, Tag, allTasks);
      const rawSelectedTasks = await Task.findAll({ where });
      const tasks = await getTasks(rawSelectedTasks);
      const tags = await Tag.findAll();
      const statuses = await TaskStatus.findAll();
      const users = await User.findAll();
      ctx.render('tasks', { users, tasks, statuses, tags, moment, f: buildFormObj(tasks) });
    })
    .get('task', '/tasks/:id', async (ctx) => {
      const taskId = Number(ctx.params.id);
      const targetTask = await Task.findById(taskId);
      const task = await getTaskData(targetTask);
      const rawComments = task.comments;
      const comments = await getComments(rawComments);
      const tags = task.tags;
      const comment = Comment.build();
      const statuses = await TaskStatus.findAll();
      ctx.render('tasks/task', {
        task, comments, statuses, tags, f: buildFormObj(comment) });
    })
    .post('createTask', '/tasks', async (ctx) => {
      const form = ctx.request.body.form;
      form.creatorId = ctx.session.userId;
      const users = await User.findAll();
      const tags = form.Tags.split(' ');
      const task = Task.build(form);
      try {
        await task.save();
        await tags.map(tag => Tag.findOne({ where: { name: tag } })
          .then(async result => (result ? task.addTag(result) :
          task.createTag({ name: tag }))));
        ctx.flash.set('Task has been created');
        ctx.redirect(router.url('tasks'));
      } catch (e) {
        rollbar.handleError(e);
        ctx.render('tasks/new', { users, f: buildFormObj(task, e) });
      }
    })
    .get('editTask', '/tasks/:id/edit', async (ctx) => {
      const taskId = Number(ctx.params.id);
      const task = await Task.findById(taskId);
      const users = await User.findAll();
      const statuses = await TaskStatus.findAll();
      try {
        ctx.render('tasks/edit', { taskId, users, statuses, f: buildFormObj(task) });
      } catch (e) {
        ctx.render('root', { f: buildFormObj(task, e) });
      }
    })
    .patch('updateTask', '/tasks/:id/edit', async (ctx) => {
      const form = ctx.request.body.form;
      const id = Number(ctx.params.id);
      const tags = form.Tags.split(' ');
      const task = await Task.findById(id);
      try {
        await task.setStatus(Number(form.statusId));
        await task.update({
          name: form.name,
          description: form.description,
          assignedToId: form.assignedToId,
          statusId: form.statusId,
        }, {
          where: {
            id,
          },
        });
        if (tags !== '') {
          await tags.map(tag => Tag.findOne({ where: { name: tag } })
            .then(async result => (result ? task.addTag(result) :
            task.createTag({ name: tag }))));
        }
        ctx.flash.set('Task was updated');
        ctx.redirect(`/tasks/${id}`);
      } catch (e) {
        ctx.render('tasks/edit', { f: buildFormObj(task, e) });
      }
    })
    .delete('deleteTask', '/tasks/:id', async (ctx) => {
      const id = Number(ctx.params.id);
      const task = await Task.findById(id);
      try {
        await Task.destroy({
          where: { id },
        });
        ctx.flash.set('Task has been deleted');
        ctx.redirect(router.url('tasks'));
      } catch (e) {
        ctx.render('root', { f: buildFormObj(task, e) });
      }
    });
};
