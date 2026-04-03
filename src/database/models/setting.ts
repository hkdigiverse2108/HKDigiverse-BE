import { model, Schema } from "mongoose";
import { ISetting, ISocialMediaLink } from "../../type";
import { commonFields, commonSchemaOptions, phoneNoSchema } from "./common";

const socialMediaLinkSchema = new Schema<ISocialMediaLink>(
  {
    title: { type: String },
    link: { type: String },
    icon: { type: String },
    isActive: { type: Boolean, default: true },
  },
  {
    _id: false,
  },
);

const settingSchema = new Schema<ISetting>(
  {
    email: { type: String, lowercase: true, trim: true },
    phoneNo: phoneNoSchema,
    address: { type: String },
    mapLink: { type: String },
    logo: { type: String },
    favicon: { type: String },
    socialMediaLinks: { type: [socialMediaLinkSchema], default: [] },
    ...commonFields,
  },
  commonSchemaOptions,
);

export const settingModel = model<ISetting>("setting", settingSchema);
