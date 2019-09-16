import {
  baseURL
} from './config.js'

// 数据请求封装
export default function request(options) {
  return new Promise((resolve,reject) => {
    wx: wx.request({
      url: baseURL + options.url,
      data: options.data || {},
      header: options.header || {},
      method: options.method || 'GET',
      dataType: options.dataType || 'json',
      responseType: options.responseType || 'text',
      success: resolve,
      fail: reject,
      complete: function (res) { },
    })
  })
}