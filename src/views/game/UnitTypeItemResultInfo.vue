<template>
  <div
    class="unitType-item-result-info"
    v-loading="loading"
    element-loading-spinner="el-icon-loading"
  >
    <div v-for="(i, idx) in dataList">
      <el-collapse class="item-collapse">
        <el-collapse-item
          :title="i.itemStr"
          :name="i.itemStr"
          @click.native="handleItemClick(i, idx)"
        >
          <template slot="title">
            <div class="title">
              <img class="item-icon icon" :src="i.itemIcon" />
              <img class="item-icon icon2" :src="i.itemIcon2" />
              <div class="result-info">
                <div class="item-name">{{ i.itemStr }}</div>
                <div class="item-medal">
                  <span class="medal"
                    ><img src="~assets/img/game/1st.png" />{{
                      i.goldCount
                    }}金</span
                  >
                  <span class="medal"
                    ><img src="~assets/img/game/2nd.png" />{{
                      i.silverCount
                    }}银</span
                  >
                  <span class="medal"
                    ><img src="~assets/img/game/3rd.png" />{{
                      i.bronzeCount
                    }}铜</span
                  >
                </div>
              </div>
            </div>
          </template>
          <div
            style="min-height: 40px"
            v-loading="!i.resultList.length"
            element-loading-spinner="el-icon-loading"
          >
            <el-collapse class="race-collapse" v-for="r in i.resultList">
              <el-collapse-item
                :title="r.raceName"
                :name="r.id"
                @click.native="handleRaceClick()"
              >
                <template slot="title">
                  <div class="head">
                    <div class="race-name">{{ r.raceName }}</div>
                    <div class="race-medal">
                      <el-tooltip effect="dark" placement="top">
                        <div slot="content">
                          <div>奖牌：{{ r.medal }}</div>
                          <div v-if="r.extra && r.extra.extraMedal > 0">
                            超破：{{ r.extra ? r.extra.extraMedal : 0 }}
                          </div>
                        </div>
                        <span>
                          <medal-img
                            :order-index="r.orderIndex"
                            :medal-type="r.medalType"
                            :show-order-index="false"
                          />
                        </span>
                      </el-tooltip>
                    </div>
                  </div>
                </template>
                <div class="sporter-list">
                  <div
                    class="sporter-info"
                    v-for="sp in r.sporterList"
                    @click="toSporterInfo(sp)"
                  >
                    <el-image
                      v-if="sp.photo"
                      class="photo"
                      :src="sp.photo"
                      fit="cover"
                      :lazy="true"
                    />
                    <img
                      v-else
                      class="photo"
                      src="~assets/img/game/default_profile.png"
                    />
                    <ul class="info">
                      <li>{{ sp.name }}</li>
                      <li>{{ sexFormat(sp.sex) }}</li>
                    </ul>
                  </div>
                </div>
              </el-collapse-item>
            </el-collapse>
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>
  </div>
</template>

<script>
import MedalImg from "views/components/MedalImg";
import { listResult } from "network/game/result";
import { listItem } from "network/game/item";
import { calItemMedal } from "network/game/cal";

export default {
  name: "UnitTypeItemResultInfo",
  components: {
    MedalImg,
  },
  data() {
    return {
      sexOptions: [],
      loading: false,
      unitTypeId: null,
      dataList: [],
    };
  },
  computed: {},
  created() {
    this.$emit("loadActiveTab", "itemResult");
    this.unitTypeId = this.$route.params.unitTypeId || null;
    this.getDataList();
    this.getDicts("gm_person_sex").then((response) => {
      this.sexOptions = response.data;
    });
  },
  methods: {
    sexFormat(sex) {
      return this.selectDictLabel(this.sexOptions, sex);
    },
    getDataList() {
      this.loading = true;
      listItem({
        gameId: this.$store.getters.game.id,
        categoryId: this.$store.getters.categoryId,
        orderByColumn: "i.orderNum",
        isAsc: "asc",
      }).then((resp) => {
        const items = resp.rows;
        calItemMedal({
          gameId: this.$store.getters.game.id,
          categoryId: this.$store.getters.categoryId,
          unitTypeId: this.unitTypeId,
        }).then((res) => {
          res.data.forEach((i) => {
            //注入
            //result
            i.resultList = [];
            //icon
            const find = items.find((v) => v.name === i.itemStr);
            i.itemIcon = find ? find.icon : "";
            i.itemIcon2 = find ? find.icon2 : "";
          });
          this.dataList = res.data;
          this.loading = false;
        });
      });
    },
    toSporterInfo(sp) {
      this.$router.push(`/game/sporter/${sp.categoryId}/${sp.sporterId}`);
    },
    handleItemClick(item, index) {
      if (this.dataList[index] && !this.dataList[index].resultList.length) {
        listResult({
          gameId: this.$store.getters.game.id,
          categoryId: this.$store.getters.categoryId,
          slaveItemId: item.slaveItemId,
          unitTypeId: this.unitTypeId,
          orderIndexStart: 1,
          orderIndexEnd: 3,
        }).then((res) => {
          this.dataList[index].resultList = res.rows;
        });
      }
    },
    handleRaceClick() {
      //滚动当前页面高度，触发图片加载
      const curH = window.pageYOffset;
      window.scrollTo(0, curH + 1);
      window.scrollTo(0, curH - 1);
    },
  },
};
</script>

<style lang="less" scoped>
/deep/ .item-collapse .el-collapse-item__header.is-active {
  background-color: @t-color-m1;
  .item-icon {
    &.icon {
      display: none !important;
    }
    &.icon2 {
      display: block !important;
    }
  }
  .result-info {
    color: #fff !important;
  }
}

/deep/ .race-collapse .el-collapse-item__header:hover {
  background-color: #e7f2fa;
}

/deep/ .race-collapse .el-collapse-item__header.is-active {
  background-color: #e7f2fa;
}

.unitType-item-result-info {
  .item-collapse {
    margin-top: -1px;

    .title {
      height: 100%;
      display: flex;
      align-items: center;

      .item-icon {
        width: 50px;
        height: 50px;
        margin-left: 20px;
        margin-right: 20px;
        &.icon {
          display: block;
        }
        &.icon2 {
          display: none;
        }
      }

      .result-info {
        flex-grow: 1;
        @h: 60px;
        height: @h;
        font-size: 18px;
        text-align: left;
        color: @t-color-m1;

        div {
          height: @h / 2;
          line-height: @h / 2;
        }

        .item-medal {
          display: flex;
          font-size: 16px;

          .medal {
            display: flex;
            align-items: center;
            margin-right: 10px;

            img {
              width: 18px;
              height: 18px;
            }
          }
        }
      }
    }
  }

  .race-collapse {
    margin-top: -1px;

    .head {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;

      .race-name {
        margin-left: 90px;
      }

      .race-medal {
        display: flex;
        align-items: center;
        font-size: 16px;

        /deep/ img {
          width: 14px;
          height: 14px;
        }
      }
    }

    .sporter-list {
      display: flex;
      flex-wrap: wrap;
      margin-left: 90px;

      .sporter-info {
        margin-top: 10px;
        margin-right: 8px;
        margin-bottom: 25px;
        background-color: #e7f2fa;
        box-sizing: border-box;
        padding: 8px;
        border-radius: 4px;
        &:hover {
          cursor: pointer;
          background-color: @t-color-m1;
          color: #fff;
        }
        .photo {
          @w: 80px;
          width: @w;
          height: @w*1.5;
          object-fit: cover;
          border-radius: 2px;
        }
        .info {
          display: flex;
          justify-content: space-between;
          font-size: 14px;
          line-height: 22px;
        }
      }
    }
  }
}
</style>
<style lang="less">
.item-collapse {
  .el-collapse-item__header {
    @h: 80px;
    height: @h;
    line-height: @h;
  }
  .race-collapse {
    .el-collapse-item__header {
      @h: 40px;
      height: @h;
      line-height: @h;
    }
  }
}
</style>
