import { TOKEN, BOXNUMBER } from '../../common/const.js'
import { isTokenFailure,forbiddenReLaunch } from '../../util/util.js'
import { updateToken } from '../../service/api/user.js'
import { scanSuccess } from '../../service/api/recyclingBins.js'
Page({
  data: {
    code_url:'',
    token:'',
    codename:'',
    num:''
  },
  onLoad: function (options) {
    console.log(options);
    var codename = '';
    var num = '';
     if (options.codename){
      codename = options.codename;
      num = options.num;
    } else{
      codename = decodeURIComponent(options.q).split("?")[1].split('=')[0];
      num = decodeURIComponent(options.q).split("?")[1].split('=')[1];
    }
    
    this.setData({
      codename: codename,
      num: num
    })
    
  },
  onShow:function(){
    var that = this;
    const token = wx.getStorageSync(TOKEN);
    if (isTokenFailure()) {
      // token有效
      that.data.token = token;
      that._getData();
    } else {
      // token无效
      if (token && token.length != 0) {
        // 当token存在只需要进行更新
        // 刷新token
        updateToken(token, that);
      } else {
        // token不存在需用户重新登录
        console.log("未登录");
        wx.reLaunch({
          url: '../../pages/login/login?codename=' + that.data.codename + '&num=' + that.data.num
        })
      }
    }
  },
  // 网络请求
  _getData(){
    var that = this;
    var codename = that.data.codename;
    var num = that.data.num;
    const token = wx.getStorageSync(TOKEN);
    if (codename == 'token'){
      const requestData = {
        token: token,
        resultToken: num
      }
      scanSuccess(requestData).then(res => {
        if (res.statusCode == 403) {
          forbiddenReLaunch();
          return;
        }else if (res.statusCode == 422) {
          wx.showModal({
            content: res.data.errors.token[0],
            confirmText: '确定',
            showCancel:false,
            success(res) {
              if (res.confirm) {
                wx.reLaunch({
                  url: '../index/index'
                })
              } 
            }
          })
        } else if(res.statusCode == 200){
          wx.reLaunch({
            url: '../deliver/deliver?id=' + res.data.id
          })
        }
      }).catch(res => {
        console.log(res)
      })
    } else if (codename == 'box_no'){
      wx.setStorage({
        key: BOXNUMBER,
        data: num
      })
      wx.reLaunch({
        url: '../keepImg/keepImg',
      })
    }
  }
})