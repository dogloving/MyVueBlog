# MyVueBlog

在线demo: http://112.74.33.44/ 

<del>管理员登录账号密码： admin  admin</del>

前端：*Vue+Vue-Router+iViewUI*

后端：*NodeJS+Express+Mysql*

目前只上传前端代码。

已实现主要功能：管理员登录，查看编辑文章，管理员/普通用户区别显示。

界面截图：
![](./img/user.gif)

![](./img/admin.gif)

服务器访问地址配置文件: *blog/src/network/request.js*

### 2020/05/29
添加项目栏；懒加载
### 2020/05/30
添加侧边栏收展

###2020/06/10

解决侧边栏显示问题。

由于wangEditor不支持markdown语法及代码高亮，已换成mavon-editor，配合marked+highlight将markdown文本转成html代码并支持高亮。





## Project setup

```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
