import { Schema } from "mongoose";
import { IBase, IValidate } from "./common";

export interface IGallery extends IBase {
  title?: string;
  images?: string[];
  galleryId?: Schema.Types.ObjectId;
}

export type IGalleryValidate = IValidate & { value: IGallery };
