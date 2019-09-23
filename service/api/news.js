// 话题相关
import request from '../network.js'

// 获取话题分类
export function getTopicCategories(requestData) {
  return request({
    url: 'topic_categories',
    method: "GET",
    header: {
      Authorization: requestData
    }
  })
} 
// 获取话题列表
export function getTopicLists(requestData) {
  return request({
    url: 'topic_categories/' + requestData.category_id,
    method: "GET",
    header: {
      Authorization: requestData.token
    }
  })
} 
// 获取话题详情
export function getTopicDetails(requestData) {
  return request({
    url: 'topics/' + requestData.topic_id,
    method: "GET",
    header: {
      Authorization: requestData.token
    }
  })
}