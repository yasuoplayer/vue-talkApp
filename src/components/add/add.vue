<template>
  <!--<div class="register" v-loading.fullscreen.lock="load">-->
  <el-tabs type="border-card">
    <el-tab-pane label="查找好友" v-loading.fullscreen.lock="load">
      <div class="form">
        <el-form label-position="left" label-width="80px" ref="form" :model="info" status-icon :rules="rules">
          <el-form-item label="昵称" prop="user">
            <el-input v-model="info.user" type="text" clearable></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="phone">
            <el-input v-model="info.phone" type="text" clearable></el-input>
          </el-form-item>
          <el-form-item label="性别" prop="sex">
            <el-radio-group v-model="info.sex">
              <el-radio label="man">男</el-radio>
              <el-radio label="woman">女</el-radio>
            </el-radio-group>
          </el-form-item>
          <div class="bt">
            <el-button type="primary" @click="search">查找</el-button>
            <el-button @click="resetForm" type="reset">重置</el-button>
          </div>
        </el-form>
      </div>
    </el-tab-pane>
    <el-tab-pane label="好友申请">
      <div class="sBOX">
        <div class="sbox">
          <div class="clearfix item" v-if="list&&list.length" v-for="(item) in list"
               @click="showInfo(item)"
          >
            <img src="../login/logo.png" class="avatar">
            <div class="msgContent">
              <div class="sign">{{item.msg}}</div>
              <div class="user">{{item.from}}</div>
            </div>
          </div>
        </div>
      </div>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import axios from 'axios'
import findone from '../findOne/findOne'
import Bscroll from 'better-scroll'
export default {
  data () {
    var checkUser = (rule, value, callback) => {
      if (value === '') {
        return callback(new Error('用户名不能为空'))
      } else {
        if (value.length < 6 || value.length > 12) {
          callback(new Error('用户名长度在6-12位之间'))
        } else {
          callback()
        }
      }
    }
    var checkPhone = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入手机号码'))
      } else {
        var reg = new RegExp(/^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/)
        if (!reg.test(value)) {
          callback(new Error('请输入正确手机号码格式'))
        } else {
          this.checkPhone(value, callback)
        }
      }
    }
    var checkSex = (rule, value, callback) => {
      if (value === '') {
        return callback(new Error('请选择性别'))
      } else {
        return callback()
      }
    }
    return {
      info: {
        sex: '',
        user: '',
        phone: '',
        group: '',
        msg: ''
      },
      load: false,
      rules: {
        user: [
          { validator: checkUser, trigger: 'blur' }
        ],
        sex: [
          { validator: checkSex, trigger: 'blur' }
        ],
        phone: [
          { validator: checkPhone, trigger: 'blur' }
        ]
      }
    }
  },
  components: {
    findone
  },
  computed: {
    list () {
      return this.$store.state.applylist
    }
  },
  mounted () {
    const phone = this.$store.state.phone
    axios.get('/apply/findapply', { params: {
        phone
      } }).then((res) => {
      this.$store.commit('setApplyList', res.data)
    })
  },
  methods: {
    search () {
      this.$refs.form.validate((boolean, object) => {
        if (boolean) {
          this.load = true
          const { user, phone, sex } = this.info
          axios.post('/user/find', { user, phone, sex })
            .then((res) => {
              if (res.data.code == 1) {
                this.$store.commit('setSearch', res.data.data)
                this.load = false
                this.$router.push({ path: '/user/findone' })
              } else {
                this.$message.error(res.data.msg)
                this.load = false
              }
            })
        }
      })
    },
    resetForm () {
      this.$refs.form.resetFields()
    },
    showInfo (item) {
      this.load = true
      this.$store.commit('setApplyMsg', item)
      this.load = false
      this.$router.push({ path: '/user/applymsg' })
    },
    checkPhone (phone, callback) {
      axios.get('/user/checkphone', { params: { phone } })
        .then((res) => {
          if (res.data.code == 0) {
            callback()
          } else {
            callback(new Error('账号不存在'))
          }
        })
    }
  }
}
</script>

<style >
  .el-tab-pane{
    width: 100%;
    height: 100%;
  }
  .sbox{
    width: 100%;
    position: relative;
  }
  .sBOX
  {
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
  .el-message-box{
    width: 100% !important;
    height: 100% !important;
  }
  .el-tabs{
    width: 100%;
    height: 100%;
    display: flex !important;
    flex-direction: column !important;
  }
  .el-tabs__content{
    flex: 1 !important;
  }
  .el-cascader-menu{
   height: 140px !important;
  }
  .bt{
    text-align: center;
  }
  .user{
    color: #909399;
    text-indent: 10px;
  }
  .msgContent{
    flex: 1;
    overflow: hidden;
  }
  .item{
    display: flex;
    margin: 0 auto !important;
    width: 100%;
    overflow: hidden;
    padding-top: 16px;
    box-sizing: border-box;
    box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
  }
  img.avatar{
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
