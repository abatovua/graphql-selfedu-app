import Router from 'koa-router';

const router = new Router({
  sensitive: true,
  strict: true,
});

router
  .all('/graphl', () => {
    /* should be rewritten by appollo */
  })
  .get('/', async ctx => {
    ctx.body = { status: 'OK' };
  });

export default router;
