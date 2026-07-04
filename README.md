# gtip-vuecli
- node 16.20.1
- npm 8.19.4

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

## 特殊说明
`src/views/game/ItemView.vue` 对 `/game/item` 项目列表做了特殊拆分：
- `足球` 拆为 `足球` + `八人足球`
- `轮滑冰球(女子冰球)` 拆为 `轮滑冰球` + `女子冰球`

拆分后第二个项目的 `orderNum` 在原值基础上 +1，其余属性保持不变。
