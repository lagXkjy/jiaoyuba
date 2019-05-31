// Ouder.js
var common = require('../../Common.js')
var zhidian = "true";
const app = getApp();
let kid = 0;
let title = ''
let img = ''
let op = 0
let jp = 0
let types;
let quan_id = ''
let quan_name = ''
let quan_money = 0;
let name;
let pphone;
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
    jiantou: common.config.StaticPath + "jiantou-red_06.png",
    quan_name: '请选择优惠券',
    cpInfos: [],
    pickerIndex: 0
  },
  nameInp(e) {
    console.log(e)
    name = e.detail.value
    app.globalData.name = name
    this.setData({
      name
    })
  },
  pphoneInp(e) {
    pphone = e.detail.value
    app.globalData.pphone = pphone
    this.setData({
      pphone
    })
  },
  ageInp(e) {
    var age = e.detail.value
    app.globalData.age = age
    this.setData({
      age
    })
  },
  remarkInp(e) {
    var remark = e.detail.value
    app.globalData.remark = remark
    this.setData({
      remark
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (options.quan_id) {
      quan_id = options.quan_id
      quan_name = options.quan_name;
      quan_money = options.quan_money;
    }
    let saveInp = options.saveInp
    console.log("APP", app.globalData.name)

    var that = this;
    var openid = wx.getStorageSync('openid');
    if (openid == null || openid == "") {
      common.GetOpenId();
    }
    kid = options.kid;
    title = options.title;
    img = options.img;
    op = options.op;
    jp = options.jp;
    types = options.types;

    wx.request({
      url: common.config.GetNameAndPhoneOfOpenId,
      data: {
        openid: openid
      },
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },
      success: function(res) {
        if (res.data.result) {
          name = res.data.name;
          if (res.data.name) {
            app.globalData.name = name
          }
          if (res.data.phone) {
            app.globalData.pphone = phone
          }
          var phone = res.data.phone;
          if (phone == "0") {
            phone = "";

          }
        }
        if (title.length > 20) {
          title = title.substr(0, 19) + '...';
        }
        that.setData({
          title: title,
          kid: kid,
          img: common.config.CoursePath + img,
          op: op,
          gp: (op - jp).toFixed(2),
          jp: jp,
          pay: jp,
          name: name,
          pphone: phone
        })
      },
      complete() {
        if (saveInp) {
          that.setData({
            name: app.globalData.name,
            pphone: app.globalData.pphone,
            age: app.globalData.age,
            remark: app.globalData.remark,
            pay: jp - quan_money > 0 ? (jp - quan_money).toFixed(2) : 0.00,
            quan_id,
            quan_name,
            quan_money,
          })
        }
        that.setData({})
      }
    });
    this.getCpInfos(kid);
  },
  formSubmit: function(e) {
    console.log(e);
    wx.setStorageSync("formId", e.detail.formId);
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
      jp = (jp - quan_money).toFixed(2)
      if (jp - quan_money < 0) {
        //quan_name = '该券不可用于购买此课程'
        jp = 0
      }
      wx.login({
        success: function(res) {
          if (res.code) {
            //开团订单
            wx.request({
              url: common.config.pay,
              data: {
                openid: openid,
                cid: that.data.kid,
                grouptype: "0",
                name: name,
                phone: phone,
                price: that.data.pay, //that.data.jp,
                age: age,
                remark: remark,
                csid: quan_id,
                cpId: that.data.cpInfos[pickerIndex].CpId
              },
              method: 'GET',
              success: function(res) {
                wx.setStorageSync("packageid", res.data.package);
                packageid = res.data.package;
                if (that.data.pay == 0) {
                  if (res.data.res) {
                    wx.redirectTo({
                      url: "../Yousuccess/Yousuccess?gid=0&zhi=1"
                    })
                  }
                  return;
                }
                wx.requestPayment({
                  timeStamp: res.data.timeStamp,
                  nonceStr: res.data.nonceStr,
                  package: res.data.package,
                  signType: 'MD5',
                  paySign: res.data.paySign,
                  success: function(res) {
                    // 支付成功
                    console.log("支付成功")
                    wx.redirectTo({
                      url: "../Yousuccess/Yousuccess?gid=0&zhi=1"
                    })
                  },
                  fail: function(res) {
                    that.DeleteGroupOrder(openid);
                    // 失败或取消
                  },
                  complete: function(res) {
                    // 成功或取消都会进入该方法

                  }
                })

              }
            });
            // }else{

            // }

          } else {
            console.log('获取用户登录态失败！' + res.errMsg)
          }
        }
      });
    }
  },
  DeleteGroupOrder(openid) {
    zhidian = "true";
    var that = this;
    wx.request({
      url: common.config.DeleteGroupOfgidOrcidAndopenid,
      data: {
        cid: that.data.kid,
        gid: that.data.gid,
        openid: openid
      },
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },
      success: function(res) {
        if (res.data.result) {}
      }
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
    zhidian = "true";
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
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  onPullDownRefresh: function() {
    wx.stopPullDownRefresh()
  },
  kecheng: function(e) {
    var id = this.data.kid;
    wx.navigateTo({
      url: '../YouHui/YouHui?yu=0&id=' + id,
    });
  },
  chooseQuan() {
    wx.redirectTo({
      url: `../../angli/useQuan/useQuan?kid=${kid}&title=${title}&img=${img}&op=${op}&jp=${jp}&types=${types}&use=yh`,
    });
  },
  //获取校区信息
  getCpInfos: function(corId) {
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
      success: function(res) {
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
  bindPickerChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value,
      pickerIndex: e.detail.value
    })
  },
})