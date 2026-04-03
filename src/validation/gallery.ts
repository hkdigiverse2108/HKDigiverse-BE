import Joi from "joi";
import { ICommonGetValidate, IGallery, IId } from "../type";
import { commonApiSchema, CommonFieldSchema, objectId } from "./common";

export const addGallerySchema = Joi.object<IGallery>().keys({
  title: Joi.string().optional().allow(""),
  images: Joi.array().items(Joi.string()).optional().allow("", null),
  ...commonApiSchema,
});

export const editGallerySchema = Joi.object<IGallery>().keys({
  galleryId: objectId().required(),
  title: Joi.string().optional().allow(""),
  images: Joi.array().items(Joi.string()).optional().allow("", null),
  ...commonApiSchema,
});

export const deleteGallerySchema = Joi.object<IId>().keys({
  id: objectId().required(),
});

export const getGallerySchema = Joi.object<ICommonGetValidate>().keys({
  ...CommonFieldSchema,
});
