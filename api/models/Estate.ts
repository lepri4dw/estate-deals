import {model, Schema, Types} from "mongoose";
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
  },
  kgsPrice: {
    type: Number,
    min: 0,
  },
  floor: Number,
  numberOfFloors: Number,
  numberOfRooms: Number,
  square: Number,
  condition: {
    type: String,
    required: true,
    enum: ['под самоотделку', 'хорошее', 'среднее', 'не достроено']
  },
  town: String,
  images: [String],
  district: String,
  address: String,
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
    enum: ['Продам', 'Сдам'],
  },
  landArea: String,
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