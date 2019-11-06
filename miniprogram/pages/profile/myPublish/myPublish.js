// pages/profile/myPublish/myPublish.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    myShowInfors: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options);
    wx.showLoading({
      title: '加载中',
    })
    const db = wx.cloud.database()
    db.collection('publish-list').where({
      _openid: options.openId  // 填入当前用户 openid
    }).orderBy('time', 'desc').limit(10).get().then(res => {
      this.setData({
        myShowInfors: res.data
      });
      wx.hideLoading();
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
  onShow: function () {

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

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})