export type NestedObject = {
    [key: string]: any; // string | number | boolean | NestedObject | null;
  };

  export type Filter = {
    filter?: FilterInput;
  };

  export type FilterInput = {
    [key: string]: string;
  };

  export type FilterCondition = {
    path: string;
    operator:
      | "eq"
      | "starts_with"
      | "ends_with"
      | "in"
      | "contains"
      | "neq"
      | "nin"
      | ">"
      | ">="
      | "<"
      | "<="
      | "ncontains"
      | "BETWEEN"
      | "NOT BETWEEN"
      | "IS NULL"
      | "IS NOT NULL"
      | "is_not_null";
      
    value: string | {[key: string | number]: string}
    memberOf?: string;
  };