// pages/home/home/home-detail.js
let constUrl = require("../../../utils/const.js");
let utils = require("../../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    menuHomeList: [],
    homeListInfor: {
      // 请求的数据开始的位置
      start: 0,
      // 请求的数据的条数
      num: 10
    }
  },

  // 点击每日推荐显示详情页面
  showDetail(e) {
    // console.log(e.currentTarget);
    wx.navigateTo({
      url: './home-detail/home-detail?' + utils.default.dealQuery(e.currentTarget.dataset),
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.showLoading({
      title: '加载中',
    })
    // console.log(options);
    wx.setNavigationBarTitle({
      title: options.name,
    })
    // 处理一下请求数据的接口
    Object.assign(this.data.homeListInfor, {
      classid: options.classid
    });
    this.setData({
      homeListInfor: this.data.homeListInfor
    });

    let that = this;

    const db = wx.cloud.database();
    const foodList = db.collection('food-list');

    if ((!options.classid) || options.keyword) {
      console.log("关键字请求数据");

      // 根据食物的关键字搜索数据库，
      // 如果返回的数据条数大于十条，则请求的数据不添加数据库，
      // 反之添加到数据库

      // 实现模糊查询
      foodList.where({
        name: db.RegExp({
          regexp: "[a-zA-Z0-9]*" + options.keyword + "[a-zA-Z0-9]*",
          options: 'i'
        })
      }).limit(12).get().then((res) => {
        // 从接口请求数据，并添加到数据库
        if (!res.data.length) {
          let homeListUrl = constUrl.default.searchUrl + utils.default.dealQuery(Object.assign({
            // 使用默认的num, 没取到
            num: options.num,
            keyword: options.keyword
          }, {
            appkey: constUrl.default.menuAppkey
          }));
          // 请求数据
          utils.default.requestData(homeListUrl).then((res) => {
            console.log("接口请求的数据");
            console.log(res.data.result.result.list);

            // 打包请求的数据
            let menuHomeList = [];
            res.data.result.result.list.forEach((item) => {
              let aRem = {};
              aRem.content = utils.default.deleWrap(item.content);
              aRem.id = parseInt(item.id);
              aRem.name = item.name;
              aRem.pic = item.pic;
              aRem.time = new Date().getTime();
              aRem.viewCount = 0;
              aRem.starCount = 0;
              aRem.shareCount = 0;
              aRem.classid = parseInt(item.classid);

              // 用于显示到页面上
              menuHomeList.push(aRem);

              // 把数据存入到数据库中
              foodList.add({
                data: aRem
              }).then((res) => {

                // 数据添加到数据库成功后的操作
                // console.log(res);
              }).catch(console.error);

            });
            // 更新数据
            that.setData({
              menuHomeList
            });
            wx.hideLoading();
          });

        } else {
          // 从数据库拿去数据（几率较小）
          // 更新数据
          that.setData({
            menuHomeList: res.data
          });
          wx.hideLoading();
        }
      });
    } else {
      console.log("非关键字请求数据");

      foodList.where({
        classid: parseInt(options.classid) //当前每日推荐的classid
      }).get().then((res) => {

        if (res.data[0]) {
          that.setData({
            menuHomeList: res.data
          });
          wx.hideLoading();
        } else {
          // 请求的url接口
          let homeListUrl = constUrl.default.recommendListUrl + utils.default.dealQuery(Object.assign(that.data.homeListInfor, {
            appkey: constUrl.default.menuAppkey
          }));

          // 请求数据
          utils.default.requestData(homeListUrl).then((res) => {

            let resultList = res.data.result.result.list;
            // 获取用户的openid  (***注意***)： 这里其实不需要加上唯一标识用户的openid
            utils.default.getOpenId().then((res) => {
              let openId = res.result.OPENID;

              // 打包请求的数据
              let menuHomeList = [];
              resultList.forEach((item) => {
                let aRem = {};
                aRem.content = utils.default.deleWrap(item.content);
                aRem.id = item.id;
                aRem.name = item.name;
                aRem.pic = item.pic;
                aRem.time = new Date().getTime();
                aRem.viewCount = 0;
                aRem.starCount = 0;
                aRem.shareCount = 0;
                aRem.classid = item.classid;
                // 同时把数据显示到页面上面
                menuHomeList.push(aRem);
                // 把数据存入到数据库中
                foodList.add({
                  data: aRem
                }).then((res) => {
                  // 进行一些插入数据库成功的操作
                  // console.log(res);
                }).catch(console.error);

              });
              // 更新数据
              that.setData({
                menuHomeList
              });
              wx.hideLoading();
              console.log(menuHomeList);
            });
          });
        }

      })
    }

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