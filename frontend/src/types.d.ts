export interface RegisterMutation {
  email: string;
  phoneNumber: string;
  password: string;
  displayName: string;
  avatar: File | null;
}

export interface User {
  _id: string;
  email: string;
  token: string;
  displayName: string;
  phoneNumber: string;
  role: string;
  avatar: string;
}

export interface RegisterResponse {
  message: string;
  user: User;
}

export interface ValidationError {
  errors: {
    [key: string]: {
      name: string;
      message: string;
    }
  },
  message: string;
  name: string;
  _message: string;
}

export interface GlobalError {
  error: string;
}

export interface LoginMutation {
  email: string;
  password: string;
}

export interface EstateShort {
  user: Types.ObjectId;
  usdPrice: number;
  kgsPrice: number;
  floor: number;
  numberOfFloors: number;
  numberOfRooms: number;
  square: number;
  condition: string;
  town: string;
  images: string[];
  district: string;
  description: string;
  dealType: 'sale' | 'rent';
  landArea: string;
  createdAt: string;
  isPublished: boolean;
  address: string;
  estateType: 'Квартира' | 'Дом' | 'Гараж' | 'Участок' | 'Коммерческое помещение'
}

export interface EstateMutation {
  usdPrice: string;
  kgsPrice: string;
  floor: string;
  numberOfFloors: string;
  numberOfRooms: string;
  square: string;
  condition: string;
  town: string;
  images: File[] | null;
  district: string;
  description: string;
  dealType: 'sale' | 'rent';
  landArea: string;
  address: string;
  estateType: 'Квартира' | 'Дом' | 'Гараж' | 'Участок' | 'Коммерческое помещение'
}

export interface Estate extends EstateShort {
  user: Pick<User, 'displayName' | 'phoneNumber' | 'avatar' | '_id'>
}

export interface FromTo {
  $gte?: number;
  $lte?: number;
}

export type SearchEstate = Partial<Pick<EstateMutation, 'numberOfRooms' | 'town' | 'condition' | 'dealType' | 'estateType'> & {
  usdPrice: FromTo;
  kgsPrice: FromTo;
  floor: FromTo;
}>

export interface IPagination<Type> {
  [key: string]: Type[];
  currentPage: number;
  totalCount: number;
}

export interface PageLimit {
  page?: number;
  limit?: number;
}