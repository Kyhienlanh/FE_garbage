export interface WasteCollectionSchedule{
    scheduleID: number;
    userID: number;
    latitude: number;
    longitude: number;
    wasteType: string;
    scheduledDate: string|Date;
    status: string;
    notes: string;
    createdAt: string|Date;
}