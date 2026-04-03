import { model, Schema } from "mongoose";
import { commonFields, commonSchemaOptions } from "./common";
import { IGallery } from "../../type";

const gallerySchema = new Schema<IGallery>(
  {
    title: { type: String },
    images: { type: [String] },
    ...commonFields,
  },
  commonSchemaOptions,
);

export const galleryModel = model<IGallery>("gallery", gallerySchema);
