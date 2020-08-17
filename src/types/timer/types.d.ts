export interface IRetTimer {
  id: number;
  uid: number;
  createTime: number;
  updateTime: number;
  type: number;
  relatedId: number;
  status: number;
}

export interface IAddTimer {
  relatedId?: number;
  type: number;
}

export interface IUpdateTimer {
  id: number;
  createTime?: number;
  type?: number;
}
