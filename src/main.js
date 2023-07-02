import './assets/main.css';
import BootstrapVue from 'bootstrap-vue';
import Multiselect from 'vue-multiselect';
import Vue from 'vue';
import VueSweetalert2 from 'vue-sweetalert2';
import Vuelidate from 'vuelidate';
import axios from 'axios';
import App from './App.vue';
import router from './router';
import 'sweetalert2/dist/sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

Vue.use(Vuelidate);
Vue.use(BootstrapVue);
Vue.use(VueSweetalert2);
Vue.config.productionTip = false;

Vue.component('multiselect', Multiselect);

// remove for prod
 axios.defaults.withCredentials = true;
axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFTOKEN';

new Vue({
  router,
  render: (h) => h(App),
}).$mount('#app');
