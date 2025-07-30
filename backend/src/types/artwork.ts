export interface Artwork {
  objectID: number;
  title: string;
  primaryImage: string;
  primaryImageSmall: string;
  artistDisplayName?: string;
  objectDate?: string;
  medium?: string;
  department?: string;
  objectURL?: string;
  culture?: string;
  dynasty?: string;
  period?: string;
  reign?: string;
  portfolio?: string;
  artistRole?: string;
  artistPrefix?: string;
  artistDisplayBio?: string;
  artistSuffix?: string;
  artistAlphaSort?: string;
  artistNationality?: string;
  artistBeginDate?: string;
  artistEndDate?: string;
  artistGender?: string;
  artistWikidata_URL?: string;
  artistULAN_URL?: string;
  creditLine?: string;
  classification?: string;
  rights?: string;
  rightsAndReproduction?: string;
  linkResource?: string;
  metadataDate?: string;
  repository?: string;
  tags?: Array<{
    term: string;
    AAT_URL: string;
    Wikidata_URL: string;
  }>;
}

export interface SearchResponse {
  total: number;
  objectIDs: number[];
}

export interface Department {
  departmentId: number;
  displayName: string;
}

export interface SearchParams {
  hasImages?: boolean;
  isOnView?: boolean;
  isPublicDomain?: boolean;
  artistOrCulture?: boolean;
  medium?: string;
  departmentId?: number;
  geoLocation?: string;
  dateBegin?: number;
  dateEnd?: number;
  q?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  rateLimitInfo?: {
    hasRateLimit: boolean;
    failedBatches: number;
    totalBatches: number;
    successfulArtworks?: number;
    requestedArtworks?: number;
  };
}
