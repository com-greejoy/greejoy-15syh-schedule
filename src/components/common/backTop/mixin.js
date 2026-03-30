/*
READEME:

1、在父组件中引入mixin
import {backTopMixin} from 'comps/common/backTop/mixin';
2、在父组件中options配置mixins
mixins: [backTopMixin]
3、在父组件中使用back-top
<back-top v-if="isShowBackTop" @click.native="backClick"></back-top>

 */

import BackTop from 'comps/common/backTop/BackTop';

export const backTopMixin = {
  components: {
    BackTop
  },
  data() {
    return {
      isShowBackTop: false,
      showPosition: 400
    }
  },
  methods: {
    backClick() {
      let top = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
      // 实现滚动效果
      const timeTop = setInterval(() => {
        document.body.scrollTop = document.documentElement.scrollTop = top -= 50;
        if (top <= 0) {
          clearInterval(timeTop);
        }
      }, 10);
    },
    handleScroll() {
      //注意不同浏览器之间的兼容性
      let scrollPosition = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
      if (scrollPosition > this.showPosition) {
        this.isShowBackTop = true;
      } else {
        this.isShowBackTop = false
      }
    },
  },
  mounted() {
    window.addEventListener("scroll", this.handleScroll);
  },
  destroyed() {
    window.removeEventListener('scroll', this.handleScroll);
  }
}
