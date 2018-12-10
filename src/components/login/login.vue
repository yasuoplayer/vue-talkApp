<template>
  <div class="login" v-loading.fullscreen.lock="load">
    <div class="logo">
      <img src="./logo.png">
    </div>
    <div class="loginMsg">
      <el-input
        class="m-bottom"
        prefix-icon="el-icon-view"
        placeholder="请输入手机号"
        v-model="info.phone"
        clearable>
      </el-input>
        <el-input
          class="m-bottom"
          prefix-icon="el-icon-edit"
          placeholder="请输入密码"
          v-model="info.psw"
          type="password"
          clearable>
        </el-input>
      <el-checkbox v-model="info.remember" class="m-bottom">记住账号密码</el-checkbox>
      <el-button type="primary" round class="bt m-bottom" @click="login">登录</el-button>
      <router-link to="/register" >
        <span>没有账号？前去注册</span>
      </router-link>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  data: () => {
    return {
      info: {
        phone: '',
        psw: '',
        remember: ''
      },
      load: false
    }
  },
  mounted () {
    let userinfo = localStorage.getItem('userInfo')
    if (userinfo) {
      userinfo = JSON.parse(userinfo)
      this.info.phone = userinfo.phone
      this.info.psw = userinfo.psw
    }
  },
  methods: {
    login () {
      this.load = true
      let { phone, psw, remember } = this.info
      axios.post('/user/login', { phone, psw })
        .then((res) => {
          if (res.data.code === 0) {
            this.$message.error(res.data.msg)
            this.load = false
            return
          }
          if (remember) {
            const userInfo = {
              phone,
              psw
            }

            localStorage.setItem('userInfo', JSON.stringify(userInfo))
          }
          this.$store.commit('setInfo', res.data.data[0])
          this.load = false
          this.$router.push({ path: '/user/msg' })
        })
    }
  }
}
</script>

<style scoped lang="scss">
  .login{
    height: 100%;
    width: 100%;
    text-align: center;
    display: flex;
    flex-direction: column;
  }
  .login img{
    display: block;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translateX(-50%) translateY(-50%);
  }
  .logo{
    position: relative;
    flex: 7;
  }
  .loginMsg{
    flex: 6;
  }
  .loginMsg{
    padding: 20px 20%;
  }
  .m-bottom{
    margin-bottom: 16px;
  }

  .bt{
    width: 100%;
  }
</style>
