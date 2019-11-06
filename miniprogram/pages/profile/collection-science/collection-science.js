// pages/profile/collection-science/collection-science.js
let constUrl = require("../../../utils/const.js");
let utils = require("../../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    scienceColletions: []
  },

  showScienceDetail(e) {
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../../science/science-list/science-detail/science-detail?' + utils.default.dealQuery({ id }),
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中',
    })
    const db = wx.cloud.database();
    db.collection("collection_science").where({
      _openid: options.openId // 填入当前用户 openid
    }).get().then((res) => {
      this.setData({
        scienceColletions: res.data
      });
      wx.hideLoading();
    });
    
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