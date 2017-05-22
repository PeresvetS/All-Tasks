import buildFormObj from '../lib/formObjectBuilder';
import { encrypt } from '../lib/secure';

export default (router, { User }) => {
  router
    .get('newSession', '/session/new', async (ctx) => {
      const data = {};
      ctx.render('sessions/new', { f: buildFormObj(data) });
    })
    .post('session', '/session', async (ctx) => {
      const { email, password } = ctx.request.body.form;
      const user = await User.findOne({
        where: {
          email,
        },
      });
      if (user && user.passworddigest === encrypt(password)) {
        ctx.session.userId = Number(user.id);
        ctx.session.userName = `${user.firstName} ${user.lastName}`;
        ctx.session.userAvatar = user.avatar;
        ctx.redirect(router.url('root'));
        return;
      }
      ctx.state.errorMsg = 'email or password were wrong';
      ctx.render('sessions/new', { f: buildFormObj({ email }) });
    })
    .delete('session', '/session', (ctx) => {
      ctx.session = {};
      ctx.redirect(router.url('root'));
    });
};
