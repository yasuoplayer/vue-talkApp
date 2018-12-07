<template>
  <div class="info" v-loading.fullscreen.lock="load" v-if="info.sex">
    <div class="avatar">
      <div  ref="inputLabel" id="inputLabel" :style="info.avatar"></div>
    </div>
    <div class="form">
      <el-form label-position="left" label-width="80px" ref="form" :model="info">
        <el-form-item label="昵称" prop="user">
          <el-input v-model="info.user" type="text" clearable disabled></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-radio-group v-model="info.sex" disabled>
            <el-radio label="man">男</el-radio>
            <el-radio label="woman">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="电话" prop="phone" disabled="'true'">
          <el-input v-model="info.from" type="text" clearable disabled></el-input>
        </el-form-item>
        <el-form-item label="分组" prop="group">
          <el-cascader
            :options="options"
            v-model="group"
            @change="selectGroup"
          >
          </el-cascader>
        </el-form-item>
        <el-form-item label="备注信息" prop="msg" >
          <el-input
            aria-disabled="true"
            disabled="true"
            type="textarea"
            :rows="2"
            placeholder="请输入内容"
            v-model="info.msg">
            clear
            resize='none'
          </el-input>
        </el-form-item>
        <div class="bt">
          <el-button type="primary" @click="apply">添加好友</el-button>
          <el-button type="primary" @click="back">返回</el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import vue from 'vue'
export default {
  data () {
    return {
      info: {
        user: '',
        phone: '',
        sex: '',
        avatar: '',
        group: '',
        msg: ''
      },
      load: false,
      options: [{
        value: '亲人',
        label: '亲人'
      },
      {
        value: '同事',
        label: '同事'
      },
      {
        value: '朋友',
        label: '朋友'
      },
      {
        value: '同学',
        label: '同学'
      }]
    }
  },
  methods: {
    selectGroup (value) {
      this.info.group = value[0]
    },
    apply () {
      if (!this.info.group) {
        this.$message.error('请选择分组')
        return
      }
      axios.post('/apply/agress', {
        from: this.info.phone,
        to: this.$store.state.phone,
        group: this.info.group,
        pass: true
      }).then((res) => {
        if (res.data.code == 0) {
          this.$message.error(res.data.msg)
        } else {
          this.$store.state.socket.emit('apply')
          this.$message.success(res.data.msg)
          this.$router.push({ path: '/user/friends' })
        }
      })
    },
    back () {
      this.$router.push({ path: 'add' })
    }
  },
  mounted () {
    this.info = this.$store.getters.getInfo
    const phone = this.info.from
    axios.get('/user/findone', { params: { phone } }).then((res) => {
      if (res.data.code === 1) {
        this.info.user = res.data.data.user
        this.info.avatar = `background:url('${res.data.data.avatar}') no-repeat; background-size:60px`
        this.info.sex = res.data.data.sex
        this.info.phone = res.data.data.phone
        vue.set(this.info, this.info, { phone: res.data.data.phone, sex: res.data.data.sex, user: 'res.data.data.user', avatar: `background:url('${res.data.data.avatar}') no-repeat; background-size:60px` })
      }
    })
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
  .info{
    width: 100%;
    height: 100%;
  }
  .bt{
    text-align: center;
  }
  .info{
    display: flex;
    flex-direction: column;
  }
  .form{
    padding: 0 10%;
  }
</style>
