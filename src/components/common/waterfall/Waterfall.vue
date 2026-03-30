<template>
  <div class="waterfall" :style="{marginLeft: '-' + spaceBetween}">
    <div v-for="n in colsNumber" class="waterfall-col" :class="'col' + (n-1)" :style="{marginLeft: spaceBetween}">
      <div class="waterfall-item" v-for="item in colsData['col' + (n-1)].data">
        <img :src="item.img" :alt="item.title" @load="imgLoad">
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "Waterfall",
    props: {
      colsNumber: {
        type: Number,
        default: 2
      },
      spaceBetween: {
        type: String,
        default: '4px'
      }
    },
    data() {
      return {
        colsData: {},
        colsH: []
      }
    },
    methods: {
      //初始化列数据
      init(colsNumber) {
        for (let i = 0; i < colsNumber; i++) {
          const colName = 'col' + i;
          this.$set(this.colsData, colName, {
            data: []
          });
          this.colsH.push(0);
        }
      },
      clear() {
        this.colsData = {};
        this.colsH = [];
        this.init(this.colsNumber);
      },
      loading(items) {
        items.forEach((v, i) => {
          this.loadImg(v.img).then((vh) => {
            //找到最小
            let min = Math.min.apply(null, this.colsH);
            let minIndex = this.colsH.indexOf(min);
            this.colsH[minIndex] += vh;
            //为最小的数组增加数据
            let minKey = 'col' + minIndex;
            this.colsData[minKey].data.push(v);
          });
        })
      },
      async loadImg(imgUrl) {
        let divs = document.getElementsByClassName('waterfall-col');
        //await 保证图片同步加载，避免获取最低高度时因为异步而查找错误
        return await new Promise((resolve, reject) => {
          let img = new Image();
          img.src = imgUrl;
          img.onload = () => {
            if (divs.length) {
              let div = divs[0];
              let realWidth = img.width;
              let realHeight = img.height;
              let viewWidth = div.offsetWidth;
              let rate = realWidth / viewWidth;
              let viewHeight = realHeight / rate;
              resolve(viewHeight);
            }
          }
        })
      },
      imgLoad() {
        this.$emit('waterfallImgLoad');
      }

    },
    created() {
      this.init(this.colsNumber);
    }
  }
</script>

<style lang="less" scoped>

  .waterfall {
    display: flex;
    justify-content: space-between;

    .waterfall-col {
      flex: 1;
      min-width: 0px;

      .waterfall-item {

        img {
          width: 100%;
        }
      }

    }

  }

</style>
