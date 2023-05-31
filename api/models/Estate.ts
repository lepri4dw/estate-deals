import {HydratedDocument, model, Schema, Types} from "mongoose";
import User from "./User";
import {IEstate} from "../types";

const EstateSchema = new Schema<IEstate>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    validate: {
      validator: async (value: Types.ObjectId) => await User.findById(value),
      message: 'User does not exist',
    },
  },
  usdPrice: {
    type: Number,
    min: 0,
    validate: {
      validator: function (this: HydratedDocument<IEstate>, price: number) {
        return !(!this.kgsPrice && !price);
      },
      message: 'Введите цену в выбранной валюте!',
    }
  },
  kgsPrice: {
    type: Number,
    min: 0,
    validate: {
      validator: function (this: HydratedDocument<IEstate>, price: number) {
        return !(!this.usdPrice && !price);
      },
      message: 'Введите цену в выбранной валюте!',
    }
  },
  floor: Number,
  numberOfFloors: Number,
  numberOfRooms: Number,
  square: Number,
  condition: {
    type: String,
    enum: ['под самоотделку', 'хорошее', 'среднее', 'не достроено', '']
  },
  town: {type: String, required: true},
  images: {
  type: [String],
    validate: {
      validator: (images: string[]) => {
        return images.length > 0;
      },
      message: 'Загрузите минимум одну фотографию!',
    }
  },
  address: {type: String, required: true},
  estateType: {
    type: String,
    required: true,
    enum: ['Квартира', 'Дом', 'Гараж', 'Участок', 'Коммерческое помещение'],
  },
  description: {
    type: String,
    required: true,
  },
  dealType: {
    type: String,
    required: true,
    enum: ['sale', 'rent'],
  },
  landArea: Number,
  isPublished: {
    type: Boolean,
    required: true,
    default: false,
  }
},
  {timestamps: true}
);

const Estate = model<IEstate>('Estate', EstateSchema);
export default Estate;