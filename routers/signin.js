const router = require('koa-router')();
const userModel = require('../lib/mysql.js')
const md5 = require('md5')
const checkNotLogin = require('../middlewares/check.js').checkNotLogin
const checkLogin = require('../middlewares/check.js').checkLogin

router.get('/signin', async(ctx, next) => {
    await checkNotLogin(ctx)
    await ctx.render('signin', {
        session: ctx.session,
    })
})


router.post('/signin', async(ctx, next) => {
  // console.log(ctx.request.body
  let name = ctx.request.body.name;
  let pass = ctx.request.body.password;
  try {
    let res = await userModel.findDataByName(name)
    if (res.length !== 0 && name === res[0]['name'] && md5(pass) === res[0]['pass']) {
        ctx.body = true
        ctx.session.user = res[0]['name']
        ctx.session.id = res[0]['id']
        console.log('ctx.session.id', ctx.session.id)
        console.log('session', ctx.session)
        console.log('登录成功')
    }else{
        ctx.body = false
        console.log('用户名或密码错误!')
    }
  } catch (error) {
    console.log(error)
  }
})

module.exports = router