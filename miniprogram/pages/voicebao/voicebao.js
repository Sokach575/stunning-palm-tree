// pages/voicebao/voicebao.js
const innerAudioContext=wx.createInnerAudioContext()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navber:['文字记录','语音记录'],
    currentTab:2,
    ymood:'红色',
    theplay:true
  },

 //播放声音
 play:function(){
   if(this.data.theplay){
     this.setData({
       theplay:false
     })
     innerAudioContext.autoplay=true
     innerAudioContext.src=wx.getStorageSync('ytempFilePath'),
     innerAudioContext.onPlay(()=>{
       console.log('开始播放')
     }),
     innerAudioContext.onEnded(()=>{
       this.setData({
         theplay:true
       })
     })
     innerAudioContext.onError((res)=>{
       console.log(res.errMsg)
     })
   }
 },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    innerAudioContext.stop()
  },
//当点击下一步后如果语音在播放则关闭
onHide:function(){
  innerAudioContext.stop()
},
//音爆
changeMood:function(e){
  this.setData({
    ymood:e.detail.value
  })
},
 //音爆，点爆按钮跳转
 detonation: function (e) {
  let ymood = this.data.ymood
  var wy = 'y'
  //将数据保存到本地,保存语音判断
  wx.setStorageSync('ymood', ymood)
  wx.setStorageSync('wy', wy)
  //跳转页面
  wx.navigateTo({
    url: '../selectbao/selectbao'
  })
},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})