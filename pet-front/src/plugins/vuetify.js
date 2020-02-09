import Vue from 'vue'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import '@/plugins/app.css'

Vue.use(Vuetify, {
  customProperties: true,
  iconfont: 'md',
  theme: {
    primary: '#FF3D00',
    secondary: '#00E676'
  },
})
