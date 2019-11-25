// pages/aboutUs/aboutUs.js
import { TOKEN, USERINFO, BOXNUMBER } from '../../common/const.js'
import { updateToken } from '../../service/api/user.js'
import { isTokenFailure, forbiddenReLaunch } from '../../util/util.js'
import { getProfits, deliveryBox, upLoadImg } from '../../service/api/recyclingBins.js'
import { baseURL } from '../../service/config.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    token:'',
    showImg: '',
    isFinished: false,
    box_order_profit_day:0,
    box_order_profit_money: 0,
    box_order_profit_number: 0,
    box_no:'',
    image_proof:null,
    timer:null//延时器
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    const box_no = wx.getStorageSync(BOXNUMBER);
    that.setData({
      box_no: box_no
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function (options) {
    const token = wx.getStorageSync(TOKEN);
    if (isTokenFailure()) {
      // token有效
      this.data.token = token;
      this._getData()
    } else {
      // token无效
      if (token && token.length != 0) {
        // 当token存在只需要进行更新
        // 刷新token
        updateToken(token, this);
      } else {
        // token不存在需用户重新登录
        wx.reLaunch({
          url: '../../pages/login/login'
        })
      }
    }
  },
  _getData:function(){
    this.getInitData();
  },
  getInitData:function(){
    var that = this;
    getProfits().then(res => {
      wx.stopPullDownRefresh();
      if (res.statusCode == 403) {
        forbiddenReLaunch();
        return;
      }
      that.setData({
        box_order_profit_day: res.data.box_order_profit_day,
        box_order_profit_money: res.data.box_order_profit_money,
        box_order_profit_number: res.data.box_order_profit_number
      })
      
    }).catch(res => {
      console.log(res)
      
    })
  },
  deliveryGoods: function () {//上传并投递
    var that = this;
    wx.uploadFile({
      url: baseURL + 'upload/image', //仅为示例，非真实的接口地址
      filePath: that.data.showImg,
      name: 'file',
      header: {
        Authorization: that.data.token
      },
      success(respnse) {
        if (respnse.statusCode == 200){
          var image_proof = JSON.parse(respnse.data).path;
          var box_no = wx.getStorageSync(BOXNUMBER);
          var param = {
            token: that.data.token,
            box_no: box_no,
            image_proof: image_proof
          }
          that.data.timer = setTimeout(function () {
            deliveryBox(param).then(res => {
              wx.stopPullDownRefresh();
              if (res.statusCode == 403) {
                forbiddenReLaunch();
                return;
              }
              if (res.statusCode == 200) {
                wx.showToast({
                  title: '投递成功',
                  icon: 'success',
                  duration: 2000
                })
                that.setData({
                  isFinished: true
                })
              } else {
                console.log(res);
                wx.showToast({
                  title: res.data.errors.box_no[0],
                  icon: 'none',
                  duration:3000
                })
              }

            }).catch(res => {
              console.log(res)

            })
            clearTimeout(that.data.timer);
          }, 100);
          
        }else{
          wx.showToast({
            title: "上传失败，请重新上传",
            icon: 'none',
            duration: 3000
          })
        }
      }
    })
    
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    this.setData({
      isFinished:false
    })
    clearTimeout(this.data.timer);
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {
    wx.stopPullDownRefresh();
  },
  takePicture: function () { //展开
    var that = this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['camera'], // 可以指定来源是相册还是相机，默认二者都有 'album', 
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths;
        if (wx.compressImage) {
          wx.compressImage({
            src: tempFilePaths[0], // 图片路径
            quality: 60, // 压缩质量
            success: function (response) {
              console.log(response)
              that.setData({
                showImg: response.tempFilePath
              })
            }
          })
        } else {
          that.setData({
            showImg: tempFilePaths[0]
          })
        }
      },
      fail: function (res) {
        console.log(res.errMsg)
      }
    })
  },
  delImg: function () {//删除照片
    this.setData({
      showImg: ''
    })
  }
})