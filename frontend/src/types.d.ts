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
  _id: string;
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
  description: string;
  dealType: 'sale' | 'rent';
  landArea: number;
  createdAt: string;
  isPublished: boolean;
  address: string;
  estateType: string;
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
  description: string;
  dealType: string;
  landArea: string;
  address: string;
  estateType: string;
}

export interface Estate extends EstateShort {
  user: Pick<User, 'displayName' | 'phoneNumber' | 'avatar' | '_id'>
}

export interface FromTo {
  $gte?: number;
  $lte?: number;
}

export type SearchEstate = Partial<Pick<EstateMutation, 'numberOfRooms' | 'town' | 'condition' | 'dealType' | 'estateType' | 'isPublished'> & {
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