import {request} from "./request"

export function login(info) {
  return request({
    url: '/login',
    method: 'post',
    data: info
  })
}
// 检查是否已登录
export function checkLogin() {
  return request({
    url: '/checklogin',
    method: 'get',
    headers: {
      "Content-Type": "application/json;charset=utf-8"
    }
  })
}
// 添加(修改)文章
export function setArticle(info) {
  return request({
    url: '/setarticle',
    method: 'post',
    data: info
  })
}
// 删除文章
export function deleteArticle(info) {
  return request({
    url: '/deletearticle',
    method: 'post',
    data: info
  })
}
// 添加(修改)Project
export function setProject(info) {
  return request({
    url: '/setproject',
    method: 'post',
    data: info
  })
}
// 根据pID获取Project信息
export function getProjectInfo(info) {
  return request({
    url: '/getprojectinfo',
    method: 'post',
    data: info
  })
}
// 根据pID删除Project
export function deleteProject(info) {
  return request({
    url: '/deleteproject',
    method: 'post',
    data: info
  })
}