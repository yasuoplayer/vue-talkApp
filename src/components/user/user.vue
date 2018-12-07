<template>
    <div class="user" v-loading.fullscreen.lock="load">
      <div class="header clearfix">
        <img :src="avatar">
        <div class="info">
          <div class="user">{{user}}</div>
          <div class="sign">{{sign}}</div>
        </div>
      </div>
      <div class="content">
        <transition :name="transitionName">
          <!--<keep-alive>-->
            <router-view></router-view>
          <!--</keep-alive>-->
      </transition>
      </div>
        <div class="position">
          <el-menu default-active="/user/msg"  mode="horizontal" class="items" router="'true'" >
            <el-menu-item index="/user/msg" class="item" >
              <el-badge :value="bg" :max="99" id="badge" v-if="bg">
                消息
              </el-badge>
              <span v-if="!bg">消息</span>
            </el-menu-item>
            <el-menu-item index="/user/friends" class="item" >朋友</el-menu-item>
            <el-menu-item index="/user/mine" class="item" >我的</el-menu-item>
            <el-menu-item index="/user/add" class="item" >
              <el-badge is-dot v-if="dot" >加友</el-badge>
              <span v-if="!dot">加友</span>
            </el-menu-item>
          </el-menu>
        </div>
      </div>
</template>

<script>
import io from 'socket.io-client'
import axios from 'axios'
export default {
  data () {
    return {
      transitionName: 'slide-left',
      load: false,
      phone: '',
      bg: '0'
    }
  },
  computed: {
    avatar () {
      return this.$store.state.avatar
    },
    sign () {
      return this.$store.state.sign
    },
    user () {
      return this.$store.state.user
    },
    chatList () {
      return this.$store.state.chatList
    },
    dot () {
      return this.$store.state.apply
    }
  },
  watch: {
    '$route' (to, from) {
      const toDepth = to.path.split('/').length
      const fromDepth = from.path.split('/').length
      this.transitionName = toDepth < fromDepth ? 'slide-right' : 'slide-left'
    },
    chatList () {
      this.findList()
    }
  },
  methods: {
    findList () {
      let list = this.$store.state.chatList
      let allnumber = 0
      for (var n = 0; n < list.length; n++) {
        let number = 0
        let list1 = list[n].list
        for (var j = 0; j < list1.length; j++) {
          if (!list1[j].read && list1[j].fphone != this.$store.state.phone) {
            number++
          }
        }
        allnumber += number
      }
      this.bg = allnumber
    }
  },
  mounted () {
    const socket = io('http://localhost:1111')
    this.load = true
    this.phone = this.$store.state.phone
    axios.get('/chat/all', { params: { phone: this.phone } })
      .then(res => {
        this.$store.commit('setChatList', res.data)
      })
    socket.on('connect', () => {
      this.$store.commit('setSocket', socket)
      socket.on('get', (data) => {
        const phone = this.phone
        if (data.phone === this.phone) {
          axios.get('/chat/all', { params: { phone } })
            .then(res => {
              this.$store.commit('setChatList', res.data)
            })
        }
      })
      socket.on('update', () => {
        axios.get('/chat/all', { params: { phone: this.phone } })
          .then(res => {
            this.$store.commit('setChatList', res.data)
          })
      })

      socket.on('apply', () => {
        const phone = this.$store.state.phone
        axios.get('/apply/findapply', { params: {
          phone
        } }).then((res) => {
          this.$store.commit('setApplyList', res.data)
        })
      })

      socket.on('pass', () => {
        const phone = this.$store.state.phone
        axios.get('/apply/findapply', { params: {
          phone
        } }).then((res) => {
          this.$store.commit('setApplyList', res.data)
        })
      })
      this.load = false
    })
  }
}
</script>

<style scoped>

  .header
  {
    display: flex;
  }
  img{
    width: 60px;
    height: 60px;
    display: block;
    float: left;
    border-radius: 50%;
  }
  .info{
    float: left;
    flex: 1;
  }
  .info .user,info .sign{
    color: #fff !important;
  }
  .info .sign{
    text-indent: 10px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: #fff !important;
    height: 20px;
    line-height: 20px;
  }
  .info .user{
    height: 40px;
    line-height: 40px;
    text-align: center;
  }
  .user{
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  .header{
    box-sizing: border-box;
    height: 80px;
    width: 100%;
    background: #409EFF;
    padding:10px 10%;
  }
  .position{
    border-top: #409EFF 1px solid;
    width: 100%;
    overflow: hidden;
    flex: 1;
  }
  .content{
    flex: 9;
    overflow: hidden;
    position: relative;
  }
  .items{
    display: flex;
    flex-direction: row;
  }
  .item{
    flex: 1;
    text-align: center;
  }
  .slide-right-enter,.slide-right-leave-to{
    left:-100%;
  }
  .slide-right-enter-to,.slide-right-leave{
    left:0%;
  }
  .slide-right-enter-active,.slide-right-leave-active{
    position: relative;
    transition: all .5s;
  }

  .slide-left-enter,.slide-left-leave-to{
    left:-100%;
  }
  .slide-left-enter-to,.slide-left-leave{
    left:0%;
  }
  .slide-left-enter-active,.slide-left-leave-active{
    position: relative;
    transition: all .5s;
  }
</style>
