export interface Field {
  id: string;
  name: string;
  location: string;
  zone: string;
  description?: string;
  pricePerHour: number;
  sportsType: string;
  hasLighting: boolean;
  hasChangingRooms: boolean;
  hasParking: boolean;
  isCovered: boolean;
  isActive: boolean;
  ownerId: string;
  ownerName: string;
  createdAt: string;
}

export type FieldPayload = Omit<
  Field,
  'id' | 'isActive' | 'ownerId' | 'ownerName' | 'createdAt'
>;
