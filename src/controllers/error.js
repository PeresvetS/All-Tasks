export default (router) => {
  router
    .get('/404', (ctx) => {
      ctx.status = 404;
      ctx.render('error/404');
    })
    .get('/500', (ctx) => {
      ctx.status = 500;
      ctx.render('error/500');
    });
};
