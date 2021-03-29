import axios from 'axios'
axios.defaults.withCredentials = true

export function request(config) {
  const instance = axios.create({
    // baseURL: 'http://112.74.33.44:3000/api',
    baseURL: 'http://localhost:3000/api',
    timeout: 5000
  })
  // 请求拦截
  instance.interceptors.request.use(config=>{
    return config
  }, err=>{
    console.log(err)
  })
  // 响应拦截
  instance.interceptors.response.use(res=>{
    return res.data
  }, err=>{
    console.log(err)
  })
  // 返回
  return instance(config)
}
