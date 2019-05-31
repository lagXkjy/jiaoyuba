// Ouder.js
var common = require('../../Common.js')
var zhidian = "true";
let money, zheMoney, saveInp, phone
const app = getApp();
let types;
let quan_id = ''
let quan_name = ''
let quan_money = 0;
const util = require('../../utils/util.js')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    kid: 0,
    img: "",
    title: "",
    gprice: "",
    oprice: "",
    rprice: "",
    types: "",
    wtime: 0,
    ucount: 0,
    op: "",
    gp: "",
    gid: "0",
    co: "",
    sp: "",
    jp: "",
    name: "",
    pphone: "",
    coursetype: "",
    CoursePath: common.config.CoursePath,
    quan_name: "请选择优惠券",
    canuse: true,
    jiantou: common.config.StaticPath + "jiantou-red_06.png",
    cpInfos: [],
    pickerIndex: 0
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.request({
      url: common.config.GetNameAndPhoneOfOpenId,
      data: { openid: wx.getStorageSync('openid') },
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        if (res.data.result) {
          let uname = res.data.name;
          let uphone = res.data.phone;
          if (res.data.name) {
            that.setData({ name: uname })
          }
          if (res.data.phone) {
            that.setData({ pphone: uphone })
          }
        }
      },
      complete() {
      }
    });


    var openid = wx.getStorageSync('openid');
    if (openid == null || openid == "") {
      common.GetOpenId();
    }
    if (options.money) {
      money = options.money
      zheMoney = options.zheMoney

    }
    if (options.saveInp) {
      saveInp = options.saveInp

    }
    this.getDatas(() => {
      if (options.quan_id) {
        console.log("QUAN_ID++ZHE_MONEY", this.data.zheMoney)
        quan_id = options.quan_id
        quan_name = options.quan_name;
        quan_money = options.quan_money;
        zheMoney = this.data.zheMoney - quan_money > 0 ? (this.data.zheMoney - quan_money).toFixed(2) : 0
        that.setData({
          quan_id,
          quan_name,
          quan_money,
          zheMoney,
          money
        })
      }
    });
    console.log(options, options.name, options.phone)
    if (options.name != 'undefined') {
      this.setData({ name: options.name })
    }
    if (options.phone != 'undefined') {
      this.setData({ pphone: options.phone })
    }
    if (options.age != 'undefined') {
      this.setData({ age: options.age })
    }
    if (options.remark != 'undefined') {
      this.setData({ remark: options.remark })
    }
    this.getCpInfos(kid);
  },
  nameInp(e) {
    this.setData({
      name: e.detail.value
    })
  },
  phoneInp(e) {
    this.setData({
      pphone: e.detail.value
    })
  },
  ageInp(e) {
    this.setData({
      age: e.detail.value
    })
  },
  remarkInp(e) {
    this.setData({
      remark: e.detail.value
    })
  },
  formSubmit: function (e) {
    //wx.setStorageSync("formId", e.detail.formId);
    let formId = e.detail.formId;
    var that = this;
    if (zhidian == "false") {
      return;
    }
    if (e.detail.value.Name == "") {
      common.modalTap("请填写姓名");
      return;
    }
    if (!(/^1[34578]\d{9}$/.test(e.detail.value.Phone))) {
      common.modalTap("请填写正确的手机号");
      return;
    }
    if (e.detail.value.Remark.length > 30) {
      common.modalTap("请输入少于30字的备注");
      return;
    } else {
      zhidian = "false";
      var openid = wx.getStorageSync('openid');
      var name = e.detail.value.Name;
      var phone = e.detail.value.Phone;
      var age = e.detail.value.Age;
      var remark = e.detail.value.Remark;
      var guid = "";
      var packageid = "";
      var pickerIndex = this.data.pickerIndex;
      wx.login({
        success: function (res) {
          if (res.code) {
            //开团订单
            wx.request({
              url: common.config.PlaceAnOrder,
              data: {
                openId: openid,
                payMoney: zheMoney,
                pName: name,
                pPhone: phone,
                age: age,
                remark: remark,
                coupId: quan_id,
                formId,
                cpId: that.data.cpInfos[pickerIndex].CpId
              },
              method: 'POST',
              success: function (res) {
                if (res.data.errCode == 1104) {

                }
                console.log("预支付", res);
                let odrId = res.data.data.odrId
                packageid = res.data.package;
                let paras = res.data.data.paras
                if (zheMoney == 0) {
                  // 支付成功
                  util.request(
                    common.config.PayMentSuccess,
                    "POST",
                    {
                      odrId,
                      path: `/Kecheng/Home/Home`
                    },
                    (res) => {
                      console.log("支付成功", res)
                    },
                    (err) => { },
                    (res) => {
                      wx.redirectTo({
                        url: `../../Kecheng/Taosuccess/Taosuccess?gid=0&zhi=0&gid=${odrId}&noshow=true`
                      })
                    }
                  )
                  return;
                }
                wx.requestPayment({
                  timeStamp: paras.timeStamp,
                  nonceStr: paras.nonceStr,
                  package: paras.package,
                  signType: 'MD5',
                  paySign: paras.paySign,
                  success: function (res) {
                    console.log("PAYMENT_SUCCESSS",res)
                    // 支付成功
                    util.request(
                      common.config.PayMentSuccess,
                      "POST",
                      {
                        odrId,
                        path: `/Kecheng/Home/Home`
                      },
                      (res) => {
                        console.log("支付成功", res)
                      },
                      (err) => { },
                      (res) => {
                        wx.redirectTo({
                          url: `../../Kecheng/Taosuccess/Taosuccess?gid=0&zhi=0&gid=${odrId}&noshow=true`
                        })
                      }
                    )
                  },
                  fail: function (res) {
                    that.DeleteGroupOrder(odrId);
                    // 失败或取消
                  },
                  complete: function (res) {
                    // 成功或取消都会进入该方法
                  }
                })
              }
            });
          } else {
            console.log('获取用户登录态失败！' + res.errMsg)
          }
        }
      });
    }
  },
  DeleteGroupOrder(odrId) {
    zhidian = "true";
    var that = this;
    wx.request({
      url: common.config.PlaceAnOrderFailed,
      data: {
        odrId
      },
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log("支付失败", res)
      }
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
    console.log('app.globalData', app.globalData)
    zhidian = "true";
    let that = this
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
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: common.data.TitleName,
      path: 'Kecheng/Home/Home'
    }
  },
  onPullDownRefresh: function () {
    this.onLoad();
    wx.stopPullDownRefresh()
  },
  kecheng: function (e) {
    var id = this.data.kid;
    wx.navigateTo({
      url: '../../Kecheng/TaoCan/TaoCan?yu=0&id=' + id,
    });
  },
  chooseQuan() {
    let that = this;
    wx.navigateTo({
      url: '../useQuan/useQuan?use=tc' + `&name=${that.data.name}&phone=${that.data.pphone}&age=${that.data.age}&remark=${that.data.remark}`,
    })
  },
  //获取已选择课程
  getDatas(cb) {
    //util.showLoading('努力加载ing...')
    cb = typeof cb === 'function' ? cb : function cb() { }
    util.request(
      common.config.GetMySelCorInfos,
      "POST", {
        openId: wx.getStorageSync('openid')
      },
      (res) => {
        console.log("获取已选择课程", res)
        if (res.data.res) {
          let count = 0
          let arr = this.data.myCourList
          let myCourList = res.data.data.cpInfos
          for (let i = 0; i < myCourList.length; i++) {
            myCourList[i].CpPrice = myCourList[i].CpPrice.toFixed(2)
            if (myCourList[i].CpTitle.length > 20) {
              myCourList[i].CpTitle = myCourList[i].CpTitle.substr(0, 18) + "..."
            }
            myCourList[i].choose = true
          }
          this.setData({
            myCourList,
            count: myCourList.length,
            money: res.data.data.oriPrice,
            zheMoney: res.data.data.disPrice
          })
          if (count == myCourList.length) {
            this.setData({
              all: true
            })
          } else {
            this.setData({
              all: false
            })
          }
          // this.setData({
          //   myCourList: res.data.data.cpInfos
          // })

          // this.allChoose()
        }
        if (res.data.errCode == 1106) //未选择
        {

        }
        cb()
      },
      (err) => {
        util.showModal('提示', '网络异常')
      },
      (res) => {
        //wx.hideLoading()
      }
    )
  },
  //获取校区信息
  getCpInfos: function (corId) {
    var page = this;
    wx.request({
      url: common.config.GetCorCpInfos,
      data: {
        corId: corId
      },
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        if (res.data.res) {
          page.setData({
            cpInfos: res.data.data
          })
        } else {
          wx.showModal({
            title: '错误提示',
            content: '获取校区信息失败',
            showCancel: false
          })
        }
      }
    });
  },
  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value,
      pickerIndex: e.detail.value
    })
  },
})