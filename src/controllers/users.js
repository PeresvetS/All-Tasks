import { parse } from 'path';
import rollbar from 'rollbar';
import koaBody from 'koa-body';
import { remove } from 'fs-extra';
import buildFormObj from '../lib/formObjectBuilder';

export default (router, { User }) => {
  router
    .get('users', '/users', async (ctx) => {
      const users = await User.findAll();
      ctx.render('users', { users });
    })
    .get('newUser', '/users/new', (ctx) => {
      const user = User.build();
      ctx.render('users/new', { f: buildFormObj(user) });
    })
    .post('users', '/users', async (ctx) => {
      const form = ctx.request.body.form;
      const user = User.build(form);
      try {
        await user.save();
        ctx.flash.set('User has been created');
        ctx.redirect(router.url('root'));
      } catch (e) {
        ctx.render('users/new', { f: buildFormObj(user, e) });
      }
    })
    .get('userProfile', '/users/:id', async (ctx) => {
      const id = ctx.params.id;
      const user = await User.findById(id);
      try {
        ctx.render('users/profile', { user });
      } catch (e) {
        ctx.render('root', { f: buildFormObj(user, e) });
      }
    })
    .get('userEdit', '/users/:id/edit', async (ctx) => {
      const id = Number(ctx.params.id);
      const user = await User.findById(id);
      if (ctx.session.userId === id) {
        ctx.render('users/edit', { f: buildFormObj(user) });
      } else {
        ctx.flash.set('You can\'t update other users');
        ctx.redirect(router.url('users'));
      }
    })
    .get('avatarChange', '/users/:id/avatar', async (ctx) => {
      const id = Number(ctx.params.id);
      const user = await User.findById(id);
      if (ctx.session.userId === id) {
        ctx.render('users/avatar', { f: buildFormObj(user) });
      } else {
        ctx.flash.set('You can\'t update other users');
        ctx.redirect(router.url('users'));
      }
    })
    .post('updateAvatar', '/users/:id', koaBody({
      multipart: true,
      formidable: {
        keepExtensions: true,
        maxFieldsSize: 2 * 2 * 1024,
        uploadDir: `${__dirname}/../../public/images`,
      },
    }), async (ctx) => {
      const absolutePath = String(ctx.request.body.files.file.path);
      const { base: imageName } = parse(absolutePath);
      const avatarPath = `/images/${imageName}`;
      const id = Number(ctx.params.id);
      const defaultAvatar = '/images/default.png';
      const user = await User.findById(id);
      if (ctx.session.userId === id) {
        try {
          if (user.avatar !== defaultAvatar) {
            const oldImagePath = `${__dirname}/../../public${user.avatar}`;
            await remove(oldImagePath);
          }
          await user.update({
            avatar: avatarPath,
          }, {
            where: {
              id,
            },
          });
          ctx.session.userAvatar = user.avatar;
          ctx.flash.set('Your avatar was updated');
          ctx.render('users/avatar', { f: buildFormObj(user) });
        } catch (e) {
          ctx.render('users/avatar', { f: buildFormObj(user, e) });
        }
      } else {
        ctx.flash.set('You can\'t update other users');
        ctx.redirect(router.url('users'));
      }
    })
    .delete('userDelete', '/users/:id', async (ctx) => {
      const id = Number(ctx.params.id);
      if (ctx.session.userId === id) {
        await User.destroy({
          where: {
            id,
          },
        });
        ctx.session = {};
        ctx.flash.set('Your profile was deleted');
        ctx.redirect(router.url('root'));
      } else {
        ctx.flash.set('You can\'t delete other users');
        ctx.redirect(router.url('users'));
      }
    })
    .patch('userUpdate', '/users/:id', async (ctx) => {
      const id = Number(ctx.params.id);
      const form = ctx.request.body.form;
      const user = await User.findById(id);
      if (ctx.session.userId === id) {
        try {
          await user.update({
            email: form.email,
            firstName: form.firstName,
            lastName: form.lastName,
          }, {
            where: {
              id,
            },
          });
          ctx.session.userName = `${user.firstName} ${user.lastName}`;
          ctx.flash.set('Your profile was updated');
          ctx.redirect(`/users/${id}`);
        } catch (e) {
          rollbar.handleError(e);
          ctx.render('users/edit', { f: buildFormObj(user, e) });
        }
      } else {
        ctx.flash.set('You can\'t update other users');
        ctx.redirect(router.url('users'));
      }
    });
};
