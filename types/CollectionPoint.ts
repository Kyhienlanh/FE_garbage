export interface CollectionPoint {
  PointID: number;
  PointName: string;
  Address: string;
  Latitude: number;
  Longitude: number;
  OpenTime: string | Date;   // có thể parse sang Date nếu cần
  CloseTime: string | Date;
  Type?: string | null;
  Description?: string | null;
  CreatedAt: string | Date;
  UpdatedAt: string | Date;
}
