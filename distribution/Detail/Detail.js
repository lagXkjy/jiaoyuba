var app = getApp();
var common = require('../../Common.js');
const util = require('../../utils/util.js')
let page = 1,
  size = 20;
var WxParse = require('../../wxParse/wxParse.js');
var all;

Page({
  data: {
    url: common.config.CoursePath,
    XiaJia: true,
    JIangXIaoS: true,
    tu: {
      a: common.config.StaticPath + "tutututu.png",
      b: common.config.StaticPath + "jiao.jpg",
      c: common.config.StaticPath + "dingwei.jpg",
      d: common.config.StaticPath + "shouji.jpg",
      e: common.config.StaticPath + "de1.jpg",
      f: common.config.StaticPath + "de2.jpg"
    },
    didian: common.config.StaticPath + "Didian_03.png",
    shouji: common.config.StaticPath + "phone_03.png",
    xiajiatu: common.config.StaticPath + "XiaJia_03.png",
    hidden: true,
    dopenid: "",
    kid: "",
    imgHeight: "",
    shiping: "",
    agenInfo: {
      Id: 0
    },
    picPath: common.config.AgeLogoPicPath,
    notref: false
  },
  // 页面初次加载
  onLoad: function(res) {
    console.log(res);
    var that = this;
    all = res;
  },
  // 首页
  ShouYua: function() {
    wx.switchTab({
      url: '../../Kecheng/Home/Home',
    })
  },
  onShow: function() {
    var that = this
    wx.getSystemInfo({
      success: (res) => {
        let ww = res.windowWidth;
        let imgHeight = ww * 0.5;
        that.setData({
          imgHeight: imgHeight
        });
      }
    });
    var province = wx.getStorageSync("province");
    if (province == null || province == "") {
      common.dingwei();
    }
    console.log(all.openid == undefined)
    if (all.openid == undefined) {
      that.setData({
        JIangXIaoS: true,
      })
      this.Content(all.id, wx.getStorageSync('openid'))
    } else {
      console.log(123)
      that.setData({
        JIangXIaoS: false,
      })
      this.Content(all.id, all.openid)
      this.viewed(all.id, all.openid)
    }
  },
  // 浏览次数
  viewed: function(cid, openid) {
    var that = this
    common.GetOpenId(
      () => {
        var data = {
          name: wx.getStorageSync('nickName'),
          openid: wx.getStorageSync('openid'),
          dopenid: openid,
          cid: cid
        }
        wx.request({
          url: common.config.LiuLanCiShu,
          method: 'post',
          data: data,
          success: function(res) {
            console.log(res)
            console.log(data)
          },
        })
      }
    )

  },
  // 二维码
  ErWeiMa: function(res) {
    var dix = res.target.dataset.ma;
    wx.navigateTo({
      url: '../EWei/EWei?id=' + dix,
    })
  },
  // 去编辑
  QuBianJi: function(e) {
    wx.navigateTo({
      url: '../edit/edit?id=' + all.lid,
    })
  },
  // 分享
  onShareAppMessage: function(res) {
    var that = this;
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: that.data.list.modle.Title,
      path: '/distribution/Detail/Detail?id=' + all.id + '&openid=' + that.data.dopenid,
      success: function(res) {},
      fail: function(res) {
        // 转发失败
      }
    }
  },
  //加载数据
  Content: function(id, openid) {
    if (!this.data.notref) {
      common.addCorBrowTimes(id);
      this.setData({
        notref: true
      });
    }
    var that = this
    that.setData({
      hidden: false
    })
    wx.request({
      url: common.config.GetCourseAndGrop,
      method: 'post',
      data: {
        id: id,
        openid: openid,
        province: wx.getStorageSync('province'),
        city: wx.getStorageSync('city'),
        address: wx.getStorageSync('address'),
      },
      success: function(res) {
        console.log(res)
        if (res.data.modle.Status == 2) {
          WxParse.wxParse('article', 'html', res.data.modle.Description, that, 5);
          var img = res.data.imgs.split(",")
          console.log(img)
          var list = res.data;
          list.modle.RetailPrice = list.modle.RetailPrice.toFixed(2);
          list.modle.OriginalPrice = list.modle.OriginalPrice.toFixed(2);
          list.modle.GroupPrice = list.modle.GroupPrice.toFixed(2);
          that.setData({
            list: list,
            PicturePath: that.data.url + res.data.modle.PicturePath,
            imgUrls: img,
            XiaJia: true,
            dopenid: openid,
            kid: id,
            shiping: list.modle.VideoPath
          })
        } else if (res.data.modle.Status == 0) {
          that.setData({
            XiaJia: false,
            dopenid: openid
          })
          console.log(已下架)
        }

      },
      fail: function() {
        common.modalTap('网络错误')
      },
      complete: function() {
        that.setData({
          hidden: true
        })
      },
    });
    //设置默认校区
    page = 1;
    this.setData({
      length: 4,
      areas: []
    })
    this.getAreas(id, () => {
      this.setData({
        length: 4
      })
    })
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    this.onShow();
    wx.stopPullDownRefresh();
  },
  onReachBottom() {
    if (this.data.onBottom) {
      console.log('this.data.pullDown', this.data.onBottom)
      this.getAreas(this.data.kid);
    }
  },
  goumai: function() {
    var that = this;
    wx.navigateTo({
      url: '../DistOuder/DistOuder?kid=' + that.data.kid + '&title=' + that.data.list.modle.Title + "&img=" + that.data.list.modle.PicturePath + "&op=" + that.data.list.modle.OriginalPrice + "&gp=" + that.data.list.modle.RetailPrice + "&dopenid=" + that.data.dopenid
    });
  },
  zixun: function() {
    var pp = this.data.list.modle.Phone;
    wx.showModal({
      title: '欢迎咨询',
      confirmText: '呼叫',
      content: pp,
      success: function(sm) {
        if (sm.confirm) {
          wx.makePhoneCall({
            phoneNumber: pp
          })
        }
      }
    });
  },
  fanhui: function() {
    wx.reLaunch({
      url: '../../Kecheng/Home/Home'
    })
  },
  getAreas(id, cb) {
    var lgtlat = wx.getStorageSync('lgtlat');
    util.request(
      common.config.GetClaAreaInfos,
      "POST", {
        corId: +id,
        corSource: 1,
        page,
        size,
        lgt: lgtlat.lgt,
        lat: lgtlat.lat
      },
      (res) => {
        console.log("GETAREAS", res)
        console.log("GETAREAS_PAGE", page)
        if (res.data.res) {
          let areas = this.data.areas
          let result = res.data.data.cpInfos
          areas = areas.concat(result)
          this.setData({
            areas,
            agenInfo: res.data.data.agenInfo,
            length: areas.length
          })
          page++
        }
      },
      (err) => {
        util.showModal('提示', '网络异常')
      },
      (res) => {
        if (cb) {
          cb()
        }
        wx.hideLoading()
        wx.stopPullDownRefresh()
      },
    )
  },
  showAll() {
    this.setData({
      length: this.data.areas.length,
      onBottom: true
    })
    this.getAreas(this.data.kid)
  },
  showSome() {
    this.setData({
      length: 4
    })
  },
  toCampus(e) {
    console.log(e)
    let campusId = e.currentTarget.dataset.campusId
    let cName = e.currentTarget.dataset.name
    let cPhone = e.currentTarget.dataset.phone
    let cAddress = e.currentTarget.dataset.address
    wx.navigateTo({
      url: `/angli/campus/campus?campusId=${campusId}&cName=${cName}&cPhone=${cPhone}&cAddress=${cAddress}`,
    })
  },
  //点击校区进入校区信息查看
  getAgencyDes(data) {
    console.log(data);
    var Id = data.currentTarget.dataset.id;
    if (Id == undefined || parseInt(Id) <= 0) {
      wx.showModal({
        title: '发生错误了',
        content: '获取信息失败，请刷新重试',
        showCancel: false
      });
      return false;
    }
    wx.navigateTo({
      url: '../../Agency/AgeInfo/AgeInfo?Id=' + Id
    });
  },
});