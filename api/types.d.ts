import {Types} from "mongoose";

export type SwitchToString<Type> = {
  [Property in keyof Type]?: string;
};

export interface PageLimit {
  page?: string;
  limit?: string;
}

export type SearchParam = {
  [field: string]: string | number | boolean;
};

export interface IUser {
  email: string;
  displayName: string
  password: string;
  token: string;
  phoneNumber: string;
  role: string;
  avatar: string;
  googleId?: string;
  verifyEmailToken: string | null;
  verified: boolean;
}

export interface IEstate {
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
  estateType: 'Квартира' | 'Дом' | 'Гараж' | 'Участок' | 'Коммерческое помещение'
}