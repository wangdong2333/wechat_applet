// pages/science/science.js
let constUrl = require("../../utils/const.js");
let utils = require("../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 页面写的是静态的死数据，后期可能需要进行更新
    scienceMenu: [
      {
        name: "养生保健",
        id: 100,
        content: "健康速递 养生保健",
        pic: "../../images/express.png"
      },
      {
        name: "营养科普",
        id: 105,
        content: "营养科普 养生饮食",
        pic: "../../images/nutrition.png"
      },
      {
        name: "养老观察",
        id: 102,
        content: "人群养生 养老观察",
        pic: "../../images/people.png"
      },
      {
        name: "运动常识",
        id: 109,
        content: "运动常识 有氧瑜伽",
        pic: "../../images/sport.png"
      },
      {
        name: "心灵氧吧",
        id: 108,
        content: "心里百科 心灵氧吧",
        pic: "../../images/nutrition.png"
      },
      {
        name: "疾病科普",
        id: 101,
        content: "体质养生 中医两性",
        pic: "../../images/medicine.png"
      }

    ]
  },

  showScienceList(e){
    wx.navigateTo({
      url: './science-list/science-list?' + utils.default.dealQuery(e.currentTarget.dataset),
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