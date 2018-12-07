<template>
  <div id="app">
    <transition :name="transitionName">
    <router-view></router-view>
    </transition>
  </div>
</template>
<script>
export default {
  data: () => {
    return {
      name: 1,
      transitionName: 'slide-left'
    }
  },
  watch: {
    '$route' (to, from) {
      const toDepth = to.path.split('/').length
      const fromDepth = from.path.split('/').length
      this.transitionName = toDepth < fromDepth ? 'slide-right' : 'slide-left'
    }
  }
}
</script>
<style lang="scss">
  #badge{
    width: 100%;
    height: 100%;
    position: relative;
  }
  .el-badge__content.is-fixed{
    top: 12px !important;
    right: 30px !important;
  }
  .el-collapse-item__content{
    padding-bottom: 0 !important;
  }
  .el-input{
    left: -10px;
  }
.el-cascader{
  position: relative !important;
  left: -10px !important;
}
  .el-message{
    width: 100% !important;
    text-align: center;
    min-width:200px !important;
  }
#app {
  width: 100%;
  height: 100%;
  font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
}
html,body{
  margin: 0;
  width: 100%;
  height: 100%;
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
