const express = require('express')
const http = require('http')
const app = express()

const userRouter = require('./router/userRouter/userRouter')
const applyRouter = require('./router/applyRouter/applyRouter')
const chatRouter = require('./router/chatRouter/chatRouter')
const server = http.createServer(app)

const io = require('socket.io')(server)
io.on('connection', (socket) => {
  socket.on('send', (data) => {
    io.emit('get', { phone: data.phone })
  })

  socket.on('update', () => {
    io.emit('update')
  })
  socket.on('apply', () => {
    io.emit('apply')
  })
  socket.on('pass', () => {
    io.emit('pass')
  })
})

app.get('/', (req, res) => {
  res.end('1')
})

app.use('/user', userRouter)
app.use('/apply', applyRouter)
app.use('/chat', chatRouter)
server.listen(1111)
