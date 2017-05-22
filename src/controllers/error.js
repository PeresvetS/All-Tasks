export default (router) => {
  router.get('/404', (ctx) => {
    ctx.status = 404;
    console.log(ctx.render('error/404'));
  });
};
