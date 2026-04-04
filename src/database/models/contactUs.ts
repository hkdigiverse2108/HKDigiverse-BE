import { model, Schema } from "mongoose";
import { IContactUs } from "../../type";
import { commonFields, commonSchemaOptions, phoneNoSchema } from "./common";

const contactUsSchema = new Schema<IContactUs>(
  {
    name: { type: String },
    phoneNo: phoneNoSchema,
    email: { type: String },
    message: { type: String },
    ...commonFields,
  },
  commonSchemaOptions,
);

export const contactUsModel = model<IContactUs>("contact-us", contactUsSchema);
