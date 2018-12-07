const express = require('express')
const formidable = require('formidable')
const path = require('path')
const { getModel } = require('../../db/initDb')
const fs = require('fs')
const md5 = require('md5')
const userModel = getModel('user')
const chatModel = getModel('chat')
const userRouter = express.Router()

userRouter.post('/find', (req, res) => {
  const form = new formidable.IncomingForm()
  form.encoding = 'utf-8'
  form.parse(req, (err, feild, file) => {
    if (err) {
      res.json({ code: 0, msg: '后台出错' })
      return
    }
    const { user, phone, sex } = feild
    userModel.findOne({ user, phone, sex }, (err, data) => {
      if (err) {
        res.json({ code: 0, msg: '后台出错' })
        return
      }
      if (data) {
        res.json({ code: 1, data })
      } else {
        res.json({ code: 0, msg: '该用户不存在' })
      }
    })
  })
})

userRouter.post('/register', (req, res) => {
  const form = new formidable.IncomingForm()
  form.encoding = 'utf-8'
  form.parse(req, (err, feild, file) => {
    if (err) {
      res.json({ code: 0, msg: '后台出错' })
      return
    }
    let { user, psw, sex, phone } = feild
    psw = md5(md5(psw))
    let avatar = fs.readFileSync(path.join(__dirname, '/default.png'))
    avatar = 'data:image/png;base64,' + avatar.toString('base64')
    userModel.create({ user, psw, sex, phone, avatar }, (err, data) => {
      if (err) {
        res.json({ code: 0, msg: '后台出错' })
      } else if (data) {
        res.json({ code: 1, data })
      }
    })
  })
})

userRouter.post('/update', (req, res) => {
  const form = new formidable.IncomingForm()
  form.encoding = 'utf-8'
  form.parse(req, (err, feild, file) => {
    if (err) {
      res.json({ code: 0, msg: '后台出错' })
      return
    }
    let { sex, phone, avatar, user, sign } = feild
    userModel.updateOne({ phone }, { sex, avatar, user, sign }, (err, data) => {
      if (err) {
        res.json({ code: 0, msg: '后台出错' })
      } else if (data) {
        userModel.findOne({ phone }, { friends: 0 }, (err, data) => {
          if (err) {
            res.json({ code: 0, msg: '后台出错' })
          } else if (data) {
            updateT(phone, avatar, user)
              .then(function () {
                updateF(phone, avatar, user)
              }).then(() => {
                res.json({ code: 1 })
              })
            res.json({ code: 1, data })
          } else if (!data) {
            res.json({ code: 0, msg: '更新错误' })
          }
        })
      }
    })
  })
})

function updateT (phone, avatar, user) {
  var p = new Promise(function (resolve, reject) {
    chatModel.update({
      tphone: phone
    }, {
      tuser: user,
      tavatar: avatar
    }, { multi: true }, (err, data) => {
      resolve()
    })
  })
  return p
}

function updateF (phone, avatar, user) {
  var p = new Promise(function (resolve, reject) {
    chatModel.update({
      fphone: phone
    }, {
      fuser: user,
      favatar: avatar
    }, { multi: true }, (err, data) => {
      resolve()
    })
  })
  return p
}

userRouter.post('/login', (req, res) => {
  const form = new formidable.IncomingForm()
  form.encoding = 'utf-8'
  form.parse(req, (err, feild, file) => {
    if (err) {
      res.json({ code: 0, msg: '后台出错' })
      return
    }
    let { phone, psw } = feild
    psw = md5(md5(psw))
    userModel.find({ phone, psw }, (err, data) => {
      if (err) {
        res.json({ code: 0, msg: '后台出错' })
      } else if (data.length) {
        res.json({ code: 1, data })
      } else if (!data.length) {
        res.json({ code: 0, msg: '账号密码错误或者不存在' })
      }
    })
  })
})

userRouter.get('/checkphone', (req, res) => {
  const phone = req.query.phone
  userModel.find({ phone }, (err, data) => {
    if (err) {
      res.json({ code: 0, msg: '后台出错' })
      return
    }
    if (!data.length) {
      res.json({ code: 1 })
    } else {
      res.json({ code: 0, msg: '账号已被注册' })
    }
  })
})

userRouter.get('/findOne', (req, res) => {
  const phone = req.query.phone
  userModel.findOne({ phone }, (err, data) => {
    if (err) {
      res.json({ code: 0, msg: '后台出错' })
      return
    }
    res.json({ code: 1, data })
  })
})

userRouter.get('/list', (req, res) => {
  userModel.find({}, (err, data) => {
    if (err) {
      return
    }
    res.json(data)
  })
})

userRouter.get('/remove', (req, res) => {
  userModel.remove({}, (err, data) => {
    if (err) {
      return
    }
    res.json(data)
  })
})

userRouter.get('/getfriends', (req, res) => {
  const phone = req.query.phone
  userModel.find({ phone }, (err, data) => {
    if (err) {
      return
    }
    if (!data[0] || !data[0].friends) {
      return
    }
    let friends = data[0].friends
    let friendInfo = []
    for (var k in friends) {
      if (k == '亲人' || k == '朋友' || k == '同事' || k == '同学') {
        let obj = {
          type: k,
          member: []
        }
        if (friends[k].length > 0) {
          obj.member.push(friends[k])
        }
        friendInfo.push(obj)
      }
    }

    find1(friendInfo)
      .then(function (friendInfo) {
        return find2(friendInfo)
      })
      .then(function (friendInfo) {
        return find3(friendInfo) // 这里直接返回数据
      })
      .then(function (friendInfo) {
        return find4(friendInfo)
      })
      .then(function (friendInfo) {
        res.json(friendInfo)
      })
  })
})

function find1 (friendInfo) {
  let a = 0
  var p = new Promise(function (resolve, reject) {
    for (var n = 0; n < friendInfo.length; n++) {
      if (friendInfo[n].type == '亲人') {
        a = n
        let tj = []
        var member = friendInfo[n].member
        if (member.length < 1) {
          resolve(friendInfo)
          return
        }
        for (var k = 0; k < member.length; k++) {
          tj.push({ phone: member[k] })
        }
        userModel.find({ $or: tj }, { friends: 0 }, (err, data) => {
          friendInfo[a].member = data
          resolve(friendInfo)
        })
      }
    }
  })
  return p
}

function find2 (friendInfo) {
  let a = 0
  var p = new Promise(function (resolve, reject) {
    for (var n = 0; n < friendInfo.length; n++) {
      if (friendInfo[n].type == '同事') {
        let tj = []
        a = n
        var member = friendInfo[n].member
        if (member.length < 1) {
          resolve(friendInfo)
          return
        }
        for (var k = 0; k < member.length; k++) {
          tj.push({ phone: member[k] })
        }
        userModel.find({ $or: tj }, { friends: 0 }, (err, data) => {
          friendInfo[a].member = data
          resolve(friendInfo)
        })
      }
    }
  })
  return p
}

function find3 (friendInfo) {
  let a = 0
  var p = new Promise(function (resolve, reject) {
    for (var n = 0; n < friendInfo.length; n++) {
      if (friendInfo[n].type == '同学') {
        a = n
        let tj = []
        var member = friendInfo[n].member
        if (member.length < 1) {
          resolve(friendInfo)
          return
        }
        for (var k = 0; k < member.length; k++) {
          tj.push({ phone: member[k] })
        }
        userModel.find({ $or: tj }, { friends: 0 }, (err, data) => {
          friendInfo[a].member = data
          resolve(friendInfo)
        })
      }
    }
  })
  return p
}

function find4 (friendInfo) {
  let a = 0
  var p = new Promise(function (resolve, reject) {
    for (var n = 0; n < friendInfo.length; n++) {
      if (friendInfo[n].type == '朋友') {
        let tj = []
        a = n
        var member = friendInfo[n].member
        if (member.length < 1) {
          resolve(friendInfo)
          return
        }
        for (var k = 0; k < member.length; k++) {
          tj.push({ phone: member[k] })
        }
        userModel.find({ $or: tj }, { friends: 0 }, (err, data) => {
          friendInfo[a].member = data
          resolve(friendInfo)
        })
      }
    }
  })
  return p
}

module.exports = userRouter
