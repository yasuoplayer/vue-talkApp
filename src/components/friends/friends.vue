<template>
    <div class="friends" v-loading.fullscreen.lock="load">
      <el-collapse v-model="activeName" accordion v-if="friends&&friends.length">
        <el-collapse-item name="1" v-if="friends3.length">
          <template slot="title">
            同学
          </template>
          <div class="clearfix item" v-for="(item,index) in friends3" v-key="index"
          @click="talk(item)">
            <img :src="item.avatar">
            <div class="msgContent">
              <div class="user">{{item.user}}</div>
              <div class="sign">{{item.sign?item.sign:''}}</div>
            </div>
          </div>
        </el-collapse-item>
        <el-collapse-item name="2" v-if="friends0.length">
          <template slot="title">
            亲人
          </template>
          <div class="clearfix item" v-for="(item,index) in friends0" v-key="index"  @click="talk(item)">
            <img :src="item.avatar">
            <div class="msgContent">
              <div class="user">{{item.user}}</div>
              <div class="sign">{{item.sign?item.sign:''}}</div>
            </div>
          </div>
        </el-collapse-item>
        <el-collapse-item name="3" v-if="friends1.length">
          <template slot="title">
            朋友
          </template>
          <div class="clearfix item" v-for="(item,index) in friends1" v-key="index"  @click="talk(item)">
            <img :src="item.avatar">
            <div class="msgContent">
              <div class="user">{{item.user}}</div>
              <div class="sign">{{item.sign?item.sign:''}}</div>
            </div>
          </div>
        </el-collapse-item>
        <el-collapse-item name="4" v-if="friends2.length">
          <template slot="title">
            同事
          </template>
          <div class="clearfix item" v-for="(item,index) in friends2" v-key="index"  @click="talk(item)">
            <img :src="item.avatar">
            <div class="msgContent">
              <div class="user">{{item.user}}</div>
              <div class="sign">{{item.sign?item.sign:''}}</div>
            </div>
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>
</template>

<script>
import axios from 'axios'
export default {
  data () {
    return {
      activeName: 1,
      phone: '',
      friends0: '',
      friends1: '',
      friends2: '',
      friends3: '',
      load: false
    }
  },
  computed: {
    friends () {
      return this.$store.state.friends
    }
  },
  watch: {
    friends (n) {
      this.friends0 = n[0].member
      this.friends1 = n[1].member
      this.friends2 = n[2].member
      this.friends3 = n[3].member
    }
  },
  mounted () {
    let phone = this.$store.state.phone
    axios.get('/user/getfriends', { params: { phone } })
      .then((res) => {
        this.$store.commit('setFriends', res.data)
      })
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
    }
  }
}
</script>

<style scoped>
.friends{
  box-sizing: border-box;
  padding: 0 10%;
  width: 100%;
  height: 100%;
}  .msgContent{
     flex: 1;
     overflow: hidden;
   }
.msgContent>div{
  width: 100%;
  height: 20px;
  line-height: 20px;
}
.user{
  color: #909399;
  text-indent: 10px;
}
.item{
  display: flex;
  margin: 0 auto !important;
  width: 100%;
  overflow: hidden;
  padding-top: 8px;
  box-sizing: border-box;
}
img{
  display: block;
  width: 40px ;
  height: 40px;
}
.sign{
  text-indent: 10px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: #303133;
  height: 20px;
}
</style>
