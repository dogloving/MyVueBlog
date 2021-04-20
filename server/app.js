const express = require('express')
const app = express()
const db = require('./connect')
const util = require('./utils')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const redisStore = require('connect-redis')(session)

// 使得可以解析req.body为json
app.use(express.json())
// 解决跨域(同时解决CORS请求默认不发送cookie和HTTP认证信息,参考 https://blog.csdn.net/qq_36367995/article/details/80852267)
// 阮一峰老师文章： http://www.ruanyifeng.com/blog/2016/04/cors.html
app.all('*', function(req, res, next) {
  var whiteList = [/localhost:8080/,/localhost:8081/,/112.74.33.44/,/1.116.88.230/,
    /cnhjp.tech/]
  //如果要发送Cookie，Access-Control-Allow-Origin就不能设为星号，必须指定明确的、与请求网页一致的域名
  if (whiteList.some(item=>item.test(req.headers.origin))) {
    res.header("Access-Control-Allow-Origin", req.headers.origin)
  }
  // 表明服务器支持的所有头信息字段，如果浏览器请求包括Access-Control-Request-Headers字段，则Access-Control-Allow-Headers字段是必需的
  res.header("Access-Control-Allow-Headers", "X-Requested-With,Content-Type")
  // 该字段必需，它的值是逗号分隔的一个字符串，表明服务器支持的所有跨域请求的方法
  res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS")
  //
  res.header("Content-Type", "application/json;charset=utf-8")
  // 它的值是一个布尔值，表示是否允许发送Cookie。默认情况下，Cookie不包括在CORS请求中
  res.header('Access-Control-Allow-Credentials', true)
  next()
})
// session cookie部分参考https://segmentfault.com/a/1190000013048314
// 测试cookie使用
app.use(cookieParser('cookie-secret-hjp', {
  maxAge: 60*60*1000,
  httpOnly: true
}))
app.use((req, res, next)=> {
  res.cookie('name', 'Tony', {
    maxAge: 60*1000,
    signed: true
  })
  res.cookie('age', 12)
  next()
})
// 测试session cookie结合使用
// session
app.use(session({
  name: 'session-name', // 这里是cookie的name，默认是connect.sid
  secret: 'fjalkdfjlasdkjflaiuorejfksdjkfljadsfhklnvkhflkashs', // 建议使用 128 个字符的随机字符串
  resave: true,
  saveUninitialized: false,
  cookie: { maxAge: 60*60*24*1000, httpOnly: true }
}));

// 管理员登录
app.post('/api/login', (req, res)=>{
  // 读取传上来的用户名和密码
  const user = req.body
  db.query('select * from blog_user where username=? and password=?', [user.username, user.password], (results, fields)=> {
    var result = JSON.parse(JSON.stringify(results))
    if (result.length > 0) {
      // 登录成功
      req.session.islogin = true
      res.json({code: 1, msg: '登录成功'})
    } else {
      req.session.islogin = false
      res.json({code: -1, msg: '账号或密码错误'})
    }
  })
})
// 检查管理员是否已登录
app.get('/api/checklogin', (req, res)=> {
  // 检查session
  if (typeof req.session.islogin === 'undefined' || req.session.islogin === false) {
    res.json({code: -2, msg: '未登录'})
  } else {
    res.json({code: 2, msg: '管理员已登录'})
  }
})
// 返回所有tag
app.get('/api/getalltag', (req, res)=> {
  db.query('select tag_name from blog_tag',[],(results, fields)=> {
    const result = JSON.parse(JSON.stringify(results))
    res.json(result)
  })
})
// 根据文章ID返回文章信息以及对应tag
app.post('/api/getarticle', (req, res)=> {
  const aID = req.body.aid
  // 根据aID查找文章信息
  db.query('select a.type,a.article_title,a.article_content,a.article_content,a.publish_time,a.last_modify_time,t.tag_name' +
      ' from blog_article a join blog_tag t join blog_article_tag at where a.article_id=?' +
      ' and at.article_id=a.article_id and t.tag_id=at.tag_id;', [aID], (results, fields)=> {
    const result = JSON.parse(JSON.stringify(results))
    res.json({code: 3, msg: '获取文章信息', data: result})
  })
})
// 添加(修改)文章
app.post('/api/setarticle', (req, res)=> {
  // 先检查是否已登录
  if (typeof req.session.islogin === 'undefined' || req.session.islogin === false) {
    res.json({code: -2, msg: '未登录'})
  }
  let info= req.body
  if (info.tags.length === 0) info.tags.push('文章')
  // 先检查aID，已存在就修改文章，不存在就添加文章
  const aID = info.aid
  db.query('select * from blog_article where article_id=?', [aID], (results, fields)=> {
    const result = JSON.parse(JSON.stringify(results))
    if (result.length === 0) {
      // 添加文章
      const article_id = util.myMD5(Date.now()+info.title)
      db.query('insert into blog_article values(?,?,?,?,?,?)', [article_id, info.title, info.content, info.last_modify_time,
        info.last_modify_time, info.visible], (results)=> {
          // 插入tag
          db.query('select * from blog_tag', [], results=> {
            const result = JSON.parse(JSON.stringify(results))
            let allTags = [], allIDs = []
            result.forEach(item=>{
              allTags.push(item.tag_name)
              allIDs.push((item.tag_id))
            })
            for (const tag of info.tags) {
              // 新tag，添加到blog_tag中
              if (allTags.indexOf(tag) === -1) {
                let tag_id = util.myMD5(Date.now()+tag)
                db.query('insert into blog_tag values(?,?)', [tag_id, tag], results=>{})
                allTags.push(tag)
                allIDs.push(tag_id)
              }
              let tag_id = allIDs[allTags.indexOf(tag)]
              db.query('insert ignore into blog_article_tag values(?,?)', [article_id, tag_id], results=>{})
              // 删除没有对应文章的tag
              db.query('delete from blog_tag where not exists(select * from  blog_article_tag where blog_article_tag.tag_id=blog_tag.tag_id)', [], results=> {})
            }
          })
      })
    } else {
      // 修改文章
      db.query('update blog_article set article_title=?,article_content=?,last_modify_time=?,type=? where article_id=?',
          [info.title, info.content, info.last_modify_time, info.visible, aID], results=> {
          // 插入tag
            db.query('select * from blog_tag', [], results=> {
              const result = JSON.parse(JSON.stringify(results))
              let allTags = [], allIDs = []
              result.forEach(item=>{
                allTags.push(item.tag_name)
                allIDs.push((item.tag_id))
              })
              // 先删除该文章所有ID
              db.query('delete from blog_article_tag where article_id=?', [aID], results=>{
                for (const tag of info.tags) {
                  // 新tag，添加到blog_tag中
                  if (allTags.indexOf(tag) === -1) {
                    let tag_id = util.myMD5(Date.now()+tag)
                    db.query('insert into blog_tag values(?,?)', [tag_id, tag], results=>{})
                    allTags.push(tag)
                    allIDs.push(tag_id)
                  }
                  let tag_id = allIDs[allTags.indexOf(tag)]
                  // 加了ignore可防止重复添加
                  db.query('insert ignore into blog_article_tag values(?,?)', [aID, tag_id], results=>{})
                  // 删除没有对应文章的tag
                  db.query('delete from blog_tag where not exists(select * from  blog_article_tag where blog_article_tag.tag_id=blog_tag.tag_id)', [], results=> {})
                }
              })
            })
    })
    }
  })
  res.json({})
})
// 获取文章列表
app.post('/api/getarticlelist', (req, res)=> {
  const info = req.body
  const page = info.page, count = info.count
  // 管理员返回全部，普通用户返回可见的
  let sql = ''
  if (typeof req.session.islogin === 'undefined' || req.session.islogin === false) {
    sql = 'select article_id from blog_article where type=1 order by publish_time desc'
  } else {
    sql = 'select article_id from blog_article order by publish_time desc'
  }
  db.query(sql, [], results=> {
    const result = JSON.parse(JSON.stringify(results))
    const r = result.slice(page*8, page*8+count)
    let login = true
    if (typeof req.session.islogin === 'undefined' || req.session.islogin === false) {
      login = false
    }
    res.json({code: 4, msg: '获取文章列表成功', data: {login: login, total: result.length, current: r.map(obj=>obj['article_id'])}})
  })
})
// 获取对应tag的文章列表
app.post('/api/gettagarticlelist', (req, res)=> {
  const info = req.body
  const tag = info.tag, page = info.page, count = info.count
  // 管理员返回全部，普通用户返回可见的
  let sql = ''
  if (typeof req.session.islogin === 'undefined' || req.session.islogin === false) {
    sql = 'select a.article_id from blog_article a join blog_article_tag at join blog_tag t where a.type=1 and t.tag_name = ? and at.tag_id=t.tag_id ' +
        'and a.article_id = at.article_id order by a.publish_time desc'
  } else {
    sql = 'select a.article_id from blog_article a join blog_article_tag at join blog_tag t where t.tag_name = ? and at.tag_id=t.tag_id ' +
        'and a.article_id = at.article_id order by a.publish_time desc'
  }
  db.query(sql, [tag], results=> {
      const result = JSON.parse(JSON.stringify(results))
      const r = result.slice(page*8, page*8+count)
    let login = true
    if (typeof req.session.islogin === 'undefined' || req.session.islogin === false) {
      login = false
    }
      res.json({code: 5, msg: '获取tag文章列表成功', data: {login: login, total: result.length, current: r.map(obj=>obj['article_id'])}})
  })
})
// 删除文章
app.post('/api/deletearticle', (req, res)=> {
  if (typeof req.session.islogin === 'undefined' || req.session.islogin === false) {
    res.json({code: -2, msg: '未登录'})
  }
  const info = req.body
  const aID = info.aid
  db.query('delete a,at from blog_article a join blog_article_tag at where a.article_id=? and at.article_id=a.article_id', [aID], results=> {
    // 删除没有对应文章的tag
    db.query('delete from blog_tag where not exists(select * from  blog_article_tag where blog_article_tag.tag_id=blog_tag.tag_id)', [], results=> {
      res.json({code: 7, msg: '删除成功'})
    })
  })
})
// 添加(修改)Project
app.post('/api/setproject', (req, res)=> {
  // 先检查是否已登录
  if (typeof req.session.islogin === 'undefined' || req.session.islogin === false) {
    res.json({code: -2, msg: '未登录'})
  }
  const info = req.body
  // 先检查是否已有该projectID,如果有就修改，没有就添加
  let pID = info.pid
  db.query('select * from blog_project where project_id=?', [pID], results=> {
    const result = JSON.parse(JSON.stringify(results))
    if (result.length === 0) {
      // 添加
      pID = util.myMD5(Date.now()+info.title)
      db.query('insert into blog_project values(?,?,?,?)', [pID, info.title, info.description, info.site], results=> {
        res.json({code: 9, msg: '添加project成功'})
      })
    } else {
      // 修改
      db.query('update blog_project set title=?,description=?,site=? where project_id=?',
          [info.title, info.description, info.site, pID], results=> {
        res.json({code: 10, msg: '修改project成功'})
          })
    }
  })
})
// 返回所有Project信息
app.get('/api/getallproject', (req, res)=> {
  db.query('select * from blog_project',[], results=> {
    const result = JSON.parse(JSON.stringify(results))
    let login = true
    if (typeof req.session.islogin === 'undefined' || req.session.islogin === false) {
      login = false
    }
    res.json({code: 8, msg: '获取project列表成功', data: {projects: result, login: login}})
  })
})
// 根据ProjectID获取信息
app.post('/api/getprojectinfo', (req, res)=> {
  const info = req.body
  const pID = info.pid
  db.query('select title,description,site from blog_project where project_id=?', [pID], results=> {
    const result = JSON.parse(JSON.stringify(results))
    res.json({code: 10, msg: '', data: result})
  })
})
// 根据ProjectID删除信息
app.post('/api/deleteproject', (req, res)=> {
  // 先检查是否已登录
  if (typeof req.session.islogin === 'undefined' || req.session.islogin === false) {
    res.json({code: -2, msg: '未登录'})
  } else {
    const info = req.body
    const pID = info.pid
    db.query('delete from blog_project where project_id=?', [pID], results=> {
      res.json({code: 11, msg: '删除project成功'})
    })
  }
})

let port = 3000
app.listen(port, (err)=> {
  console.log('app is listening on port: ' + port)
})