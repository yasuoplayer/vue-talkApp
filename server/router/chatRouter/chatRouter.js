const express = require('express')
const formidable = require('formidable')
const chatRouter = express.Router()
const { getModel } = require('../../db/initDb')
const chatModel = getModel('chat')

chatRouter.get('/all', (req, res) => {
  const phone = req.query.phone // 目标
  chatModel.find({ $or: [
    { 'fphone': phone },
    { 'tphone': phone }
  ] }, (err, data) => {
    if (err) {
      res.json({ code: 1, msg: '后台出错' })
      return
    }
    res.json(data)
  })
})

chatRouter.get('/read', (req, res) => {
  const tphone = req.query.fphone // 源
  const fphone = req.query.tphone // 目标
  chatModel.update({ fphone, tphone }, { read: true }, { multi: true }, (err, data) => {
    if (err) {
      res.json({ code: 0, msg: '后台出错' })
      return
    }
    res.json({ code: 1 })
  })
})

chatRouter.post('/insert', (req, res) => {
  const form = new formidable.IncomingForm()
  form.encoding = 'utf-8'
  form.parse(req, (err, feild, file) => {
    const { content, read, favatar, tavatar, time, fuser, tuser, tphone, fphone } = feild
    chatModel.create({ content, read, favatar, tavatar, time, fuser, tuser, tphone, fphone }, (err, data) => {
      if (err) {
        res.json({ code: 0, msg: '后台出错' })
        return
      }
      res.json({ code: 1 })
    })
  })
})

chatRouter.get('/list', (req, res) => {
  chatModel.find({}, (err, data) => {
    res.json(data)
  })
})

chatRouter.get('/remove', (req, res) => {
  chatModel.remove({}, (err, data) => {
    res.json(data)
  })
})

module.exports = chatRouter
