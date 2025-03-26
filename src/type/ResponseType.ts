
export interface ResponData {
  Success: Boolean;
  Message: string | null;
  Data:any
  StatusCode: number;
  DevMessage:string |  null;
}
export interface ResponError extends ResponData {
  Success: false;
}
export interface LoginResType extends ResponData  {
  data: {
    token: string
    email: string
    fullName: string
    role: string
  };
};
