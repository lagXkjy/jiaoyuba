function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}
function formatDate(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()
  return [year, month, day].map(formatNumber).join('.')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const request = function(url,method,data,success,fail,complete){
  success = typeof success === 'function' ? success : function success(res){};
  fail = typeof fail === 'function' ? fail : function fail(err) { };
  complete = typeof complete === 'function' ? complete : function complete(res) { };
  wx.request({
    url,
    data,
    header: { 'content-type': 'application/json' },
    method,
    success,
    fail,
    complete,
  })
}

const http = function (url, method, data){
  return new Promise((resolve,reject)=>{
    wx.request({
      url,
      data,
      header: { 'content-type': 'application/json' },
      method,
      success:resolve(res),
      fail:reject(err),
      complete,
    })
  })
}

const showLoading = (title)=>{
  wx.showLoading({
    title,
    mask: true,
    success: function(res) {},
    fail: function(res) {},
    complete: function(res) {},
  })
}

const showModal = (title,content)=>{
  wx.showModal({
    title,
    content,
    showCancel: false,
    success: function(res) {},
    fail: function(res) {},
    complete: function(res) {},
  })
}

module.exports = {
  formatTime,
  formatDate,
  request,
  http,
  showModal,
  showLoading,
}
