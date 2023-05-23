import {HydratedDocument, Model, model, Schema} from "mongoose";
import {IUser} from "../types";
import bcrypt from "bcrypt";
import {randomUUID} from "crypto";

const SALT_WORK_FACTOR = 10;

interface IUserMethods {
  checkPassword(password: string): Promise<boolean>;
  generateToken(): void;
}

type UserModel = Model<IUser, {}, IUserMethods>;

const UserSchema = new Schema<IUser, UserModel, IUserMethods>({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: async function (this: HydratedDocument<IUser>, email: string): Promise<boolean> {
        if (!this.isModified('email')) return true;
        const user: HydratedDocument<IUser> | null = await User.findOne({email});
        return !Boolean(user);
      },
      message: 'This user is already registered'
    }
  },
  phoneNumber: {
    type: String,
    validate: [
      {
        validator: async function (
          this: HydratedDocument<IUser>,
          phoneNumber: string,
        ): Promise<boolean> {
          if (!phoneNumber) {
            return true;
          }

          if (!this.isModified('phoneNumber')) {
            return true;
          }

          const user = await User.findOne({
            phoneNumber,
          });

          return !user;
        },
        message: 'Пользователь с таким номером телефона уже зарегистрирован!',
      },
      {
        validator: function (phoneNumber: string): boolean {
          if (!phoneNumber) {
            return true;
          }

          const regex = /^\+996\d{9}$/;
          return regex.test(phoneNumber);
        },
        message: 'Неверный формат номера телефона!',
      },
    ],
  },
  displayName: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
    default: 'user',
    enum: ['user', 'admin']
  },
  avatar: {
    type: String,
  },
  googleId: String,
});

UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
  this.password = await bcrypt.hash(this.password, salt);

  next();
});

UserSchema.set('toJSON', {
  transform: (doc, ret, _options) => {
    delete ret.password;
    return ret;
  }
});

UserSchema.methods.checkPassword = function(password) {
  return bcrypt.compare(password, this.password);
};

UserSchema.methods.generateToken = function() {
  this.token = randomUUID();
};

const User = model<IUser, UserModel>('User', UserSchema);

export default User;