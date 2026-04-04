import { Schema } from "mongoose";
import { IBase, IPhoneNo, IValidate } from "./common";

export interface IContactUs extends IBase {
  contactUsId?: Schema.Types.ObjectId;
  name?: string;
  phoneNo?: IPhoneNo;
  email?: string;
  message?: string;
}

export type IContactUsValidate = IValidate & { value: IContactUs };
