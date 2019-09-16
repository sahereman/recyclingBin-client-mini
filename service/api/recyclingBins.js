// 回收箱相关
import request from '../network.js'

// 获取距离最近的回收箱
export function getNearbyBin(requestData) {
  return request({
    url: 'bins/nearby',
    method: "GET",
    header: {
      Authorization: requestData.token
    },
    data: {
      lat: requestData.lat,
      lng: requestData.lng
    }
  })
} 
// 获取回收箱列表
export function getBinLists(requestData) {
  return request({
    url: 'bins',
    method: "GET",
    header: {
      Authorization: requestData.token
    },
    data: {
      lat: requestData.lat,
      lng: requestData.lng
    }
  })
} 