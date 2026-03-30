export const myTemplate = {
  panels: [
    {
      index: 0,
      name: 1,
      height: 296.6,
      width: 210,
      paperHeader: 49.5,
      paperFooter: 778.9494949494949,
      printElements: [
        {
          options: {
            left: 192,
            top: 351,
            height: 42,
            width: 402,
            title: "竞赛名称",
            right: 616.5,
            bottom: 392.9999771118164,
            vCenter: 415.5,
            hCenter: 371.9999771118164,
            field: "raceName",
            testData: "",
            coordinateSync: false,
            widthHeightSync: false,
            fontSize: 21.75,
            textContentVerticalAlign: "bottom",
            lineHeight: 22.5,
            qrCodeLevel: 0,
            hideTitle: true
          },
          printElementType: { title: "文本", type: "text" }
        },
        {
          options: {
            left: 192,
            top: 411,
            height: 42,
            width: 403.5,
            title: "运动员姓名",
            right: 519,
            bottom: 448.5000228881836,
            vCenter: 299.25,
            hCenter: 427.5000228881836,
            field: "sporterName",
            testData: "",
            coordinateSync: false,
            widthHeightSync: false,
            fontSize: 21.75,
            textContentVerticalAlign: "bottom",
            lineHeight: 22.5,
            qrCodeLevel: 0,
            qid: "raceName_1",
            hideTitle: true
          },
          printElementType: { title: "文本", type: "text" }
        },
        {
          options: {
            left: 192,
            top: 471,
            height: 42,
            width: 400.5,
            title: "名次与成绩",
            right: 504.99371337890625,
            bottom: 555.9937362670898,
            vCenter: 285.24371337890625,
            hCenter: 534.9937362670898,
            field: "result",
            testData: "",
            coordinateSync: false,
            widthHeightSync: false,
            fontSize: 21.75,
            textContentVerticalAlign: "bottom",
            lineHeight: 22.5,
            qrCodeLevel: 0,
            qid: "raceName_2",
            hideTitle: true
          },
          printElementType: { title: "文本", type: "text" }
        },
        {
          options: {
            left: 192,
            top: 531,
            height: 42,
            width: 396,
            title: "比赛地点",
            right: 522,
            bottom: 573.0000457763672,
            vCenter: 302.25,
            hCenter: 552.0000457763672,
            field: "address",
            testData: "",
            coordinateSync: false,
            widthHeightSync: false,
            fontSize: 21.75,
            textContentVerticalAlign: "bottom",
            lineHeight: 22.5,
            qrCodeLevel: 0,
            qid: "raceName_3",
            hideTitle: true
          },
          printElementType: { title: "文本", type: "text" }
        }
      ],
      paperNumberLeft: 565.5,
      paperNumberTop: 819,
      paperNumberDisabled: true,
      paperNumberContinue: true,
      watermarkOptions: {
        content: "",
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
