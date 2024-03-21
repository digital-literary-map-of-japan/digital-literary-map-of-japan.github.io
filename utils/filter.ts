import type { NestedObject } from "~/types/filter";

class UrlParamsConverter {
  static fullPathToNestedObject(fullPath: string) {
    const queryString = fullPath.split("?")[1] || "";
    return UrlParamsConverter.urlParamsToObject(queryString);
  }

  static urlParamsToObject(paramStr: string): NestedObject {
    const result: NestedObject = {};

    if (!paramStr) return result;

    const pairs = paramStr.split("&");

    if (!pairs.length) return result;

    pairs.forEach((pair) => {
      let [key, value] = pair.split("=");
      key = decodeURIComponent(key);

      value = UrlParamsConverter.decodeQuery(value);

      const path = key.split(/\]\[|\[|\]/).filter((part) => part);

      let currentStep: NestedObject = result;

      for (let i = 0; i < path.length; i++) {
        if (i === path.length - 1) {
          currentStep[path[i]] = value;
        } else {
          if (!currentStep[path[i]]) {
            currentStep[path[i]] = {};
          }
          currentStep = currentStep[path[i]] as NestedObject;
        }
      }
    });

    return result;
  }

  static decodeQuery(query: string): string {
    return decodeURIComponent(query.replace(/\+/g, " "));
  }

  static objectToFlatObject(query: NestedObject) {
    const queryString = UrlParamsConverter.objectToUrlParams(query);
    return UrlParamsConverter.urlParamsToFlatObject(queryString);
  }

  static urlParamsToFlatObject(paramStr: string): { [key: string]: string } {
    const result: { [key: string]: string } = {};
    const pairs = paramStr.split("&");

    pairs.forEach((pair) => {
      let [key, value] = pair.split("=");
      result[key] = value;
    });

    return result;
  }

  static objectToUrlParams(obj: NestedObject, prefix: string = ""): string {
    let parts: string[] = [];

    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        let value = obj[key];
        let newKey = prefix ? `${prefix}[${key}]` : key;

        if (
          typeof value === "object" &&
          value !== null &&
          !Array.isArray(value)
        ) {
          parts.push(
            UrlParamsConverter.objectToUrlParams(value as NestedObject, newKey)
          );
        } else {
          parts.push(
            // encodeURIComponent(newKey) + "=" + encodeURIComponent(String(value))

            newKey + "=" + String(value)
          );
        }
      }
    }

    return parts.join("&");
  }
}

export default UrlParamsConverter;
