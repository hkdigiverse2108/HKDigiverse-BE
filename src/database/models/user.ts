import { model, Schema } from "mongoose";
import { IUser } from "../../type";
import { commonFields, commonSchemaOptions, phoneNoSchema } from "./common";

const userSchema = new Schema<IUser>(
  {
    firstName: { type: String, capitalize: true },
    lastName: { type: String, capitalize: true },
    email: { type: String, lowercase: true, trim: true },
    phoneNo: phoneNoSchema,
    password: { type: String },
    profileImage: { type: String },
    otp: { type: Number, default: null },
    otpExpireTime: { type: Date, default: null },
    offers: { type: [String], default: [] },
    logoTitle: { type: String },
    ...commonFields,
  },
  commonSchemaOptions,
);

export const userModel = model<IUser>("user", userSchema);
