// pages/show/show.js
let constUrl = require("../../utils/const.js");
let utils = require("../../utils/util.js");

const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showInfors: [],
    img: "",
    author: "",
    openId: ""
  },

  // 图片预览并下载功能
  previewImg(e) {
    wx.previewImage({
      current: e.currentTarget.dataset.currentimg,
      urls: e.currentTarget.dataset.imgs
    })
  },

  addShare(e) {
    let that = this;
    let shareInfor = e.currentTarget.dataset;

    // 此时调用云函数更改数据库
    wx.cloud.callFunction({
      name: "getShareData",
      data: {
        showid: shareInfor.id,
        sharecount: shareInfor.sharecount + 1,
        databasename: "publish-list"
      }
    }).then((res) => {
      db.collection('publish-list').where({}).orderBy('time', 'desc').limit(20).get().then(res => {
        that.setData({
          showInfors: res.data
        });
      })
    });

  },

  addGood(e) {
    let that = this;
    let goodInfor = e.currentTarget.dataset;

    // 首先获取用户是否已经点赞的信息，
    // 然后再进行操作

    db.collection('show-goodinfor').where({
      _openid: that.data.openId, // 填入当前用户 openid
      showId: goodInfor.id
    }).get().then(res => {

      let data = res.data;
      // 如果此条数据用户没有点过赞
      // length=0说明用户没有点过赞，不等于0说明点过赞

      // 此时length=0；
      if (!data.length) {
        db.collection('show-goodinfor').add({
            data: {
              showId: goodInfor.id,
              isGood: true
            }
          })
          .then(res => {
            wx.showToast({
              title: '点赞成功'
            })
            // 此时调用云函数更改数据库
            wx.cloud.callFunction({
              name: "getShowData",
              data: {
                showid: goodInfor.id,
                goodcount: goodInfor.goodcount + 1,
                databasename: "publish-list"
              }
            }).then((res) => {
              db.collection('publish-list').where({}).orderBy('time', 'desc').limit(20).get().then(res => {
                that.setData({
                  showInfors: res.data
                });
              })
            });
          })
          .catch(console.error)
      } else if (!data[0].isGood) {
        // 获取这条点赞的唯一表述
        let goodId = data[0]._id;

        // 此时length不等于0， 用户已经点过赞，可能被取消了
        // 更新数据库的这条数据， 不需要创建新的记录了
        db.collection('show-goodinfor').doc(goodId).update({
            data: {
              isGood: true
            }
          })
          .then(() => {
            wx.showToast({
              title: '点赞成功'
            })
            // 调用云函数更细数据库
            wx.cloud.callFunction({
              name: "getShowData",
              data: {
                showid: goodInfor.id,
                goodcount: goodInfor.goodcount + 1,
                databasename: "publish-list"
              }
            }).then((res) => {
              db.collection('publish-list').where({}).orderBy('time', 'desc').limit(20).get().then(res => {
                that.setData({
                  showInfors: res.data
                });
              })
            });

          })
          .catch(console.error)

      } else {
        // 获取这条点赞的唯一表述
        let goodId = data[0]._id;

        // 用户已经点过赞了，此时想取消点赞
        // 也是要更新这条数据，不需要重新创建新的纪录了
        db.collection('show-goodinfor').doc(goodId).update({
            data: {
              isGood: false
            }
          })
          .then(() => {
            wx.showToast({
              title: '取消点赞'
            })
            // 调用云函数更新数据库
            wx.cloud.callFunction({
              name: "getShowData",
              data: {
                showid: goodInfor.id,
                goodcount: goodInfor.goodcount - 1,
                databasename: "publish-list"
              }
            }).then((res) => {
              db.collection('publish-list').where({}).orderBy('time', 'desc').limit(20).get().then(res => {
                that.setData({
                  showInfors: res.data
                });
              })
            });
          })
          .catch(console.error)
      }

    })

  },

  showComment(e) {
    console.log(e.currentTarget);
    Object.assign(e.currentTarget.dataset, {
      img: this.data.img,
      author: this.data.author
    });
    let query = utils.default.dealQuery(e.currentTarget.dataset);

    wx.navigateTo({
      url: './show-comment/show-comment?' + query
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this;

    wx.showLoading({
      title: '加载中',
    })
    // 获取用户的openID
    utils.default.getOpenId().then((res) => {
      that.setData({
        openId: res.result.OPENID
      });
    });

    // 加载showlist页面信息
    db.collection('publish-list').where({}).orderBy('time', 'desc').limit(20).get().then(res => {
      that.setData({
        showInfors: res.data
      });
      wx.hideLoading();
    })

    // 查看是否授权
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.userInfo']) {
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
    let that = this;
    // 获取用户的openID
    utils.default.getOpenId().then((res) => {
      that.setData({
        openId: res.result.OPENID
      });
    });

    // 加载showlist页面信息
    db.collection('publish-list').where({}).orderBy('time', 'desc').limit(20).get().then(res => {
      that.setData({
        showInfors: res.data
      });
    })

    // 查看是否授权
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.userInfo']) {
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