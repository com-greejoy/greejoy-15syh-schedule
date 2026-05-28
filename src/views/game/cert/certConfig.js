/**
 * 群众组电子证书字段坐标配置（硬编码）
 *
 * 设计前提：底图（pub-join.jpg / pub-award.jpg）已经包含完整的
 * 标题、label、叙事文字与下划横线。前端 Canvas 仅在横线正上方
 * 填写动态字段值，不再绘制标题/label/下划线。
 *
 * 坐标体系：所有 x/y/字号均以 canvas 当前宽/高的百分比表示，
 * 横线 y 坐标由像素分析脚本得出（详见 docs 注释）。
 *
 * 字段属性：
 *   fieldKey         数据键（与 certDataBuilder 输出对应）
 *   yPercent         横线中心 y%（文字基线会自动落在横线上方）
 *   xPercent         字段中心 x%（与 textAlign='center' 配合）
 *   maxWidthPercent  横线的有效宽度（长文本自动缩小字号的上限）
 *   fontSizePercent  基准字号（百分比相对 canvasHeight）
 *   textAlign        'left' | 'center' | 'right'，默认 center
 */

import joinBg from "assets/img/cert/pub-join.jpg";
import awardBg from "assets/img/cert/pub-award.jpg";

export const JOIN_CERT_BG = joinBg;
export const AWARD_CERT_BG = awardBg;

// pub-join.jpg 横线（来自像素分析）：
//   姓名横线        y=49.83%  x=[15.76%, 43.15%]  width=27.39%
//   月份小横线       y=57.55%  x=[36.48%, 42.67%]  width=6.18%
//   项目名横线       y=62.44%  x=[57.58%, 74.42%]  width=16.85%
export const JOIN_CERT_CONFIG = {
  fields: [
    {
      fieldKey: "name",
      yPercent: 49.8,
      xPercent: 29.4,
      maxWidthPercent: 25,
      fontSizePercent: 2.1,
      textAlign: "center",
    },
    {
      fieldKey: "monthText",
      yPercent: 57.55,
      xPercent: 39.5,
      maxWidthPercent: 5.5,
      fontSizePercent: 2,
      textAlign: "center",
    },
    {
      fieldKey: "itemStr",
      yPercent: 62.44,
      xPercent: 65.5,
      maxWidthPercent: 16,
      fontSizePercent: 2,
      textAlign: "center",
    },
  ],
};

// pub-award.jpg 横线（来自像素分析）：4 条都横跨 x=[13.59%, 86.53%]，
// 实际是 label + 下划线整体段；下划线净宽推断为 x≈[27%, 86%]，约 59%。
//   竞赛项目       y=48.16%
//   运动员姓名     y=56.47%
//   成绩与名次     y=64.78%
//   时间地点       y=73.09%
export const AWARD_CERT_CONFIG = {
  fields: [
    {
      fieldKey: "raceName",
      yPercent: 48.16,
      xPercent: 56,
      maxWidthPercent: 56,
      fontSizePercent: 2.1,
      textAlign: "center",
    },
    {
      fieldKey: "name",
      yPercent: 56.47,
      xPercent: 56,
      maxWidthPercent: 52,
      fontSizePercent: 2.1,
      textAlign: "center",
    },
    {
      fieldKey: "rankResultText",
      yPercent: 64.78,
      xPercent: 56,
      maxWidthPercent: 52,
      fontSizePercent: 2.1,
      textAlign: "center",
    },
    {
      fieldKey: "timeAndPlaceText",
      yPercent: 73.09,
      xPercent: 56,
      maxWidthPercent: 56,
      fontSizePercent: 2.1,
      textAlign: "center",
    },
  ],
};
