// 订单相关相关
import request from '../network.js'

// 获取订单列表
export function getTopicCategories(requestData) {
  return request({
    url: 'orders?page=' + requestData.page,
    method: "GET",
    header: {
      Authorization: requestData.token
    }
  })
} 


//获取传统的订单
export function traditionOrder(requestData) {
  return request({
    url: 'box_orders?page=' + requestData.page,
    method: "GET",
    header: {
      Authorization: requestData.token
    }
  })
} 