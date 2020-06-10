// https://99mycql.github.io/application/%E9%80%9A%E8%BF%87highlight%E5%9C%A8vue%E4%B8%AD%E5%AE%9E%E7%8E%B0%E4%BB%A3%E7%A0%81%E9%AB%98%E4%BA%AE.html
// highlight.js  代码高亮指令
import Hljs from 'highlight.js';
import 'highlight.js/styles/tomorrow-night.css'; // 代码高亮风格，选择更多风格需导入 node_modules/hightlight.js/styles/ 目录下其它css文件

let Highlight = {};
// 自定义插件
Highlight.install = function (Vue) {
  // 自定义指令 v-highlight
  Vue.directive('highlight', {
    // 被绑定元素插入父节点时调用
    inserted: function(el) {
      let blocks = el.querySelectorAll('pre code');
      for (let i = 0; i < blocks.length; i++) {
        Hljs.highlightBlock(blocks[i]);
      }
    },
    // 指令所在组件的 VNode 及其子 VNode 全部更新后调用
    componentUpdated: function(el) {
      let blocks = el.querySelectorAll('pre code');
      for (let i = 0; i < blocks.length; i++) {
        Hljs.highlightBlock(blocks[i]);
      }
    }
  })
};

export default Highlight;