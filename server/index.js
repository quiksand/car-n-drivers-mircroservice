require('dotenv').config();
let Koa = require('koa');
const routes = require('./routes');
let app = new Koa();


app.use(routes());
// app.use(async ctx => {
//   // console.log(ctx)
//   ctx.body = 'Hello World Yo';
// });

app.listen(process.env.PORT, () => {
  console.log('Server listening on port ' + process.env.PORT);
});