// pages/science/science-list/science-detail/science-detail.js
let constUrl = require("../../../../utils/const.js");
let utils = require("../../../../utils/util.js");

let WxParse = require('../../../../wxParse/wxParse.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    scienceDetail: {}
  },

  share() {
    wx.showShareMenu({
      withShareTicket: true
    })
    wx.showToast({
      title: '亲，分享成功',
    })
  },

  collection() {
    let openId;
    wx.showToast({
      title: '亲，收藏成功',
    })
    utils.default.getOpenId().then((res) => {
      openId = res.result.OPENID;

      // 在这个位置
      // 把数据存入数据库
      const db = wx.cloud.database();
      const scienceCollection = db.collection('collection_science');

      scienceCollection.add({
        data: {
          openId: openId,
          scienceId: this.data.scienceDetail.id,
          time: new Date().getTime(),
          title: this.data.scienceDetail.title
        }
      }).then((res) => {
        console.log(res);
      }).catch(console.error);
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.showLoading({
      title: '加载中',
    })
    let id = options.id;
    // console.log(id);
    this.setData({
      scienceId: id
    });
    let that = this;

    wx.getStorage({
      key: 'scienceDetail' + id,
      // 使用缓存会出错， 在此不使用缓存，后期再想办法解决问题
      complete() {
        // 请求数据
        wx.request({
          url: 'https://wxapi.hotapp.cn/proxy/?appkey=hotapp669046474&url=http://route.showapi.com/90-88',
          data: {
            showapi_timestamp: utils.default.formatterDateTime(),
            showapi_appid: constUrl.default.showapi_appid,
            showapi_sign: constUrl.default.showapi_sign,
            id: id
          },
          success(res) {
            let data = res.data.showapi_res_body.item;

            // html字符串解析为html文档
            WxParse.wxParse('article', 'html', data.content, that, 10);
            wx.hideLoading();

            // 设置缓存数据
            utils.default.setStorage('scienceDetail' + id, data);

            that.setData({
              scienceDetail: data
            });
            wx.hideLoading();
          }
        })
      }
    })

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