//index.js
const app = getApp();

Page({
  /**
   * 页面的初始数据
   */
  data: {
   username:'点击登录',
   defaultUrl:'/images/log.png',
   userTx:'',
   userInfo:{},
   gender:1,
   province:''
  },
  onLoad:function(){
    wx.setNavigationBarTitle({
      title: '我的'
    })
    //当重新加载这个页面时，查看是否有已经登录的信息
    let username=wx.getStorageSync('username'),
    avater=wx.getStorageSync('avatar');
    if(username){
      this.setData({
        username:username,
        userTx:avater
      })
    }
    wx.getSetting({
      success:res=>{
        if(res.authSetting['scope.address.userInfo']){
          wx.getUserInfo({
            success:res=>{
              this.setData({
                userTx:res.userInfo.avatarUrl,
                userInfo:res.userInfo
              })
            }
          })
        }
      }
    })
  },
  getUserInfoHandler:function(e){
    let d=e.detail.userInfo
    var gen=d.gender==1?'男':'女'
    this.setData({
      userTx:d.avatarUrl,
      username:d.nickName
    })
    wx.setStorageSync('avater', d.avatarUrl)
    wx.setStorageSync('username', d.nickName)
    wx.setStorageSync('gender', d.gen)
    wx.setStorageSync('province', d.province)
    const db=wx.cloud.database()
    const _=db.command
    //查看是否已有登录，无，获取id
    var userId=wx.getStorageSync('userId')
    if(!userId){
      userId=this.getUserId()
    }
    //查找数据库
    db.collection('users').where({
      _openid:d.openid
    }).get({
      success(res){
        //res.data 包含以上定义的记录的数组
        //若查询到数据，将数据记录，否则去数据库注册
        if(res.data &&res.data.length>0){
          wx.setStorageSync('openId', res.data[0]._openid)
         // console.log(res)
         this.setData({
          defaultUrl:d.userTx
         })
        }else{
          //定时器
          setTimeout(()=>{
            //写入数据库
            db.collection('users').add({
              data:{
                userId:userId,
                _openid:d.openid,
                username:d.nickName,
                sex:d.gender,
                userTx:d.avatarUrl,
                id:d.iv
              },
              success:function(){
                console.log('新增用户成功')
                db.collection('users').where({
                  userId:userId
                }).get({
                  success:res=>{
                    wx.setStorageSync('openId', res.data[0]._openid)
                  },
                  fail:err=>{
                    console.log('用户_openId设置失败')
                  }
                })
              },
              fail:function(e){
                console.log('新增用户失败')
              }
            })
          },100)
        }
      },
      fail:err=>{

      }
    })
  },
  getUserId:function(){
    //产生唯一id,一个字母或数字+1970年到现在的毫秒数+10w的一个随机数组成
    var w = "abcdefghijklmnopqrstuvwxyz0123456789",
      firstW = w[parseInt(Math.random() * (w.length))];
    var userId = firstW + (Date.now()) + (Math.random() * 100000).toFixed(0)
    wx.setStorageSync('userId', userId)
    return userId;
  }
})

