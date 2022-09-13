export interface IOj {
  id?: number;
  pid?: number;
  name?: string;
  difficulty?: string;
  ojType?: number;
  type?: string;
  preTime?: number;
  useTime?: number;
  standalone?: string;
  study?: string;
  link?: string;
  ansLink?: string;
  importance?: number;
  createTime?: number;
  updateTime?: number;
  status?: number;
}

export interface IOjUpdate {
  id: number;
  pid?: number | undefined;
  name?: string | undefined;
  difficulty?: string | undefined;
  ojType?: number | undefined;
  type?: string | undefined;
  preTime: number;
  useTime?: number | undefined;
  standalone?: string | undefined;
  study?: string | undefined;
  link?: string | undefined;
  ansLink?: string | undefined;
  importance?: number | undefined;
  status?: number | undefined;
}

export interface ISummary {
  difficulty: string;
  cnt0: number;
  cnt1: number;
  cnt2: number;
  cnt3: number;
  total: number;
  percent: number;
}
