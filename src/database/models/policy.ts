import { model, Schema } from "mongoose";
import { IPolicy } from "../../type";
import { commonFields, commonSchemaOptions } from "./common";
import { POLICY_TYPE } from "../../common";

const policySchema = new Schema<IPolicy>(
  {
    type: { type: String, enum: Object.values(POLICY_TYPE) },
    description: { type: String },
    ...commonFields,
  },
  commonSchemaOptions,
);

export const policyModel = model<IPolicy>("policy", policySchema);
