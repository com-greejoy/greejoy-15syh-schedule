import router from './index';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import store from '@/store';

NProgress.configure({showSpinner: false});

const whiteList = ['/bind'];

router.beforeEach((to, from, next) => {
  NProgress.start();
  if (store.getters.game.id > 0 && store.getters.categoryId > 0) {
    next();
  }
  else {
    // 在免登录白名单，直接进入
    if (whiteList.indexOf(to.path) !== -1) {
      next();
    } else {
      //编码，使&等带参符号可用
      const fullPath = encodeURIComponent(to.fullPath);
      next(`/bind?redirect=${fullPath}`); // 否则全部重定向到绑定页
      NProgress.done();
    }
  }
});

router.afterEach(() => {
  NProgress.done()
});
