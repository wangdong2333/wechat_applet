// pages/photo/photo.js
let constUrl = require("../../utils/const.js");
let utils = require("../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  distinguishPhoto() {
    let that = this;
    wx.chooseImage({
      success: res => {
        wx.getFileSystemManager().readFile({
          filePath: res.tempFilePaths[0], //选择图片返回的相对路径
          encoding: 'base64', //编码格式
          success: res => { //成功的回调

            // 测试传图识别菜品的接口
            // 6.10
            // 24.2bb1e3f841e17fe5a43aa54ddacc3f58.2592000.1562743815.282335-16271897
            wx.request({
              url: 'https://aip.baidubce.com/rest/2.0/image-classify/v2/dish?access_token=24.2bb1e3f841e17fe5a43aa54ddacc3f58.2592000.1562743815.282335-16271897',
              method: "POST",
              data: {
                image: res.data,
                filter_threshold: 0.95
              },
              header: {
                'content-type': 'application/x-www-form-urlencoded' // 默认值
              },
              success(res) {
                if (res.data.length != 0) {
                  wx.navigateTo({
                    url: '../home/home-list/home-list?' + utils.default.dealQuery(Object.assign({num: 10}, {
                      keyword: res.data.result[0].name
                    }))
                  })
                } else {
                  wx.showToast({
                    title: '暂无数据，亲换一个吧',
                  })
                }
              }
            })

          }
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})