// 公用方法
import { TOKEN,VALIDTIME } from '../common/const.js'
import { updateToken } from '../service/api/user.js'

// 保存token的有效期
export function examineToken(time) {
  let timestamp = Date.parse(new Date());
  timestamp = timestamp / 1000;
  let overtime_timetamp = timestamp + time;
  wx.setStorageSync(VALIDTIME, overtime_timetamp)
}
// 判断token是否失效
export function isTokenFailure(){
  const token = wx.getStorageSync(TOKEN);
  let tokenIsvalid = false;
  if (token && token.length != 0) {
    // 验证token是否过期
    const validTime = wx.getStorageSync(VALIDTIME)
    let timestamp = Date.parse(new Date()) / 1000;
    if (timestamp >= validTime) {
      // 如果超时则获取新的token
      // updateToken(token)
      tokenIsvalid = false;
    }else {
      tokenIsvalid = true
    }
  }else {
    tokenIsvalid = false;
  }
  return tokenIsvalid
}
// 字符串显示****号
export function sub(str, startLength, endLength) {
  if (str.length == 0 || str == undefined) {
    return "";
  }
  let length = str.length;
  if (length >= startLength + endLength) {
    return str.substring(0, startLength) + "****" + str.substring(length - endLength, length);
  } else {
    return str;
  }
}