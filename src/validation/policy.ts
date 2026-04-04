import Joi from "joi";
import { IGetPolicyByType, IPolicy } from "../type";
import { commonApiSchema } from "./common";
import { POLICY_TYPE } from "../common";

export const updatePolicySchema = Joi.object<IPolicy>().keys({
  type: Joi.string()
    .valid(...Object.values(POLICY_TYPE))
    .required(),
  description: Joi.string().required().allow(""),
  ...commonApiSchema,
});

export const getPolicyByTypeSchema = Joi.object<IGetPolicyByType>().keys({
  typeFilter: Joi.string()
    .valid(...Object.values(POLICY_TYPE))
    .required(),
});
