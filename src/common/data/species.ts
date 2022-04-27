interface Image {
  width: number[];
  height: number[];
  photos: number;
  author: string[];
}

export interface Species {
  id: number;
  warehouse_id: number;
  scientific_name: string;
  common_name: string;
  description: string;
  factsheet?: string;
  flight: string;
  size: string;
  legs: string;
  abdomen: string;
  head: string;
  antennae: string;
  thorax: string;
  notes: string;
  images: Image[];
}
