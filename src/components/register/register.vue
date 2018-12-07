<template>
    <div class="register" v-loading.fullscreen.lock="load">
      <div class="header">
        请填写注册信息
      </div>
      <div class="form">
      <el-form label-position="left" label-width="80px" ref="form" :model="info" status-icon :rules="rules">
        <el-form-item label="昵称" prop="user">
          <el-input v-model="info.user" type="text" clearable></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model.number="info.phone" type="number" clearable></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="psw">
          <el-input v-model="info.psw" type="password" clearable></el-input>
        </el-form-item>
        <el-form-item label="重复密码" prop="rpsw">
          <el-input v-model="info.rpsw" type="password" clearable></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-radio-group v-model="info.sex">
            <el-radio label="man">男</el-radio>
            <el-radio label="woman">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <div class="bt">
          <el-button type="primary" @click="submitForm">提交</el-button>
          <el-button @click="resetForm" type="reset">重置</el-button>
        </div>
      </el-form>
    </div>
      <div class="gologin">
        <router-link to="/login">已有账号？前去登录</router-link>
      </div>
    </div>
</template>

<script>
import axios from 'axios'
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
    var checkPass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        if (this.info.psw !== '') {
          this.$refs.form.validateField(['rpsw'])
        }
        if (value.length < 6 || value.length > 12) {
          callback(new Error('密码长度在6-12位之间'))
        } else {
          callback()
        }
      }
    }
    var checkRPass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.info.psw) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
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
        user: '',
        phone: '',
        sex: '',
        psw: '',
        rpsw: ''
      },
      rules: {
        user: [
          { validator: checkUser, trigger: 'blur' }
        ],
        psw: [
          { validator: checkPass, trigger: 'blur' }
        ],
        rpsw: [
          { validator: checkRPass, trigger: 'blur' }
        ],
        sex: [
          { validator: checkSex, trigger: 'blur' }
        ],
        phone: [
          { validator: checkPhone, trigger: 'blur' }
        ]
      },
      load: false
    }
  },
  methods: {
    submitForm () {
      this.$refs.form.validate((boolean, object) => {
        if (boolean) {
          this.load = true
          const { user, psw, phone, sex } = this.info
          axios.post('/user/register', { user, psw, phone, sex })
            .then((res) => {
              this.load = false
              this.$router.push({ path: '/login' })
            })
        }
      })
    },
    resetForm () {
      this.$refs.form.resetFields()
    },
    checkPhone (phone, callback) {
      axios.get('/user/checkphone', { params: { phone } })
        .then((res) => {
          if (res.data.code == 1) {
            callback()
          } else {
            callback(new Error(res.data.msg))
          }
        })
    }
  }
}
</script>

<style scoped>
  .register{
    width: 100%;
    height: 100%;
  }
  .gologin{
    text-align: center;
    margin-top: 10px;
  }
  .gologin a{
    padding: 10px 10px;
  }
  .bt{
    text-align: center;
  }
  .register{
    display: flex;
    flex-direction: column;
  }

  .form{
    padding: 0 10%;
  }
  .header{
    padding: 20px;
    text-align: center;
    color: #fff;
    margin-bottom: 20px;
    background: #409EFF;
  }
</style>
