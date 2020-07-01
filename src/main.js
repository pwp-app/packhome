import Vue from 'vue';
import App from './App.vue';
import router from './router';
import VueAxios from 'vue-axios';
import axios from 'axios';
import highlight from './utils/highlight';
import './plugins/element.js';
import './styles/main.less';

Vue.config.productionTip = false

Vue.use(VueAxios, axios);
Vue.use(highlight);

Vue.directive('title', {
    inserted: (el, binding) => {
        document.title = binding.value;
    }
});

new Vue({
    router,
    render: h => h(App)
}).$mount('#app')