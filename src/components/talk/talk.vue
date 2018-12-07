<template>
    <div class="talk" v-loading.fullscreen.lock="load">
      <div class="talkBox">
        <ul class="scroll">
          <li v-if="list" v-for="(item,index) in list">
            <div class="infoLeft">
              <img :src="item.favatar">
            </div>
            <div class="infoRight">
              <div class="info clearfix">
                <span class="user" :id="item.fphone==fphone?'red':''">{{item.fuser}}</span>
                <span class="time">{{item.time}}</span>
              </div>
              <div class="content">{{item.content}}</div>
            </div>
          </li>
        </ul>
      </div>
      <div class="inputArea">
        <el-input
          placeholder="请输入内容"
          v-model="msg"
          clearable
        class="input">
        </el-input>
        <el-button type="primary" class="btn" @click="send">发送</el-button>
      </div>
    </div>
</template>

<script>
import BScroll from 'better-scroll'
import axios from 'axios'
export default {
  data () {
    return {
      msg: '',
      tavatar: '',
      tuser: '',
      tphone: '',
      load: false,
      socket: '',
      list: '',
      talkTo: '',
      scroll: ''
    }
  },
  computed: {
    fphone () {
      return this.$store.state.phone
    },
    fuser () {
      return this.$store.state.user
    },
    favatar () {
      return this.$store.state.avatar
    },
    chantList () {
      return this.$store.state.chatList
    }
  },
  watch: {
    chantList (n) {
      for (var l = 0; l < n.length; l++) {
        if (n[l].phone == this.$store.state.talkto.phone) {
          this.list = n[l].list
          break
        }
      }
      const scroll = new BScroll('.talkBox', {})
      this.scroll = scroll
      this.scroll.scrollTo(0, this.scroll.maxScrollY)
    }
  },
  mounted () {
    this.load = true
    this.talkTo = this.$store.state.talkto // 获取目标信息
    this.tphone = this.talkTo.phone
    this.tuser = this.talkTo.user
    this.tavatar = this.talkTo.avatar
    this.socket = this.$store.state.socket
    this.load = false
    for (var l = 0; l < this.chantList.length; l++) {
      if (this.chantList[l].phone == this.$store.state.talkto.phone) {
        this.list = this.chantList[l].list
        break
      }
    }
    axios.get('/chat/read', { params: { tphone: this.tphone, fphone: this.fphone } })
      .then(res => {
        if (res.data.code == 1) {
          this.$store.state.socket.emit('update')
        }
      })
    const scroll = new BScroll('.talkBox', {})
    this.scroll = scroll
    this.scroll.scrollTo(0, this.scroll.maxScrollY)
  },
  methods: {
    send () {
      const content = this.msg
      const read = false
      const favatar = this.favatar
      const tavatar = this.tavatar
      const tphone = this.tphone
      const fphone = this.fphone
      const fuser = this.fuser
      const tuser = this.tuser
      let y = new Date().getFullYear()
      let m = new Date().getMonth() + 1
      let d = new Date().getDate()
      const time = y + '/' + m + '/' + d
      if (!content) {
        this.$message.error('请输入内容')
      }
      this.load = true
      axios.post('/chat/insert', { read, content, favatar, tavatar, tphone, fphone, fuser, tuser, time })
        .then((res) => {
          if (res.data.code == 1) {
            this.socket.emit('send', { phone: tphone })
            axios.get('/chat/all', { params: { phone: fphone } })
              .then(res => {
                this.$store.commit('setChatList', res.data)
              })
          }
          this.load = false
          this.msg = ''
        })
    }
  }
}
</script>

<style scoped>
  .clearfix:after{
    display: block;
    visibility: hidden;
    height: 0;
    content: '';
    clear: both;
  }
  #red{
    color: red;
  }
  ul{
    list-style: none;
    padding: 0;
    margin: 0;
  }
  ul li{
    padding: 4px 0;
  }
  .talkBox{
    padding: 10px 5%;
    box-sizing: border-box;
    overflow: hidden;
  }
  .scroll{
    position: relative;
  }
  .talk
  {
    width: 100%;
    height: 100%;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }
  .talkBox{
    width: 100%;
    flex: 8;
  }
  .content{
    margin-top: 6px;
    word-wrap:break-word;
    word-break:break-all;
    color: #444;
  }
  .inputArea{
    display: flex;
    padding: 2px 10px;
  }
  .input{
    flex: 4;
  }
  .user{
    float: left;
    color: #444;
  }
  .time{
    float: right;
  }
  .btn{
    flex: 1;
  }
  li{
    display: flex;
  }
  .infoLeft{
    position: relative;
    flex: 2;
  }
  .infoRight{
    overflow: hidden;
    flex: 6;
  }
  img{
    display: block;
    width: 60px;
    height: 60px;
    margin: 0 auto;
    position: relative;
    top: 50%;
    transform: translateY(-50%);
  }
</style>
