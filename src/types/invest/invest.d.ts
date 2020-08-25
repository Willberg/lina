export interface ILend {
  lendType: string;
  lendRate: number;
  lendPeriod: number;
  downPay: string;
  monthlyPay: string;
  totalRepay: string;
  totalInterest: string;
  totalLendRate: number;
  originalTotalRepay: string;
  originalTotalInterest: string;
  originalTotalLendRate: number;
  diff: string;
}

export interface IInvest {
  investType: string;
  total: string;
  totalYearRate: number;
  monthYearRate: number;
  investMoney: string;
  investInterest: string;
  investTotalRate: number;
}
