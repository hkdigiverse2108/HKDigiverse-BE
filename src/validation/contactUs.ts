import Joi from "joi";
import { IContactUs, IId } from "../type";
import { commonApiSchema, CommonFieldSchema, commonPhoneNoSchema, objectId } from "./common";
import { ICommonGetValidate } from "../type";

export const addContactUsSchema = Joi.object<IContactUs>({
  name: Joi.string().required(),
  phoneNo: commonPhoneNoSchema.required(),
  email: Joi.string().email().lowercase(),
  message: Joi.string().optional(),
  ...commonApiSchema,
});

export const editContactUsSchema = Joi.object<IContactUs>({
  contactUsId: objectId().required(),
  name: Joi.string().optional(),
  phoneNo: commonPhoneNoSchema.optional(),
  email: Joi.string().email().lowercase().optional().allow("", null),
  message: Joi.string().optional().allow("", null),
  ...commonApiSchema,
});

export const deleteContactUsSchema = Joi.object<IId>().keys({
  id: objectId().required(),
});

export const getContactUsSchema = Joi.object<ICommonGetValidate>({
  ...CommonFieldSchema,
});
