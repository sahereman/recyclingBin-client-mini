// banner图相关
import request from '../network.js'

// 获取banner图列表
export function getBanners(requestData) {
  return request({
    url: 'banners/' + requestData.pageName,
    method: "GET",
  })
} 