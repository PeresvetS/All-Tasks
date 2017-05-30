import { getTasks } from '../lib/tools';

export default (router, { Tag }) => {
  router
    .get('tag', '/tags/:id', async (ctx) => {
      const id = Number(ctx.params.id);
      const tag = await Tag.findById(id);
      const selectedTasks = await tag.getTasks();
      const tasks = await getTasks(selectedTasks);
      ctx.render('tags', { tasks, tag });
    });
};
