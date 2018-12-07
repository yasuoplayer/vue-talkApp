import Vue from 'vue'
import Router from 'vue-router'
import login from './components/login/login'
import register from './components/register/register'
import user from './components/user/user'
import msg from './components/msg/msg'
import friends from './components/friends/friends'
import mine from './components/mine/mine'
import add from './components/add/add'
import findone from './components/findOne/findOne'
import info from './components/info/info'
import talk from './components/talk/talk'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/login',
      component: login
    },
    {
      path: '/register',
      component: register
    },
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/user',
      component: user,
      children: [
        { path: 'msg', component: msg },
        { path: 'friends', component: friends },
        { path: 'mine', component: mine },
        { path: 'add', component: add },
        { path: 'findone', component: findone },
        { path: 'applymsg', component: info },
        { path: 'talk', component: talk }
      ]
    }
  ]
})
