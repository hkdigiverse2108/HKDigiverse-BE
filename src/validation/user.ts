import Joi from "joi";
import { ICommonGetValidate, IId, IUser } from "../type";
import { baseApiSchema, baseCommonFieldSchema, commonContactSchema, objectId } from "./common";

export const addUserSchema = Joi.object<IUser>().keys({
  firstName: Joi.string().optional().allow(""),
  lastName: Joi.string().optional().allow(""),
  email: Joi.string().email().optional().allow(""),
  phoneNo: commonContactSchema.optional(),
  password: Joi.string().optional().allow(""),
  profileImage: Joi.string().optional().allow("", null),
  otp: Joi.number().optional().allow(null),
  otpExpireTime: Joi.date().optional().allow(null),
  offers: Joi.array().items(Joi.string()).optional(),
  logoTitle: Joi.string().optional().allow("", null),
  ...baseApiSchema,
});

export const editUserSchema = Joi.object<IUser>().keys({
  userId: objectId().required(),
  firstName: Joi.string().optional().allow(""),
  lastName: Joi.string().optional().allow(""),
  email: Joi.string().email().optional().allow(""),
  phoneNo: commonContactSchema.optional(),
  password: Joi.string().optional().allow(""),
  profileImage: Joi.string().optional().allow("", null),
  otp: Joi.number().optional().allow(null),
  otpExpireTime: Joi.date().optional().allow(null),
  offers: Joi.array().items(Joi.string()).optional(),
  logoTitle: Joi.string().optional().allow("", null),
  ...baseApiSchema,
});

export const deleteUserSchema = Joi.object<IId>().keys({
  id: objectId().required(),
});

export const getUserSchema = Joi.object<ICommonGetValidate>().keys({
  ...baseCommonFieldSchema,
});
