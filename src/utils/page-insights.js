import _ from "lodash";
import fetch from "node-fetch";

const getLpc = (data) => {
  const path = "metrics.LARGEST_CONTENTFUL_PAINT_MS.category";
  return (
    _.get(data, `loadingExperience.${path}`) ||
    _.get(data, `originLoadingExperience.${path}`) ||
    "NO_DATA"
  );
};

const getFid = (data) => {
  const path = "metrics.FIRST_INPUT_DELAY_MS.category";
  return (
    _.get(data, `loadingExperience.${path}`) ||
    _.get(data, `originLoadingExperience.${path}`) ||
    "NO_DATA"
  );
};

const getCls = (data) => {
  const path = "metrics.CUMULATIVE_LAYOUT_SHIFT_SCORE.category";
  return (
    _.get(data, `loadingExperience.${path}`) ||
    _.get(data, `originLoadingExperience.${path}`) ||
    "NO_DATA"
  );
};

const getScore = (data) => {
  const path = "lighthouseResult.categories.performance.score";
  return Math.round(_.get(data, path, 0) * 100);
};

export const getPageSpeedInsights = async (url, device) => {
  const reqUrl = new URL(process.env.PAGESPEED_URI);
  reqUrl.searchParams.append("key", process.env.PAGESPEED_KEY);
  reqUrl.searchParams.append("strategy", device);
  reqUrl.searchParams.append("url", url);

  const response = await fetch(reqUrl.href);
  const rawData = await response.json();

  return {
    score: getScore(rawData),
    device: device,
    web_vitals: {
      lcp: getLpc(rawData),
      fid: getFid(rawData),
      cls: getCls(rawData),
    },
  };
};
