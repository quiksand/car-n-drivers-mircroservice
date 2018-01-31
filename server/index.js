require('dotenv').config();
let Koa = require('koa');
let app = new Koa();



app.use(async ctx => {
  console.log(ctx)
  ctx.body = 'Hello World Yo';
});

app.listen(process.env.PORT, () => {
  console.log('Server listening on port ' + process.env.PORT);
});