// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()

exports.main = async (event, context) => {
  try {
    console.log("Sending message with event data:", event);

    let openid = cloud.getWXContext().OPENID;  // 获取用户的openid
    console.log(openid);
    if (openid === 'oRPEX7QdpoX-l0G3Tp_vfMKz1nM8') {//_openidA放到单引号里
        openid = 'oRPEX7RJkDdK4OKPhW0XQzC7iR-U';//_openidB放到单引号
    } else {
        openid = 'oRPEX7QdpoX-l0G3Tp_vfMKz1nM8';//_openidA放到单引号里
    }

    let taskName = '叮咚～任务更新提醒'
    // 获取发布任务最后一条信息进行推送
    await cloud.callFunction({ name: 'getList', data: { list: 'MissionList' } }).then(res => {
        const { data } = res.result
        const task = data.filter(task => task._openid == openid)
        if (task.length) {
            taskName = task[task.length - 1].title
        }
    })  

    const result = await cloud.openapi.subscribeMessage.send({
      touser: openid, // 发送通知给谁的openid(把上面挑好就行，这块不用动)
      data: {
        thing1: {
          value: taskName
        },
        thing2: {
          value: '你的宝r在努力学习哦'
        },
        thing3: {
          value: '提交人'
        },
        time4: {
          value: '提交时间'
        }
      },
      
      templateId: event.templateId, // 模板ID
      miniprogramState: 'trial',
      page: 'pages/MainPage/index' // 这个是发送完服务通知用户点击消息后跳转的页面
    })
    console.log("Sending message with event data:", event);

    console.log("Message sent successfully:", result);
    return event.startdate
  } catch (err) {
    console.log("Error while sending message:", err);
    return err
  }
}
