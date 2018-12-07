const mongoose = require('mongoose')
mongoose.connect('mongodb://120.79.249.6:27017')
const Schema = {
  user: {
    phone: String,
    user: String,
    psw: String,
    sex: String,
    friends: {
      '亲人': [],
      '朋友': [],
      '同事': [],
      '同学': []
    },
    sign: String,
    avatar: String
  },
  chat: {
    content: String,
    read: Boolean,
    favatar: String,
    tavatar: String,
    time: String,
    fuser: String,
    tuser: String,
    tphone: String,
    fphone: String
  },
  apply: {
    from: String,
    to: String,
    msg: String,
    group: String,
    pass: Boolean
  }
}

for (var n in Schema) {
  mongoose.model(n, mongoose.Schema(Schema[n]))
}

function getModel (string) {
  return mongoose.model(string)
}

module.exports = {
  getModel
}
