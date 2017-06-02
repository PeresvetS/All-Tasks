import rollbar from 'rollbar';
import buildFormObj from '../lib/formObjectBuilder';

export default (router, { Comment }) => {
  router
    .post('newComment', '/comments/:id', async (ctx) => {
      const form = ctx.request.body.form;
      form.TaskId = Number(ctx.params.id);
      form.UserId = ctx.session.userId;
      const comment = Comment.build(form);
      try {
        await comment.save();
        ctx.flash.set('Comment has been created');
        ctx.redirect(router.url('task', form.TaskId));
      } catch (e) {
        rollbar.handleError(e);
        ctx.render('tasks/task', { f: buildFormObj(comment, e) });
      }
    })
    .get('editComment', '/comments/:id', async (ctx) => {
      const id = Number(ctx.params.id);
      const comment = await Comment.findById(id);
      const taskId = comment.TaskId;
      const autorId = Number(comment.UserId);
      const userId = Number(ctx.session.userId);
      try {
        if (autorId === userId) {
          ctx.render('comments/edit', { taskId, f: buildFormObj(comment) });
        } else {
          ctx.flash.set('You can\'t edit comments of other users');
          ctx.redirect(router.url('task', taskId));
        }
      } catch (e) {
        ctx.render('tasks/task', { f: buildFormObj(comment, e) });
      }
    })
    .patch('updateComment', '/comments/:id', async (ctx) => {
      const form = ctx.request.body.form;
      const id = Number(ctx.params.id);
      const comment = await Comment.findById(id);
      const taskId = comment.TaskId;
      try {
        await comment.update({
          content: form.content,
        }, {
          where: {
            id,
          },
        });
        ctx.flash.set('Comment has been updated');
        ctx.redirect(router.url('task', taskId));
      } catch (e) {
        ctx.render('comments/edit', { f: buildFormObj(comment, e) });
      }
    })
    .delete('deleteComment', '/comments/:id', async (ctx) => {
      const id = Number(ctx.params.id);
      const comment = await Comment.findById(id);
      const taskId = comment.TaskId;
      try {
        await Comment.destroy({
          where: { id },
        });
        ctx.flash.set('Comment has been deleted');
        ctx.redirect(router.url('task', taskId));
      } catch (e) {
        ctx.render('comments/edit', { f: buildFormObj(comment, e) });
      }
    });
};
