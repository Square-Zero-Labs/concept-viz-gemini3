export interface VisualizationResponse {
  html: string;
  explanation: string;
  title: string;
}

export enum ViewMode {
  VISUALIZATION = 'VISUALIZATION',
  CODE = 'CODE',
}

export interface HistoryItem {
  id: string;
  concept: string;
  timestamp: number;
  data: VisualizationResponse;
}