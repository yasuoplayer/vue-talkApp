<template>
  <div class="scrollWrap">
    <div class="scrollBox">
      <div class="clearfix item" v-for="(item , index) in list" v-if="list.length" @click="talk(item)">
        <img :src="item.avatar">
        <div class="msgContent">
          <div class="content">{{item.content}}<div class="bg" v-if="item.number">{{item.number}}</div></div>
          <span class="user">{{item.user}}</span>
          <span class="time">{{item.time}}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BScroll from 'better-scroll'
import axios from 'axios'
export default {
  data () {
    return {
      scroll: '',
      list: ''
    }
  },
  computed: {
    chatList () {
      return this.$store.state.chatList
    }
  },
  watch: {
    chatList () {
      this.findList()
    }
  },
  methods: {
    talk (item) {
      this.load = true
      const phone = this.$store.state.phone
      axios.get('/chat/all', { params: {
        phone
      } }).then(res => {
        this.load = false
        this.$store.commit('setChatList', res.data)
        this.$store.commit('setTalkTo', item)
        this.$router.push({ path: '/user/talk' })
      })
    },
    findList () {
      let list = this.$store.state.chatList
      var arr = []
      for (var n = 0; n < list.length; n++) {
        let phone = list[n].phone
        let list1 = list[n].list
        let number = 0
        for (var j = 0; j < list1.length; j++) {
          if (!list1[j].read) {
            number++
          }
        }
        let last = list[n].list[list[n].list.length - 1]
        let content = last.content
        let time = last.time
        let avatar
        let user
        if (phone == last.tphone) {
          avatar = last.tavatar
          user = last.tuser
        } else {
          avatar = last.favatar
          user = last.fuser
        }
        let item = {
          phone,
          content,
          avatar,
          time,
          user,
          number
        }
        arr.push(item)
      }
      this.list = arr
      let scroll = new BScroll('.scrollWrap', {
        scrollY: true,
        click: true
      })
      this.scroll = scroll
    }
  },
  mounted () {
    this.findList()
  }
}
</script>

<style scoped>
  .bg{
    position: absolute;
    left:5px;
    background-color: #f56c6c;
    border-radius: 10px;
    color: #fff;
    display: inline-block;
    font-size: 12px;
    height: 18px;
    line-height: 18px;
    padding: 0 6px;
    text-align: center;
    white-space: nowrap;
    border: 1px solid #fff;
  }
  .scrollWrap{
    height: 100%;
    overflow: hidden;
  }
  .scrollBox{
    position: relative;
  }
  .msgContent{
    flex: 1;
    overflow: hidden;
  }
  .msgContent>div{
    width: 100%;
    height: 20px;
    line-height: 20px;
  }
  .time{
    color: #909399;
    text-align: right;
    float: right;
  }
  .user{
    text-indent: 10px;
    float: left;
  }
  .item{
    position: relative;
    display: flex;
    margin: 0 auto !important;
    width: 100%;
    overflow: hidden;
    padding: 16px 10%;
    box-sizing: border-box;
    box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
  }
  img{
    display: block;
    width: 40px ;
    height: 40px;
  }
  .content{
    text-indent: 10px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: #303133;
    height: 100%;
  }
</style>
