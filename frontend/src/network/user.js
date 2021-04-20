import {request} from "./request"

// 获取所有tag
export function getAllTag() {
  return request({
    url: '/getalltag',
    method: 'get'
  })
}
// 根据文章ID获取内容
export function getArticleInfo(info) {
  return request({
    url: '/getarticle',
    method: 'post',
    data: info
  })
}
// 获取文章列表
export function getArticleList(info) {
  return request({
    url: '/getarticlelist',
    method: 'post',
    data: info
  })
}
// 获取tag文章列表
export function getTagArticleList(info) {
  return request({
    url: '/gettagarticlelist',
    method: 'post',
    data: info
  })
}
// 获取所有project
export function getAllProject() {
  return request({
    url: '/getallproject',
    method: 'get'
  })
}