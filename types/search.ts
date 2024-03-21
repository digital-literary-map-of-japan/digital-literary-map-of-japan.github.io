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

  value: string | { [key: string | number]: string };
  memberOf?: string;
};

export interface AggregationConfig {
  id: string;
  label: string;
  sort?: string;
  hide?: boolean;
  list?: string[];
}

export interface Bucket {
  key: string;
  doc_count: number;
}

export interface SelectItem {
  title: string;
  value: string;
}

interface Value {
  count: number;
  label: string;
  value: string;
  active: boolean;
}

interface Term {
  url: string;
  values: Value;
}

export interface Facet {
  id: string;
  label: string;
  path: string;
  terms: Term[];
}
