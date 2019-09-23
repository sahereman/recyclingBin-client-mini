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
    url: 'bins?page=' + requestData.page,
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
// 扫码开箱
export function scanSuccess(requestData) {
  return request({
    url: 'bins/qrLogin',
    method: "PUT",
    header: {
      Authorization: requestData.token
    },
    data: {
      token: requestData.resultToken,
    }
  })
}

// 判读投递是否成功
export function checkscanSuccess(requestData) {
  return request({
    url: 'bins/orderCheck/' + requestData.token_id,
    method: "GET",
    header: {
      Authorization: requestData.token
    },
    showloading:1
  })
}

// 获取订单详情
export function getOrderDetail(requestData) {
  return request({
    url: 'orders/' + requestData.order_id,
    method: "GET",
    header: {
      Authorization: requestData.token
    }
  })
}
