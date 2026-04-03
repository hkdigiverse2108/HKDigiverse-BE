import Joi from "joi";
import { ICommonGetValidate, ISetting, ISocialMediaLink } from "../type";
import { commonApiSchema, CommonFieldSchema, commonPhoneNoSchema } from "./common";
import { SOCIAL_MEDIA_TYPE } from "../common";

const socialMediaLinkSchema = Joi.object<ISocialMediaLink>().keys({
  title: Joi.string()
    .valid(...Object.values(SOCIAL_MEDIA_TYPE))
    .default(SOCIAL_MEDIA_TYPE.INSTAGRAM)
    .optional()
    .allow(null),
  link: Joi.string().required().allow(""),
  icon: Joi.string().required().allow(""),
  ...commonApiSchema,
});

export const updateSettingSchema = Joi.object<ISetting>().keys({
  email: Joi.string().email().optional().allow(""),
  phoneNo: commonPhoneNoSchema.optional(),
  address: Joi.string().optional().allow(""),
  mapLink: Joi.string().optional().allow(""),
  logo: Joi.string().optional().allow("", null),
  favicon: Joi.string().optional().allow("", null),
  socialMediaLinks: Joi.array().items(socialMediaLinkSchema).optional(),
  ...commonApiSchema,
});

export const getUserSchema = Joi.object<ICommonGetValidate>().keys({
  ...CommonFieldSchema,
});
