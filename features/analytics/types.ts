export interface ActivityPoint {
  date: string;
  count: number;
}

export interface ActivityDistribution {
  name: string;
  value: number;
}

export interface FeatureTime {
  feature: string;
  totalTime: number;
  avgTime: number;
}

export interface HeatmapPoint {
  hour: number;
  count: number;
}

export interface AnalyticsData {
  totalEnfants: number;
  storiesRead: number;
  scannedTexts: number;
  imagesGenerated: number;
  educationalTexts: number;
  dictionaryUses: number;
  avgSessionTime: number;
  totalAppTime: number;
  dailyActivity: ActivityPoint[];
  distribution: ActivityDistribution[];
  timePerFeature: FeatureTime[];
  heatmap: HeatmapPoint[];
}
