type Image = {
  width: number[];
  height: number[];
  author: string[];
};

export type Species = {
  id: number;
  warehouseId: number;
  scientificName: string;
  commonName: string;
  description: string;
  factsheet?: string;
  flight: string;
  size: string;
  legs?: string;
  abdomen: string;
  head?: string;
  antennae?: string;
  thorax: string;
  notes: string;
  images: Image[];
};
