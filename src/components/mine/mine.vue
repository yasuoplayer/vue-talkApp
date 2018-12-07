<template>
  <div class="mine" v-loading.fullscreen.lock="load">
    <div class="avatar">
      <label for="file" ref="inputLabel" id="inputLabel" :style="info.avatar"></label>
      <input type="file" ref="file" id="file" style="display: none" @change="changeAvatar"/>
    </div>
    <div class="form">
      <el-form label-position="left" label-width="80px" ref="form" :model="info" status-icon :rules="rules">
        <el-form-item label="昵称" prop="user">
          <el-input v-model="info.user" type="text" clearable></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-radio-group v-model="info.sex">
            <el-radio label="man">男</el-radio>
            <el-radio label="woman">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="签名" prop="sign">
          <el-input
            type="textarea"
            :rows="2"
            placeholder="请输入内容"
            v-model="info.sign">
            clear
            resize='none'
          </el-input>
        </el-form-item>
        <div class="bt">
          <el-button type="primary" @click="submitForm">提交</el-button>
          <el-button @click="resetForm" type="reset">重置</el-button>
        </div>
      </el-form>
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
        sign: '',
        avatar: '',
        avatarBase64: ''
      },
      rules: {
        user: [
          { validator: checkUser, trigger: 'blur' }
        ],
        sex: [
          { validator: checkSex, trigger: 'blur' }
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
          const { phone, sex, avatarBase64, user, sign } = this.info
          axios.post('/user/update', { user, sex, avatar: avatarBase64, phone, sign })
            .then((res) => {
              this.$store.commit('setInfo', res.data.data)
              this.$message.success('更新成功')
              this.load = false
            })
        }
      })
    },
    resetForm () {
      this.$refs.form.resetFields()
    },
    changeAvatar (e) {
      if (!e.target.files[0].type == 'image/jpeg') {
        this.$message.error('图片类型只支持jpg格式')
        e.target.value = ''
        return
      }
      if (e.target.files[0].size / 1024 / 1024 > 1) {
        this.$message.error('图片大小不能大于1m')
        e.target.value = ''
        return
      }
      let fr = new FileReader()
      fr.readAsDataURL(e.target.files[0])
      fr.onload = () => {
        this.info.avatarBase64 = fr.result
        this.info.avatar = `background:url('${fr.result}') no-repeat; background-size:60px 60px `
      }
    }
  },
  mounted () {
    this.info.avatarBase64 = this.$store.state.avatar
    this.info.user = this.$store.state.user
    this.info.sex = this.$store.state.sex
    this.info.avatar = `background:url('${this.$store.state.avatar}') no-repeat; background-size:60px`
    this.info.sign = this.$store.state.sign
    this.info.phone = this.$store.state.phone
  }
}
</script>

<style scoped>
  #inputLabel {
    display: block;
    width: 60px;
    height: 60px;
    margin: 10px auto;
  }
  .mine{
    width: 100%;
    height: 100%;
  }
  .gologin a{
    padding: 10px 10px;
  }
  .bt{
    text-align: center;
  }
  .mine{
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
