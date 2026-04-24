import Vue from 'vue'
import VueRouter from 'vue-router'

const BindView = () => import('views/game/BindView');
const ScrollTotalSchedule = () => import('views/schedule/ScrollTotalSchedule');
const DailySchedule = () => import('views/schedule/DailySchedule');
const ItemSchedule = () => import('views/schedule/ItemSchedule');
const ExtraRecord = () => import('views/result/ExtraRecord');
const MedalTally = () => import('views/result/MedalTally');
const MainMedal = () => import('views/result/medal/main/MainMedal');
const MainItemMedal = () => import('views/result/medal/main/MainItemMedal');
const ItemMedal = () => import('views/result/medal/main/ItemMedal');
const RaceMedal = () => import('views/result/medal/main/RaceMedal');
const MainScore = () => import('views/result/medal/score/MainScore');
const ItemScore = () => import('views/result/medal/score/ItemScore');
const CompeteMedal = () => import('views/result/medal/compete/CompeteMedal');
const CompeteDetailMedal = () => import('views/result/medal/compete/CompeteDetailMedal');
const EducateMedal = () => import('views/result/medal/educate/EducateMedal');
const EducateDetailMedal = () => import('views/result/medal/educate/EducateDetailMedal');
const JudgeView = () => import('views/game/JudgeView');
const JudgeShowView = () => import('views/game/JudgeShowView');
const SporterView = () => import('views/game/SporterView');
const SporterInfo = () => import('views/game/SporterInfo');
const UnitTypeView = () => import('views/game/UnitTypeView');
const UnitTypeInfo = () => import('views/game/UnitTypeInfo');
const UnitTypeItemResultInfo = () => import('views/game/UnitTypeItemResultInfo');
const UnitTypeSporterInfo = () => import('views/game/UnitTypeSporterInfo');
const ItemView = () => import('views/game/ItemView');
const ItemInfo = () => import('views/game/ItemInfo');
const GameRule = () => import('views/game/GameRule');
const SheetView = () => import('views/game/SheetView');
const HonorView = () => import('views/game/HonorView');

Vue.use(VueRouter)

const routes = [
  {
    path: '/bind',
    name: 'BindView',
    component: BindView
  },
  {
    path: '/',
    redirect: { name: 'GameRule' }
  },
  {
    path: '/schedule/total',
    name: 'ScrollTotalSchedule',
    component: ScrollTotalSchedule
  },
  {
    path: '/schedule/daily',
    name: 'DailySchedule',
    component: DailySchedule
  },
  {
    path: '/schedule/item',
    name: 'ItemSchedule',
    component: ItemSchedule
  },
  {
    path: '/schedule/item/:itemId',
    name: 'ItemSchedule',
    component: ItemSchedule
  },
  {
    path: '/schedule/item/:itemId/:raceId',
    name: 'ItemSchedule',
    component: ItemSchedule
  },
  {
    path: '/result/extra',
    name: 'ExtraRecord',
    component: ExtraRecord
  },
  {
    path: '/result/medal',
    name: 'MedalTally',
    component: MedalTally,
    children: [
      {
        path: '',
        component: MainMedal
      },
      {
        path: 'main',
        component: MainMedal
      },
      {
        path: 'main/item/:itemId',
        component: MainItemMedal
      },
      {
        path: 'main/item/unitType/:unitTypeId',
        component: ItemMedal
      },
      // {
      //   path: 'score',
      //   component: MainScore
      // },
      // {
      //   path: 'score/item/unitType/:unitTypeId',
      //   component: ItemScore
      // },
      {
        path: 'race',
        component: RaceMedal
      },
      {
        path: 'compete',
        component: CompeteMedal
      },
      {
        path: 'compete/detail',
        component: CompeteDetailMedal
      },
      {
        path: 'educate',
        component: EducateMedal
      },
      {
        path: 'educate/detail',
        component: EducateDetailMedal
      }
    ]
  },
  {
    path: '/game/judge',
    name: 'JudgeView',
    component: JudgeView
  },
  {
    path: '/game/judgeShow',
    name: 'JudgeShowView',
    component: JudgeShowView
  },
  {
    path: '/game/sporter',
    name: 'SporterView',
    component: SporterView
  },
  {
    path: '/game/sporter/:categoryId/:sporterId',
    component: SporterInfo
  },
  {
    path: '/game/honor',
    name: 'HonorView',
    component: HonorView
  },
  {
    path: '/game/unitType',
    name: 'UnitTypeView',
    component: UnitTypeView
  },
  {
    path: '/game/unitType/:categoryId/:unitTypeId',
    name: 'UnitTypeInfo',
    component: UnitTypeInfo,
    children: [
      {
        path: '',
        component: UnitTypeItemResultInfo
      },
      {
        path: 'itemResult',
        component: UnitTypeItemResultInfo
      },
      {
        path: 'sporter',
        component: UnitTypeSporterInfo
      }
    ]
  },
  {
    path: '/game/item',
    name: 'ItemView',
    component: ItemView
  },
  {
    path: '/game/item/:itemId',
    name: 'ItemInfo',
    component: ItemInfo
  },
  {
    path: '/game/rule',
    name: 'GameRule',
    component: GameRule
  },
  {
    path: '/game/sheet',
    name: 'SheetView',
    component: SheetView
  }
];

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes,
  //路由点击后跳转到页面顶部
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  }
})

export default router
