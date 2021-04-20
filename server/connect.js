const mysql = require('mysql')
const DB_CONFIG = require('./config')

module.exports = {
  query: (sql, params, callback) => {
    const connection = mysql.createConnection(DB_CONFIG)
    connection.connect(err=> {
      if (err) {
        console.log('连接数据库失败')
        throw err
      }
      // 如果连接成功开始操作数据库
      connection.query(sql, params, (err, results, fields)=> {
        if (err) {
          console.log('操作数据库失败')
          throw err
        }
        // 将查询结果返回给callback, results作为数据操作后的结果， fields作为数据库连接的一些字段
        callback && callback(results, fields)
        // 关闭数据库连接
        connection.end(err=> {
          if (err) {
            console.log('关闭数据库失败')
            throw err
          }
        })
      })
    })
}
}