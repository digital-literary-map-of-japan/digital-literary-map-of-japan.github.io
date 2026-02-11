import UrlParamsConverter from "~/utils/filter";
import type { FilterInput } from "~/types/filter";

/**
 * Truncate a string to the given number of characters.
 * @param text Text to truncate.
 * @param num Number of characters to truncate to. Default is 20.
 */
const truncate = (text: string, num: number = 20): string => {
  return text.length > num ? text.slice(0, num) + "..." : text;
};

/**
 * Extract keyword queries from the current route.
 */
const getKeywordQueries = (): { queries: any; keywords: string[] } => {
  const query = useRoute().query;
  const queries: any = {};
  const keywords: string[] = [];

  for (const key in query) {
    if (key.startsWith("q-") || key.startsWith("f-")) {
      const field = key.replace("q-", "").replace("f-", "");
      queries[field] = queries[field] || [];

      const values = Array.isArray(query[key]) ? query[key] : [query[key]];
      if (!values) continue;
      for (const value of values) {
        if (!queries[field].includes(value)) queries[field].push(value);
      }
    } else if (key === "keyword") {
      const values = Array.isArray(query[key]) ? query[key] : [query[key]];
      if (!values) continue;
      // あとで！！！
      /*
      if(typeof values === 'string') values = [values];
      keywords.push(...values.filter(Boolean));
      */
    }
  }

  return { queries, keywords };
};

/**
 * Given an input text, this function will highlight all the query values that match a given key.
 * The matching values will be wrapped inside a `<span>` with the class `highlight`.
 *
 * @param {string} text - The text in which to find and highlight matches.
 * @param {string} key - The key to highlight.
 * @returns {string} - The text with highlighted matches.
 */
const highlight = (text: string, key: string): string => {
  if (!text) return text;

  const route = useRoute();
  const queryString = route.fullPath.split("?")[1] || "";
  // const decompressed = UrlParamsConverter.decompress(queryString);
  // const queryObject: any = UrlParamsConverter.urlParamsToObject(decompressed);

  text = String(text).trim();

  const queryValues: string[] = [];
  // const filter = queryObject.filter || {};

  /*
  for (let filterId in filter) {
    const condition = filter[filterId].condition;
    if (condition && [key, "q"].includes(condition.path)) {
      const value = condition.value;
      if(typeof value === 'string') {
        queryValues.push(value);
      } else {
        for(const key in value) {
          queryValues.push(value[key]);
        }
      }
    }
  }
  */

  // Remove duplicates and sort in descending order based on length.
  const candidates = [...new Set(queryValues)].sort(
    (a, b) => b.length - a.length
  );

  for (let value of candidates) {
    value = value.replace(/"/g, ""); // Remove quotes
    const regexp = new RegExp(value, "gi");
    text = text.replace(
      regexp,
      (match) => `<span class="highlight">${match}</span>`
    );
  }

  return text;
};

// フィールドの値を翻訳する関数
const translate = (key: string, value: string, t: any) => {
  // , translatedFields: string[] = translatedFields_
  // const {t} = useI18n();
  const appConfig = useAppConfig();

  // const translatedFields_ = appConfig.translateFields || [];
  const translatedFields = appConfig.translateFields || [];

  /*
  if (translatedFields.includes(key)) {
    return t(value);
  }
  */

  return value;
};

let getTargetValues = (route: { fullPath: string }, id: string) => {
  const targetValues = {
    in: [] as string[],
    nin: [] as string[],
  };
  const queryString = route.fullPath.split("?")[1] || "";
  const queryObject = UrlParamsConverter.urlParamsToObject(queryString);
  const filter: FilterInput = queryObject.filter as FilterInput;

  // props.

  if (typeof filter === "object") {
    for (const filterId in filter) {
      if (
        /* typeof filter[filterId] === "object" &&
        filter[filterId]?.condition?.path === id &&
        ["in", "nin"].includes(String(filter[filterId]?.condition?.operator)) */ false
      ) {
        /*
        const condition = filter[filterId].condition;
        const value = condition?.value;
        const operator = condition?.operator;
        if (typeof value === "object") {
          for (const key in value as object) {
            const v = value[key];
            if (operator === "in") {
              targetValues.in.push(v);
            } else if (operator === "nin") {
              targetValues.nin.push(v);
            }
          }
        }
        */
      }
    }
  }
  return targetValues;
};

export { truncate, highlight, translate, getTargetValues };
