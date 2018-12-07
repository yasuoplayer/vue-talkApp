const express = require('express')
const formidable = require('formidable')
const { getModel } = require('../../db/initDb')
const applyRouter = express.Router()
const applyModel = getModel('apply')
const userModel = getModel('user')
applyRouter.post('/apply', (req, res) => {
  const form = new formidable.IncomingForm()
  form.encoding = 'utf-8'
  form.parse(req, (err, feild, file) => {
    if (err) {
      res.json({ code: 0, msg: '后台出错' })
      return
    }
    let { from, to, msg, group, pass } = feild

    applyModel.findOne({ from, to }, (err, data) => {
      if (err) {
        res.json({ code: 0, msg: '后台出错' })
        return
      }
      if (data) {
        res.json({ code: 0, msg: '您已经申请过了' })
      } else {
        applyModel.create({ from, to, msg, group, pass }, (err, data) => {
          if (err) {
            res.json({ code: 0, msg: '后台出错' })
            return
          }
          if (data) {
            res.json({ code: 1, msg: '申请成功，请等待回复' })
          }
        })
      }
    })
  })
})

applyRouter.get('/findapply', (req, res) => {
  const phone = req.query.phone
  applyModel.find({ to: phone, pass: false }, (err, data) => {
    if (err) {
      return
    }
    res.json(data)
  })
})

applyRouter.get('/list', (req, res) => {
  applyModel.find({}, (err, data) => {
    if (err) {
      return
    }
    res.json(data)
  })
})
applyRouter.get('/remove', (req, res) => {
  applyModel.remove({}, (err, data) => {
    if (err) {
      return
    }
    res.json(data)
  })
})

applyRouter.post('/agress', (req, res) => {
  const form = new formidable.IncomingForm()
  form.encoding = 'utf-8'
  form.parse(req, (err, feild, file) => {
    if (err) {
      res.json({ code: 0, msg: '后台出错' })
      return
    }
    const { from, to, pass, group } = feild
    applyModel.update({ from, to }, { pass }, (err, data) => {
      if (err) {
        res.json({ code: 0, msg: '后台出错' })
        return
      }
      if (data) {
        userModel.findOne({ phone: to }, (err, data) => { // 同意者
          if (err) {
            res.json({ code: 0, msg: '后台出错' })
            return
          }
          if (data) {
            data.friends[group].push(from)
            userModel.update({ phone: to }, { friends: data.friends }, (err, data) => {
              if (err) {
                res.json({ code: 0, msg: '后台出错' })
                return
              }

              applyModel.findOne({ from, to }, (err, data) => {
                if (err) {
                  res.json({ code: 0, msg: '后台出错' })
                  return
                }
                let group1 = data.group

                userModel.findOne({ phone: from }, (err, data) => { // 申请者
                  if (err) {
                    res.json({ code: 0, msg: '后台出错' })
                    return
                  }
                  var friends = data.friends
                  friends[group1].push(to)
                  userModel.update({ phone: from }, { friends }, (err, data) => {
                    if (err) {
                      res.json({ code: 0, msg: '后台出错' })
                      return
                    }
                    res.json({ code: 1, msg: '成功通过申请' })
                  })
                })
              })
            })
          }
        })
      }
    })
  })
})

applyRouter.get('/pass', (req, res) => {
  applyModel.update({}, { pass: false }, (err, data) => {
    res.json(data)
  })
})

applyRouter.get('/list', (req, res) => {
  applyModel.find({}, (err, data) => {
    res.json(data)
  })
})

applyRouter.get('/remove', (req, res) => {
  applyModel.remove({}, (err, data) => {
    res.json(data)
  })
})

module.exports = applyRouter
