import { Schema } from "mongoose";
import { IBase, IPhoneNo, IValidate } from "./common";

export interface IUser extends IBase {
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNo?: IPhoneNo;
  profileImage?: string;
  password?: string;
  showPassword?: string;
  otp?: number;
  otpExpireTime?: Date;
  offers?: string[];
  logoTitle?: string;
  userId?: Schema.Types.ObjectId;
}

export type IUserValidate = IValidate & { value: IUser };
