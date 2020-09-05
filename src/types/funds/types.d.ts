export interface IRetFunds {
  id: number;
  uid: number;
  amount: number;
  memo: string;
  createTime: number;
  updateTime: number;
  category: number;
  type: number;
  status: number;
}

export interface IFundsChartBar {
  color: string;
  value: number;
  show: boolean;
  position?: string;
  adjust?: number;
}
