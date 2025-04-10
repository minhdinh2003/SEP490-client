export interface ICondition {
    key: string;
    condition: string;
    value: string | number | any;
  }
  
  export interface IPagingParam {
    pageSize: number;
    pageNumber: number;
    conditions?: ICondition[];
    sortOrder?: string;
    searchKey?: string;
    searchFields?: string[];
    includeReferences?: any;
  }
  