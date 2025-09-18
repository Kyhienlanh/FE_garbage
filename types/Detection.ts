
export interface Detection {
  label: string;
  display_name: string;
  confidence: number;
  category: string;
}

export interface ScanResult {
  photo: string;           
  processedPhoto: string;   
  detections: Detection[];
}
