/* Main page of the app */
Page({
    //允许接收服务通知
    async requestSubscribeMessage() {
        const templateId = '7hFWVTVHemALAhJpGneUYL-SRbYYY7WwLjnoCBoqwMg'//填入你自己想要的模板ID，记得复制粘贴全，我自己因为网页没开全，结果浪费半小时
        wx.requestSubscribeMessage({
        //tmplIds: [templateId,templateId2,templateId3],
        tmplIds: [templateId],
        success: (res) => {
            //if (res[templateId] === 'accept'&&res[templateId2] === 'accept'&&res[templateId3] === 'accept') {
            if (res[templateId] === 'accept') {
            this.setData({
                requestSubscribeMessageResult: '成功',
            })
            } else {
            this.setData({
                requestSubscribeMessageResult: `失败（${res[templateId]}）`,
            })
            }
        },
        fail: (err) => {
            this.setData({
            requestSubscribeMessageResult: `失败（${JSON.stringify(err)}）`,
            })
        },
        })
    },
    data: {
        creditA: 0,
        creditB: 0,

        userA: '',
        userB: '',

        daysInLove: 0
    },

    async onShow(){
        this.getCreditA()
        this.getCreditB()
        this.setData({
            userA: getApp().globalData.userA,
            userB: getApp().globalData.userB,
        })
    },

    getCreditA(){
        wx.cloud.callFunction({name: 'getElementByOpenId', data: {list: getApp().globalData.collectionUserList, _openid: getApp().globalData._openidA}})
        .then(res => {
          this.setData({creditA: res.result.data[0].credit})
        })
    },
    
    getCreditB(){
        wx.cloud.callFunction({name: 'getElementByOpenId', data: {list: getApp().globalData.collectionUserList, _openid: getApp().globalData._openidB}})
        .then(res => {
            this.setData({creditB: res.result.data[0].credit})
        })
    },

    onLoad() {
      const startDate = new Date(2025, 3, 15); // 注意月份从0开始计算
      const now = new Date();
      const diffTime = now - startDate;
      this.setData({
        daysInLove: Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1
      });
    }
})

Page({
  data: {
    daysInLove: 0
  },

  onLoad() {
    const startDate = new Date(2025, 4, 15); // 注意月份从0开始计算
    const now = new Date();
    const diffTime = now - startDate;
    this.setData({
      daysInLove: Math.floor(diffTime / (1000 * 60 * 60 * 24))
    });
  }
})