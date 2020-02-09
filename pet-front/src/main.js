import Vue from 'vue';
import './plugins/vuetify';
import App from './App.vue';
import store from './store';
import router from './router';
import 'babel-polyfill';
import './registerServiceWorker';
import VueI18n from 'vue-i18n';
import VeeValidate from 'vee-validate';
import Croppa from 'vue-croppa';
import VueLodash from 'vue-lodash';
import AsyncComputed from 'vue-async-computed';
import moment from 'vue-moment';
import Cookies from 'js-cookie';
import VDateRange from 'vuetify-daterange-picker';
import 'vuetify-daterange-picker/dist/vuetify-daterange-picker.css';
import VueToast from 'vue-toast-notification';
import 'vue-toast-notification/dist/index.css';

Vue.config.productionTip = false;

Vue.use(VueLodash);
Vue.use(VueI18n);
Vue.use(AsyncComputed);
Vue.use(moment);
Vue.use(VueToast, {position:'bottom-right'});

const veeConf = {
    events: '',
};

Vue.use(VeeValidate, veeConf);
Vue.use(Croppa);

Vue.use(VDateRange);

import lang from './lang/index';

const i18n = new VueI18n({
    locale: (Cookies.get('lang')) ? Cookies.get('lang') : 'eng',
    messages: lang
});

Vue.filter('phoneMask', function (value) {
    if (value) {
        return '+' + value.substr(0, 2) + ' (' + value.substr(2, 3) + ') ' + value.substr(5, 3) + ' - ' + value.substr(8, 4)
    }
    else {
        return ''
    }
});

new Vue({
    router,
    store,
    i18n,
    render: h => h(App)
}).$mount('#app');


