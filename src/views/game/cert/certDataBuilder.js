/**
 * 群众组证书渲染数据组装
 *
 * 输入：getJoinSporter 接口返回的 sporter 对象（含 raceList / resultList）
 * 输出：传给 useCanvasRenderer.renderCert 的字段数据对象
 *
 * 注意：底图（pub-join / pub-award）已经包含完整的叙事文字与 label，
 * 这里只需要返回填入横线上方的"动态值"。
 */
import dayjs from "dayjs";

function pickEarliestRace(raceList) {
  if (!Array.isArray(raceList) || raceList.length === 0) return null;
  const withDate = raceList
    .filter((r) => r && r.matchDate)
    .sort(
      (a, b) => new Date(a.matchDate).getTime() - new Date(b.matchDate).getTime()
    );
  return withDate[0] || null;
}

function findRaceByRaceId(raceList, raceId) {
  if (!Array.isArray(raceList) || raceList.length === 0 || raceId == null)
    return null;
  return raceList.find((r) => r && String(r.raceId) === String(raceId)) || null;
}

function formatMonthNumber(matchDate) {
  if (!matchDate) return "";
  const d = dayjs(matchDate);
  if (!d.isValid()) return "";
  return String(d.month() + 1);
}

function formatDate(matchDate) {
  if (!matchDate) return "";
  const d = dayjs(matchDate);
  if (!d.isValid()) return "";
  return d.format("YYYY.MM");
}

/**
 * 构建「参赛证书」数据
 *
 * 返回字段（与 certConfig.JOIN_CERT_CONFIG 对应）：
 * - name      运动员姓名
 * - monthText 月份数字（如 "8"）；matchDate 全空时返回 ""，前端留空
 * - itemStr   所属大项名
 */
export function buildJoinCertData(sporter) {
  if (!sporter) return null;
  const earliestRace = pickEarliestRace(sporter.raceList);
  return {
    name: sporter.name || "",
    monthText: formatMonthNumber(earliestRace && earliestRace.matchDate),
    itemStr: sporter.itemStr || "",
  };
}

/**
 * 构建「获奖证书」数据
 *
 * 返回字段（与 certConfig.AWARD_CERT_CONFIG 对应）：
 * - name              运动员姓名
 * - raceName          竞赛项目名称
 * - rankResultText    成绩与名次组合："第 X 名  result"
 * - timeAndPlaceText  时间地点："YYYY.MM.DD 地址" / 仅日期 / 仅地址 / ""
 */
export function buildAwardCertData(sporter, resultItem) {
  if (!sporter || !resultItem) return null;
  const race = findRaceByRaceId(sporter.raceList, resultItem.raceId);
  const dateText = formatDate(race && race.matchDate);
  const addressText = (race && race.matchAddress) || "";

  let timeAndPlaceText;
  if (dateText && addressText) {
    timeAndPlaceText = `${dateText} ${addressText}`;
  } else if (dateText) {
    timeAndPlaceText = dateText;
  } else if (addressText) {
    timeAndPlaceText = addressText;
  } else {
    timeAndPlaceText = "";
  }

  const orderIndex = resultItem.orderIndex;
  const resultText = resultItem.result == null ? "" : String(resultItem.result);
  const rankPart = orderIndex == null ? "" : `第 ${orderIndex} 名`;
  const rankResultText = [rankPart, resultText].filter(Boolean).join("  ");

  return {
    name: sporter.name || "",
    raceName: resultItem.raceName || "",
    rankResultText,
    timeAndPlaceText,
  };
}
