export interface SourceMap {
  version: number;
  file: string;
  sources: string[];
  sourcesContent: string[];
  names: string[];
  mappings: string;
}

export interface CacheSourceMap {
  sources: string[];
  mappingsCoordinate: number[][][];
}

export interface CacheCode {
  code: string;
  map?: SourceMap;
}
