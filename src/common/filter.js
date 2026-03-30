//vue2.0里 管道符 | 只能用在mousetache和v-bind中
import Vue from 'vue';
import dayjs from 'dayjs';


Vue.filter('dateFmt', function (value, fmt) {
  if (!value) {
    return '';
  }
  return dayjs(value).format(fmt);
});

Vue.filter('dateToFmt', function (value, fromFmt, toFmt) {
  if (!value) {
    return '';
  }
  return dayjs(value, fromFmt).format(toFmt);
});
