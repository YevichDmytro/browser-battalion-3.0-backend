import { model, Schema } from 'mongoose';

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    userName: {
      type: String,
    },
    gender: {
      type: String,
      enum: ['male', 'female'],
      default: 'female',
    },
    waterRate: {
      type: Number,
      default: 50,
    },
    photo: {
      type: String,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

const UsersCollection = model('users', userSchema);
export default UsersCollection;
