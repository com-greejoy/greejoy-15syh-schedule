/**
 * 群众组证书 Canvas 渲染器（Vue 2 + JS 版）
 *
 * 由于底图（pub-join.jpg / pub-award.jpg）已经包含完整的标题、
 * label、叙事文字与下划横线，本渲染器只负责把动态字段值绘制到
 * 对应横线正上方。
 *
 * 特性：
 *  - 等比缩放底图至传入的最大宽度
 *  - 字段值按 yPercent（横线 y%）+ yOffsetEm（往上抬升 N em）定位
 *  - 长文本宽度超出 maxWidthPercent 时自动缩小字号至 8px 下限
 *  - textAlign 支持 left / center / right
 */

const FONT_FAMILY = '"PingFang SC", "Microsoft YaHei", "Noto Sans SC", sans-serif';
const MIN_FONT_SIZE = 8;

function loadImage(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
}

function calcFontSize(fontSizePercent, canvasHeight) {
  return (fontSizePercent / 100) * canvasHeight;
}

function autoShrinkFont(ctx, text, maxWidth, baseFontSize) {
  let fontSize = baseFontSize;
  ctx.font = `${fontSize}px ${FONT_FAMILY}`;
  while (ctx.measureText(text).width > maxWidth && fontSize > MIN_FONT_SIZE) {
    fontSize -= 1;
    ctx.font = `${fontSize}px ${FONT_FAMILY}`;
  }
  return fontSize;
}

function getFieldValue(data, field) {
  if (!data) return "";
  const value = data[field.fieldKey];
  return value == null ? "" : String(value);
}

function drawTextField(ctx, field, text, canvasWidth, canvasHeight) {
  const baseFontSize = calcFontSize(field.fontSizePercent, canvasHeight);
  const baseX = (field.xPercent / 100) * canvasWidth;
  const lineY = (field.yPercent / 100) * canvasHeight;

  let fontSize = baseFontSize;
  if (field.maxWidthPercent) {
    const maxWidth = (field.maxWidthPercent / 100) * canvasWidth;
    fontSize = autoShrinkFont(ctx, text, maxWidth, baseFontSize);
  }

  // 让文字"坐在横线上"：alphabetic 基线落在横线上方约 0.2 em（视觉留白）
  const baselineY = lineY - fontSize * 0.2;

  ctx.fillStyle = field.color || "#000000";
  ctx.textBaseline = "alphabetic";
  ctx.font = `${fontSize}px ${FONT_FAMILY}`;
  ctx.textAlign = field.textAlign || "center";
  ctx.fillText(text, baseX, baselineY);
}

/**
 * 渲染证书
 *
 * @param {HTMLCanvasElement} canvas
 * @param {{ fields: Array }} config - 来自 certConfig.js
 * @param {string} backgroundUrl     - import 进来的底图 URL
 * @param {Object} data              - 字段数据（certDataBuilder 输出）
 * @param {number} maxWidth          - canvas 最大宽度
 */
export async function renderCert(canvas, config, backgroundUrl, data, maxWidth) {
  if (!canvas) throw new Error("canvas element is null");
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas context not available");

  const bgImg = await loadImage(backgroundUrl);

  const ratio = bgImg.height / bgImg.width;
  const canvasWidth = Math.min(maxWidth, bgImg.width);
  const canvasHeight = canvasWidth * ratio;
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;

  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  ctx.drawImage(bgImg, 0, 0, canvasWidth, canvasHeight);

  const fields = (config && config.fields) || [];
  for (const field of fields) {
    if (field.enabled === false) continue;
    const text = getFieldValue(data, field);
    if (text === "") continue;
    drawTextField(ctx, field, text, canvasWidth, canvasHeight);
  }
}
