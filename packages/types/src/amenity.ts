export enum AmenityType {
  General = 0,
  Room = 1,
  Bathroom = 2,
  Kitchen = 3,
  Entertainment = 4,
  Service = 5,
  Facilities = 6
}

export interface Amenity {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  type: AmenityType;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAmenityDto {
  name: string;
  description?: string;
  icon?: string;
  type: AmenityType;
}

export interface UpdateAmenityDto {
  name?: string;
  description?: string;
  icon?: string;
  isActive?: boolean;
}
