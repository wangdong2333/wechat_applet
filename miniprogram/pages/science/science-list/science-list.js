// pages/science-detail/science-detail.js
let constUrl = require("../../../utils/const.js");
let utils = require("../../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    scienceList: [],
    title: "健康养生"
  },

  showScienceDetail(e){
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: './science-detail/science-detail?'+utils.default.dealQuery({id}),
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.showLoading({
      title: '加载中',
    })
    let that=this;
    let id=options.id;
    this.setData({
      title: options.title
    });

    // 养身百科首页推荐列表数据
    wx.getStorage({
      key: 'scienceList'+id,
      success: (res) => {
        this.setData({
          scienceList: res.data
        })
        // console.log(res.data);
        wx.hideLoading();
      },
      fail() {
        // 科普分类的url
        // 请求数据
        wx.request({
          url: constUrl.default.scienceListUrl,
          data: {
            showapi_timestamp: utils.default.formatterDateTime(),
            showapi_appid: constUrl.default.showapi_appid,
            showapi_sign: constUrl.default.showapi_sign,
            "tid": id,
            "key": "",
            "page": ""
          },
          success(res) {
            let contentlist = res.data.showapi_res_body.pagebean.contentlist;

            let arr = contentlist.map((obj) => {
              return {
                id: obj.id,
                title: obj.title,
                tid: obj.tid,
                site: obj.url
              }
            });
            // 设置缓存数据
            utils.default.setStorage('scienceList'+id, arr);
            that.setData({
              scienceList: arr
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