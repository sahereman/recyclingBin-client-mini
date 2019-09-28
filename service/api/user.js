// 用户相关
import request from '../network.js'
import { TOKEN } from '../../common/const.js'
import { examineToken } from '../../util/util.js'

// 获取token
export function getToken(requestData) {
  return request({
    url: 'authorizations',
    method: "POST",
    data: {
      jsCode: requestData.code,
      iv: requestData.iv,
      encryptedData: requestData.encryptedData
    }
  })
} 
// 刷新token
export function updateToken(requestData,page) {
  return request({
    url: 'authorizations',
    method: "PUT",
    header: {
      Authorization: requestData
    }
  }).then(res => {
    const token = res.data.token_type + " " + res.data.access_token
    const validTime = res.data.expires_in
    wx.setStorageSync(TOKEN, token)
    examineToken(validTime)
    page.data.token = token;
    console.log("刷新了token")
    page._getData()
  }).catch(res => {
    wx.setStorageSync(TOKEN, "")
  })
} 
// 删除token
export function deleteToken(requestData) {
  return request({
    url: 'authorizations',
    method: "DELETE",
    header: {
      Authorization: requestData
    }
  })
} 
// 发送手机验证码
export function sendVerification(requestData) {
  console.log(requestData)
  return request({
    url: 'sms/verification',
    method: "POST",
    header: {
      Authorization: requestData.token
    },
    data: {
      phone: requestData.phone
    }
  })
} 
// 绑定手机号
export function bindPhone(requestData) {
  return request({
    url: 'users/bindPhone',
    method: "PUT",
    header: {
      Authorization: requestData.token
    },
    data: {
      phone: requestData.phone,
      verification_key: requestData.verification_key,
      verification_code: requestData.verification_code
    }
  })
}
// 获取用户信息
export function userInfoShow(requestData) {
  return request({
    url: 'users/show',
    method: "GET",
    header: {
      Authorization: requestData.token
    },
  })
}
// 获取金钱账单列表
export function getBillList(requestData) {
  return request({
    url: 'users/moneyBill?page=' + requestData.page,
    method: "GET",
    header: {
      Authorization: requestData.token
    },
    data:{
      type: requestData.type,
      date: requestData.date
    }
  })
}
// 用户银联提现
export function withdrawal(requestData) {
  return request({
    url: 'users/withdraw/unionPay',
    method: "POST",
    header: {
      Authorization: requestData.token
    },
    data: {
      name: requestData.name,
      bank: requestData.bank,
      account: requestData.account,
      money: requestData.money,
      bank_name: requestData.bank_name
    }
  })
}
// 用户实名认证
export function realAuthentication(requestData) {
  return request({
    url: 'users/real_authentication',
    method: "PUT",
    header: {
      Authorization: requestData.token
    },
    data: {
      real_name: requestData.real_name,
      real_id: requestData.real_id
    }
  })
}

// 获取消息提醒列表
export function getMessageData(requestData) {
  return request({
    url: 'users/notifications?page=' + requestData.page,
    method: "GET",
    header: {
      Authorization: requestData.token
    }
  })
}