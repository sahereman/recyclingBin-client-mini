import { scanSuccess } from '../../../../service/api/recyclingBins.js'
import { TOKEN } from '../../../../common/const.js'
import { isTokenFailure } from '../../../../util/util.js'
import { updateToken } from '../../../../service/api/user.js'
//获取应用实例
const app = getApp()
Component({
  properties: {
    comToken: {
      type: String,
      value: ''
    }
  },
  data: {

  },
  methods: {
    // 调用相机扫描二维码
    getScanCode(e) {
      const that = this;
      wx.scanCode({
        onlyFromCamera: true,
        success(res) {
          if (res.result){
            const token = wx.getStorageSync(TOKEN);
            if (isTokenFailure()) {
              // token有效
              that.data.token = token;
            } else {
              // token无效
              if (token && token.length != 0) {
                // 当token存在只需要进行更新
                // 刷新token
                updateToken(token, that);
              } else {
                // token不存在需用户重新登录
                app.login()
              }
            }
            const requestData = {
              token: token,
              resultToken: res.result.split("?")[1].split('=')[1]
            }
            scanSuccess(requestData).then(res => {
              wx.navigateTo({
                url: '../deliver/deliver',
                success: function (rel) {
                  // 通过eventChannel向被打开页面传送数据
                  rel.eventChannel.emit('acceptDataFromOpenerPage', { data: res.data.id })
                },

              })
              
            }).catch(res => {
              console.log(res)
            })
            
          }
        }
      })
    },
    // 跳转到分类页面
    categroiesShow(e){
      console.log("进入分类页面")
      wx.navigateTo({
        url: '../categroies/categroies',
        events: {
          // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
          acceptDataFromOpenedPage: function (data) {
            console.log(data)
          },
          someEvent: function (data) {
            console.log(data)
          }
        },
        success: function (res) {
          // 通过eventChannel向被打开页面传送数据
          res.eventChannel.emit('acceptDataFromOpenerPage', { data: 'test' })
        }
      })
    },
    // 跳转到投递指南页面
    deliveryGuideShow(){
      console.log("进入投递指南页面")
      wx.navigateTo({
        url: '../deliveryGuide/deliveryGuide',
        events: {
          // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
          acceptDataFromOpenedPage: function (data) {
            console.log(data)
          },
          someEvent: function (data) {
            console.log(data)
          }
        },
        success: function (res) {
          // 通过eventChannel向被打开页面传送数据
          res.eventChannel.emit('acceptDataFromOpenerPage', { data: 'test' })
        }
      })
    }
  }
})
