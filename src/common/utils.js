/*
获取链接中的参数值
 */
export const getQueryString = (name) => {
  let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
  let r = window.location.search.substr(1).match(reg);
  if (r != null) {
    return decodeURI(r[2]);
  } else {
    return null;
  }
}

/*
防抖函数
 */
export function debounce(func, delay) {
  let timer = null;
  return function (...args) {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}

/*
回显数据字典
 */
export function selectDictLabel(datas, value) {
  var actions = [];
  Object.keys(datas).some((key) => {
    if (datas[key].dictValue == ('' + value)) {
      actions.push(datas[key].dictLabel);
      return true;
    }
  })
  return actions.join('');
}

//裁判排序
export function sortJudgeByLevel(arr) {
  const typeOrder = [
    '比赛监督',
    '竞赛监督',
    '竞赛官员',
    '仲裁委员',
    '仲裁人员',
    '仲裁主任',
    '仲裁',
    '总裁判长',
    '裁判长',
    '主裁判',
    '技术代表',
    '副总裁判长',
    '副裁判长',
    '编排长',
    '编排员',
    '裁判员',
    '候补裁判员',
    '播报裁判',
    '电子裁判员',
    '计时计分',
    '其他'
  ];
  typeOrder.reverse();
  arr.forEach(j => {
    j.typeIndex = typeOrder.indexOf(j.type);
  });
  arr.sort((a, b) => {
    return a.typeIndex > b.typeIndex ? -1 : (a.typeIndex < b.typeIndex ? 1 : 0);
  });
  return arr;
}

//市州行政排序
export function sortUnitTypeByOrder(arr) {
  //成都、自贡、攀枝花、泸州、德阳、绵阳、广元、遂宁、内江、乐山、南充、宜宾、广安、
  //达州、巴中、雅安、眉山、资阳、阿坝、甘孜、凉山
  const unitTypeOrder = [
    '成都',
    '自贡',
    '攀枝花',
    '泸州',
    '德阳',
    '绵阳',
    '广元',
    '遂宁',
    '内江',
    '乐山',
    '南充',
    '宜宾',
    '广安',
    '达州',
    '巴中',
    '雅安',
    '眉山',
    '资阳',
    '阿坝',
    '甘孜',
    '凉山'
  ];
  unitTypeOrder.reverse();
  arr.forEach(u => {
    u.typeIndex = unitTypeOrder.indexOf(u.name);
  });
  arr.sort((a, b) => {
    return a.typeIndex > b.typeIndex ? -1 : (a.typeIndex < b.typeIndex ? 1 : 0);
  });
  return arr;
}
