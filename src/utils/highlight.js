// highlight.js
import hljs from 'highlight.js';

// 这里引入css
import 'highlight.js/styles/github.css';

const highlight = {};

highlight.install = (Vue) => {
    Vue.directive('highlight', (el) => {
        const blocks = el.querySelectorAll('pre code');
        blocks.forEach((block) => {
            hljs.highlightBlock(block);
        });
    });
};

export default highlight;
