export interface WasteCollectionSchedule{
    ScheduleID: number;
    UserID: number;
    Latitude: number;
    Longitude: number;
    wasteType: string;
    ScheduledDate: string|Date;
    Status: string;
    Notes: string;
    CreatedAt: string|Date;
}