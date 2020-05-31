import Vue from 'vue'
import VuePusher from 'vue-pusher'
Vue.use(VuePusher, {
  api_key: process.env.PUSHER_API_KEY,
  options: {
    cluster: 'us2',
    encrypted: true,
  }
})
