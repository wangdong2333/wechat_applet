const db = wx.cloud.database();
// pages/publish/publish.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgs: [],
    content: "",
    avatarUrl: "",
    nickName: "",
    city: "",
    district: ""
  },

  addImg() {
    let that = this;
    wx.chooseImage({
      count: 9,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths
        that.setData({
          imgs: tempFilePaths
        });
      }
    })

  },

  // 发表的时候缺少地理位置

  formSubmit(e) {
    if (e.detail.value.content) {
      let promiseArr = [];
      this.data.imgs.forEach((item) => {
        promiseArr.push(new Promise((resolve, reject) => {
          // 每次只能上传到云存储中一张图片
          wx.showLoading();
          wx.cloud.uploadFile({
            cloudPath: new Date().getTime() + ".png",
            filePath: item,
          }).then((res) => {
            resolve(res.fileID);
          }).catch(error => {
            console.log(error);
            reject();
          });
        }));
      });

      Promise.all(promiseArr).then((res) => {
        // console.log(res); // 返回的是图片地址数组
        wx.hideLoading();

        db.collection('publish-list').add({
            data: {
              content: e.detail.value,
              // 把云存储里面图片的地址存到数据库中
              imgs: res,
              time: new Date().getTime(),
              goodCount: 0,
              commentCount: 0,
              shareCount: 0,
              position: this.data.city + "  " + this.data.district,
              author: this.data.nickName,
              authorImg: this.data.avatarUrl
            }
          })
          .then(res => {
            // console.log(res)
            wx.showToast({
              title: '发表成功'
            })

            // 设置300毫秒以后跳转页面，并且清空页面内容
            setTimeout(() => {
              wx.switchTab({
                url: '../show/show',
              })
              this.setData({
                imgs: [],
                content: ""
              });
            }, 300);
          })
          .catch((res)=>{
            console.log(res);
          })
      });
    } else {
      wx.showToast({
        title: '亲，写点什么吧'
      })
    }

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this;
    // 查看是否授权
    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            success(res) {
              that.setData({
                avatarUrl: res.userInfo.avatarUrl,
                nickName: res.userInfo.nickName
              });
            }
          })
        }
      }
    })

    // 引入SDK核心类
    let QQMapWX = require('../../utils/qqmap-wx-jssdk.js');
    // 实例化API核心类
    let qqmapsdk = new QQMapWX({
      key: 'QBNBZ-JK5WD-ZEE4E-PPH62-6FPYT-V2BQV' //申请的开发者秘钥key
    })

    //小程序api获取当前坐标
    wx.getLocation({
      success: function(res) {

        // 调用sdk接口
        qqmapsdk.reverseGeocoder({
          location: {
            latitude: res.latitude,
            longitude: res.longitude
          },
          success: function(res) {
            //获取当前地址成功
            let result = res.result.address_component;
            that.setData({
              city: result.city,
              district: result.district
            });
          },
          fail: function(res) {
            console.log(res);
            console.log('获取当前地址失败');
          }
        });
      },
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