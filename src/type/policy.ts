import { IBase, IValidate } from "./common";

export interface IPolicy extends IBase {
  type: string;
  description: string;
}

export type IPolicyValidate = IValidate & { value: IPolicy };

export type IGetPolicyByType = {
  typeFilter: string;
};

export type IGetPolicyByTypeValidate = IValidate & { value: IGetPolicyByType };
