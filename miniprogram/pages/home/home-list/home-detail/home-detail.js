// pages/home/home-list/home-detail/home-detail.js
let constUrl = require("../../../../utils/const.js");
let utils = require("../../../../utils/util.js");
const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detailInfor: {},
    foodId: '',
    pic: "",
    title: "",
    content: "",
    // 唯一标识的数据库的id, 这个id更加安全一点
    id: "",

    viewCount: 0,
    starCount: 0,
    shareCount: 0,
    imgs: []
  },

  // 图片预览并下载功能
  previewImg(e) {
    wx.previewImage({
      current: e.currentTarget.dataset.pic,
      urls: this.data.imgs
    })
  },


  // 注意在这个位置还需要更新home页面foodList数据库的列表数据

  collection() {
    let that = this;
    // 解决如何判断是否是已经收藏过了
    db.collection('collection_food')
      .where({
        foodId: that.data.foodId, // 填入当前食品的foodID
      })
      .limit(1)
      .get()
      .then(res => {
        //返回数据的长度如果大于0，说明已经收藏了
        if (!res.data.length) {
          wx.showToast({
            title: '亲，收藏成功啦',
          })
          // 此时调用云函数更改数据库
          wx.cloud.callFunction({
            name: "getStarCountData",
            data: {
              showid: that.data.id,
              starcount: parseInt(that.data.starCount) + 1,
              databasename: "food-list"
            }
          }).then((res) => {
            let openId;
            utils.default.getOpenId().then((res) => {
              // 获取openID
              openId = res.result.OPENID;
              // 把数据存入存储收藏数据数据库
              const foodCollection = db.collection('collection_food');

              foodCollection.add({
                data: {
                  openId: openId,
                  foodId: that.data.foodId,
                  viewCount: that.data.viewCount,
                  starCount: parseInt(that.data.starCount) + 1,
                  shareCount: parseInt(that.data.shareCount) + 1,
                  time: new Date().getTime(),
                  imgUrl: that.data.pic,
                  title: that.data.name,
                  content: utils.default.deleWrap1(that.data.content)
                }
              }).then((res) => {
                // 更新是否收藏状态数据
                that.data.starCount = parseInt(that.data.starCount) + 1;
                that.setData({
                  starCount: that.data.starCount
                });
                // wx.showToast({
                //   title: '亲，收藏成功啦',
                // })

              }).catch(console.error);
            })
          });
        } else {
          wx.showToast({
            title: '亲，已经收藏了哦',
          })
        }
      })
      .catch(err => {
        console.error(err)
      })

  },

  // 注意在这个位置还需要更新home页面foodList数据库的列表数据

  share() {
    let that = this;
    wx.showShareMenu({
      withShareTicket: true
    })
    // 更新分享的状态数据
    this.data.shareCount = parseInt(this.data.shareCount) + 1;
    this.setData({
      shareCount: this.data.shareCount
    });

    // 此时调用云函数更改数据库
    wx.cloud.callFunction({
      name: "getShareData",
      data: {
        showid: that.data.id,
        sharecount: that.data.shareCount + 1,
        databasename: "food-list"
      }
    }).then((res) => {
      // console.log(res);
      wx.showToast({
        title: '亲 ，分享成功啦',
      })
    });

  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options);
    let that = this;

    that.setData({
      viewCount: options.viewcount,
      starCount: options.starcount
    });
    wx.setNavigationBarTitle({
      title: options.name
    })

    // 获取当前数据的唯一标识 (并且在其成功的回调函数后加上更新浏览状态)
    db.collection('food-list')
      .where({
        id: parseInt(options.classid) // 填入当前食品的id
      })
      .limit(1) // 限制返回数量为 1 条
      .get()
      .then(res => {
        that.setData({
          id: res.data[0]._id
        });

        // 浏览数的更新
        that.setData({
          viewCount: parseInt(that.data.viewCount) + 1
        });
        // 此时调用云函数更改数据库
        wx.cloud.callFunction({
          name: "getViewCountData",
          data: {
            showid: that.data.id,
            viewcount: parseInt(that.data.viewCount),
            databasename: "food-list"
          }
        }).then((res) => {
          // console.log(res);
        });
      })
      .catch(err => {
        console.error(err)
      })


    wx.showLoading({
      title: '加载中',
    })
    // 请求详情列表数据
    wx.getStorage({
      key: "detailInfor" + options.classid,
      success: function(res) {
        that.setData({
          detailInfor: res.data,
          foodId: res.data.id,
          pic: res.data.pic,
          title: res.data.name,
          content: utils.default.deleWrap1(res.data.content)
        });

        // console.log(that.data.content);
        // 详情图片预览
        let arr = res.data.process.map((item, index) => {
          return item.pic;
        });
        that.setData({
          imgs: arr
        });
        wx.hideLoading();
      },
      fail() {
        let menuDetailUrl = constUrl.default.menuDetailUrl + utils.default.dealQuery(Object.assign({
          id: options.classid
        }, {
          appkey: constUrl.default.menuAppkey
        }));

        // 请求数据
        utils.default.requestData(menuDetailUrl).then((res) => {

          let data = res.data.result.result;
          // 把数据存储在缓存中
          utils.default.setStorage("detailInfor" + options.classid, data);
          // 更新数据
          that.setData({
            detailInfor: data,
            foodId: data.id,
            pic: data.pic,
            title: data.name,
            content: utils.default.deleWrap1(data.content)
          });
          // 详情图片预览
          let arr = data.process.map((item, index) => {
            return item.pic;
          });
          that.setData({
            imgs: arr
          });
          wx.hideLoading();
        });

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