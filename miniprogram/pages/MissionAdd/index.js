Page({
    //增加消息接收与发送功能
    async handleTap() {
        await this.saveMission();
        await this.sendSubscribeMessage();
  },
  data: {
    title: '',
    desc: '',

    user: '',
    openid: 'none',
    another_openid: '',
    
    credit: 0,
    maxCredit: getApp().globalData.maxCredit,
    presetIndex: 0,
    presets: [{
      name:"无预设",
      title:"",
      desc:"",
    },{
      name:"早睡早起",
      title:"晚上要早睡，明天早起",
      desc:"熬夜对身体很不好，还是要早点睡觉第二天才能有精神！",
    },{
      name:"打扫房间",
      title:"清扫房间，整理整理",
      desc:"有一段时间没有打扫房间了，一屋不扫，何以扫天下？",
    },{
      name:"健康运动",
      title:"做些运动，注意身体",
      desc:"做一些健身运动吧，跳绳，跑步，训练动作什么的。",
    },{
      name:"戒烟戒酒",
      title:"烟酒不解真愁",
      desc:"维持一段时间不喝酒，不抽烟，保持健康生活！",
    },{
      name:"请客吃饭",
      title:"请客吃点好的",
      desc:"好吃的有很多，我可以让你尝到其中之一，好好享受吧！",
    },{
      name:"买小礼物",
      title:"整点小礼物",
      desc:"买点小礼物，像泡泡马特什么的。",
    },{
      name:"洗碗洗碟",
      title:"这碗碟我洗了",
      desc:"有我洗碗洗碟子，有你吃饭无它事。",
    },{
      name:"帮拿东西",
      title:"帮拿一天东西",
      desc:"有了我，你再也不需要移动了。拿外卖，拿零食，开空调，开电视，在所不辞。",
    },{
      name:"制作饭菜",
      title:"这道美食由我完成",
      desc:"做点可口的饭菜，或者专门被指定的美食。我这个大厨，随便下，都好吃。",
    }],
    list: getApp().globalData.collectionMissionList,
  },
  getUser(){
    wx.cloud.callFunction({name: 'getOpenId'}).then(res => {
        if(res.result === getApp().globalData._openidA){
          console.log('setting data')
          console.log(getApp().globalData._openidA)
            this.setData({
                user: getApp().globalData.userA,
                openid: getApp().globalData._openidA,
                another_openid: getApp().globalData._openidA,
            })
        }else if(res.result === getApp().globalData._openidB){
            this.setData({
                user: getApp().globalData.userB,
                openid: getApp().globalData._openidB,
                another_openid: getApp().globalData._openidA,
            })
        }
    })
  },
  //发送消息
  sendSubscribeMessage(e) {
      // 查看用户订阅消息设置
      wx.getSetting({
        withSubscriptions: true,
        success (res) {
          console.log(res)
        }
      })

      const accessToken = '93_f0tZSId_a3cPoPqBUImj4oxPozr0eZ29mRkysyBn08gvK6xLVG-c1Zj9Qzng0rz5ss1-TaQZD8P8oMRxUVC9Cdkc3HUiEAojW94vFs5P8Ei9Kamva7s3v_cNFJUYUFbABANJU';

    const url = `https://api.weixin.qq.com/cgi-bin/message/subscribe/send?access_token=${accessToken}`;

    this.getUser();

    console.log("openid: ", this.data.openid);

    const desc = this.data.desc ? this.data.desc : "无";

    const data = {
      "touser": this.data.another_openid,
      "template_id": "-g6xe849BPzCe33dPOy2xQgClsIhyxbQfV9RjtW21Rk",
      "miniprogramState": 'trial',
      "page": "pages/MainPage/index",
      "data": {
        "thing1": {
          "value": this.data.title
        },
        "thing2": {
          "value": desc
        },
        "thing3": {
          "value": this.data.user
        },
        "time4": {
          "value": "2020-03-31 09:35:22"
        }
      }
    };

    wx.request({
      url: url,
      method: 'POST',
      header: {
        'Content-Type': 'application/json'
      },
      data: data,
      success(res) {
        console.log('请求成功:', res.data);
      },
      fail(err) {
        console.error('请求失败:', err);
      }
    });

      //调用云函数，
      wx.cloud.callFunction({
      name: 'information',
      //data是用来传给云函数event的数据，你可以把你当前页面获取消息填写到服务通知里面
      data: {
          action: 'sendSubscribeMessage',
          templateId: '-g6xe849BPzCe33dPOy2xQgClsIhyxbQfV9RjtW21Rk',//这里我就直接把模板ID传给云函数了
          me:'Test_me',
          name:'Test_activity',
          _openid:'oRPEX7QdpoX-l0G3Tp_vfMKz1nM8'//填入自己的openid
      },
      success: res => {

          console.warn('[云函数] [openapi] subscribeMessage.send 调用成功：', res)
          wx.showModal({
          title: '发送成功',
          content: '请返回微信主界面查看',
          showCancel: false,
          })
          wx.showToast({
          title: '发送成功，请返回微信主界面查看',
          })
          this.setData({
          subscribeMessageResult: JSON.stringify(res.result)
          })
      },
      fail: err => {
          wx.showToast({
          icon: 'none',
          title: '调用失败',
          })
          console.error('[云函数] [openapi] subscribeMessage.send 调用失败：', err)
      }
      })

  },  
  //保存正在编辑的任务

  //数据输入填写表单
  onTitleInput(e) {
    this.setData({
      title: e.detail.value
    })
  },
  onDescInput(e) {
    this.setData({
      desc: e.detail.value
    })
  },
  onCreditInput(e) {
    this.setData({
      credit: e.detail.value
    })
  },
  onPresetChange(e){
    this.setData({
      presetIndex: e.detail.value,
      title: this.data.presets[e.detail.value].title,
      desc: this.data.presets[e.detail.value].desc,
    })
  },

  //保存任务
  async saveMission() {
    // 对输入框内容进行校验
    if (this.data.title === '') {
      wx.showToast({
        title: '标题未填写',
        icon: 'error',
        duration: 2000
      })
      return
    }
    if (this.data.title.length > 12) {
      wx.showToast({
        title: '标题过长',
        icon: 'error',
        duration: 2000
      })
      return
    }
    if (this.data.desc.length > 100) {
      wx.showToast({
        title: '描述过长',
        icon: 'error',
        duration: 2000
      })
      return
    }
    if (this.data.credit <= 0) {
      wx.showToast({
        title: '一定要有积分',
        icon: 'error',
        duration: 2000
      })
      return
    }else{
        await wx.cloud.callFunction({name: 'addElement', data: this.data}).then(
            () => {
                wx.showToast({
                    title: '添加成功',
                    icon: 'success',
                    duration: 1000
                })
            }
        )
        setTimeout(function () {
            wx.navigateBack()
        }, 1000)
    }
  },

  // 重置所有表单项
  resetMission() {
    this.setData({
      title: '',
      desc: '',
      credit: 0,
      presetIndex: 0,
      list: getApp().globalData.collectionMissionList,
    })
  }
})