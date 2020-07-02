import Vue from 'vue';
import App from './App.vue';
import router from './router';
import VueAxios from 'vue-axios';
import axios from 'axios';
import './plugins/element.js';
import './styles/main.less';

Vue.config.productionTip = false;

Vue.use(VueAxios, axios);

Vue.directive('title', {
    inserted: (el, binding) => {
        document.title = binding.value;
    },
});

Vue.directive('highlight', {
    inserted: (el, binding) => {
        const blocks = el.querySelectorAll('pre code');
        blocks.forEach((block) => {
            hljs.highlightBlock(block);
        });
    },
});

new Vue({
    router,
    render: (h) => h(App),
}).$mount('#app');
