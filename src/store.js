import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: '',
    sex: '',
    friends: '',
    chatList: '',
    avatar: '',
    phone: '',
    sign: '',
    search: {
      avatar: '',
      phone: '',
      user: '',
      sex: ''
    },
    applylist: [],
    info: {},
    talkto: '',
    socket: '',
    number: '',
    apply: ''
  },
  getters: {
    getSearch (state) {
      return state.search
    },
    getInfo (state) {
      return state.info
    }
  },
  mutations: {
    setInfo (state, { user, sex, avatar, phone, sign }) {
      state.user = user
      state.sex = sex
      state.avatar = avatar
      state.phone = phone
      state.sign = sign
    },
    setSearch (state, { avatar, phone, user, sex, sign }) {
      state.search.user = user
      state.search.sex = sex
      state.search.avatar = avatar
      state.search.phone = phone
      state.search.sign = sign
    },
    setApplyList (state, list) {
      state.apply = list.length
      state.applylist = list
    },
    setApplyMsg (state, obj) {
      state.info = obj
    },
    setFriends (state, arr) {
      state.friends = arr
    },
    setChatList (state, list) {
      var arr = []
      for (var n = 0; n < list.length; n++) {
        if (list[n].fphone == state.phone || list[n].tphone == state.phone) {
          if (list[n].fphone == state.phone) // 本客户是信息来源
          {
            let find = false
            for (var j = 0; j < arr.length; j++) { // 判断是否有分组
              if (arr[j] && arr[j].phone == list[n].tphone) {
                arr[j].list.push(list[n])
                find = true
                break
              }
            }
            if (!find) {
              var obj = {
                phone: list[n].tphone,
                list: []
              }
              obj.list.push(list[n])
              arr.push(obj)
            }
          }
          if (list[n].tphone == state.phone) // 本客户是信息目标
          {
            let find = false
            for (var j = 0; j < arr.length; j++) { // 判断是否有分组
              if (arr[j] && arr[j].phone == list[n].fphone) {
                arr[j].list.push(list[n])
                find = true
                break
              }
            }
            if (!find) {
              var obj1 = {
                phone: list[n].fphone,
                list: []
              }
              obj1.list.push(list[n])
              arr.push(obj1)
            }
          }
        }
      }
      state.chatList = arr
    },
    setTalkTo (state, person) {
      state.talkto = person
    },
    setSocket (state, socket) {
      state.socket = socket
    },
    setNumber (state, number) {
      state.number = number
    }
  }
})
