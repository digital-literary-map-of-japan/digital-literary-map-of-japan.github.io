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
      let [key, value] = pair.split("=") as [string, string];
      key = decodeURIComponent(key || "");

      value = UrlParamsConverter.decodeQuery(value || "");

      const path = key.split(/\]\[|\[|\]/).filter((part) => part);

      let currentStep: NestedObject = result;

      for (let i = 0; i < path.length; i++) {
        const segment = path[i];
        if (segment === undefined) continue;
        if (i === path.length - 1) {
          currentStep[segment] = value;
        } else {
          if (!currentStep[segment]) {
            currentStep[segment] = {};
          }
          currentStep = currentStep[segment] as NestedObject;
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
      const [key, value] = pair.split("=");
      if (key !== undefined && value !== undefined) {
        result[key] = value;
      }
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
