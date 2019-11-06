// pages/show/show-comment/show-comment.js
const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    author: "",
    img: "",
    showId: "",
    commentLists: [],
    commentCount: 0
  },

  formSubmit(e) {
    let that = this;
    let content = e.detail.value.commentContent;
    this.setData({
      commentContent: content
    });


    db.collection("comment-list").add({
      data: {
        time: new Date().getTime(),
        commentContent: content,
        authorImg: that.data.img,
        author: that.data.author,
        showId: that.data.showId
      }
    }).then((res) => {
      wx.showToast({
        title: '评论成功',
      })
      db.collection("comment-list").where({
        showId: that.data.showId
      }).limit(20).get().then((res) => {
        that.setData({
          commentLists: res.data
        });
      });
      that.setData({
        commentContent: ""
      });

      // 更新云端数据
      wx.cloud.callFunction({
        name: "getCommentData",
        data: {
          showid: that.data.showId,
          commentcount: that.data.commentCount + 1,
          databasename: "publish-list"
        }
      }).then((res) => {
        // console.log(res);
      });

    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // console.log(options);
    wx.showLoading({
      title: '加载中',
    })
    let that = this;
    // 查看是否授权
    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            success(res) {
              that.setData({
                img: res.userInfo.avatarUrl,
                author: res.userInfo.nickName
              });
            }
          })
        }
      }
    })
    // 获取说说的唯一标识
    this.setData({
      showId: options.id,
      commentCount: parseInt(options.commentcount)
    });

    db.collection("comment-list").where({
      showId: options.id
    }).limit(20).get().then((res) => {
      that.setData({
        commentLists: res.data
      });
      wx.hideLoading();
    });
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