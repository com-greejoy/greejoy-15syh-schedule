export const myPrintData = {
  raceName: "hello world"
};

export const myTemplate = {
  panels: [
    {
      index: 0,
      name: 1,
      height: 297,
      width: 210,
      paperHeader: 49.5,
      paperFooter: 780,
      printElements: [
        {
          options: {
            left: 165,
            top: 477.5,
            height: 30,
            width: 223.5,
            title: "竞赛项目",
            field: "raceName",
            testData: "XXX",
            coordinateSync: false,
            widthHeightSync: false,
            fontSize: 16,
            qrCodeLevel: 0,
            right: 285.4921875,
            bottom: 486.4921875,
            vCenter: 225.4921875,
            hCenter: 481.6171875
          },
          printElementType: { title: "文本", type: "text" }
        }
      ],
      paperNumberLeft: 565.5,
      paperNumberTop: 819,
      paperNumberContinue: true,
      watermarkOptions: {
        content: "vue-plugin-hiprint",
        rotate: 25,
        timestamp: true,
        format: "YYYY-MM-DD HH:mm"
      },
      panelLayoutOptions: {}
    }
  ]
};

export const myTemplate2 = {
  panels: [
    {
      index: 0,
      name: 1,
      height: 297,
      width: 210,
      paperHeader: 49.5,
      paperFooter: 780,
      printElements: [
        {
          options: {
            left: 165,
            top: 477.5,
            height: 30,
            width: 223.5,
            title: "竞赛项目123",
            field: "raceName",
            testData: "XXX",
            coordinateSync: false,
            widthHeightSync: false,
            fontSize: 16,
            qrCodeLevel: 0,
            right: 285.4921875,
            bottom: 486.4921875,
            vCenter: 225.4921875,
            hCenter: 481.6171875
          },
          printElementType: { title: "这是更新后的元素", type: "text" }
        }
      ],
      paperNumberLeft: 565.5,
      paperNumberTop: 819,
      paperNumberContinue: true,
      watermarkOptions: {
        content: "成都市第十五届运动会",
        rotate: 25,
        timestamp: false,
        format: "YYYY-MM-DD HH:mm",
        fillStyle: "rgba(184, 184, 184, 0.3)",
        fontSize: "14px",
        width: 200,
        height: 200
      },
      panelLayoutOptions: {
        layoutType: "column",
        layoutRowGap: 0,
        layoutColumnGap: 0
      }
    }
  ]
};
