import {model, Schema, Types} from "mongoose";
import User from "./User";

const EstateSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    validate: {
      validator: async (value: Types.ObjectId) => await User.findById(value),
      message: 'User does not exist',
    },
  },
  price: {
    usd: {
      type: Number,
      min: 0,
    },
    kg: {
      type: Number,
      min: 0,
    }
  },
  floor: Number,
  numberOfFloors: Number,
  numberOfRooms: Number,
  square: Number,
  condition: String,
  town: String,
  images: [String],
  district: String,
  description: {
    type: String,
    required: true,
  },
  dealType: {
    type: String,
    required: true,
    enum: ['sale', 'rent'],
  },
},
  {timestamps: true},
);

const Estate = model('Estate', EstateSchema);
export default Estate;